import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  productSchema,
  categorySchema,
} from "@/lib/validation/product.schema";
import { validateImageMagicBytes } from "@/lib/uploads/image-service";
import {
  createProductAction,
  updateProductAction,
  softDeleteProductAction,
  restoreProductAction,
} from "@/lib/products/admin-actions";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock requireAdmin guard
const mockRequireAdmin = vi.fn();
vi.mock("@/lib/auth/guards", () => ({
  requireAdmin: () => mockRequireAdmin(),
}));

// Mock logAdminAction
const mockLogAdminAction = vi.fn();
vi.mock("@/lib/audit/log", () => ({
  logAdminAction: (params: any) => mockLogAdminAction(params),
}));

// Mock Supabase server client
const mockFrom = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

describe("Phase 10: Product & Category Validation Schemas", () => {
  const validUUID = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22";

  it("validates legitimate specialty product input", () => {
    const res = productSchema.safeParse({
      name: "Colombia Huila Geisha",
      slug: "colombia-huila-geisha",
      description: "Floral jasmine notes with honey sweetness.",
      categoryId: validUUID,
      priceMinor: 45000, // ৳450.00
      imagePath: "/images/products/huila.jpg",
      ingredients: ["Jasmine", "Bergamot", "Honey"],
      isAvailable: true,
      isFeatured: true,
    });
    expect(res.success).toBe(true);
  });

  it("enforces slug format (lowercase alphanumeric and hyphens only)", () => {
    const invalidUppercase = productSchema.safeParse({
      name: "Bad Slug",
      slug: "Colombia-Huila",
      categoryId: validUUID,
      priceMinor: 25000,
    });
    expect(invalidUppercase.success).toBe(false);

    const invalidSpaces = productSchema.safeParse({
      name: "Bad Slug",
      slug: "colombia huila",
      categoryId: validUUID,
      priceMinor: 25000,
    });
    expect(invalidSpaces.success).toBe(false);

    const invalidSpecial = productSchema.safeParse({
      name: "Bad Slug",
      slug: "colombia_huila!?",
      categoryId: validUUID,
      priceMinor: 25000,
    });
    expect(invalidSpecial.success).toBe(false);
  });

  it("enforces minor unit price bounds (minimum 100 poisha = ৳1.00, max 100,000 BDT)", () => {
    const tooLow = productSchema.safeParse({
      name: "Too Cheap",
      slug: "too-cheap",
      categoryId: validUUID,
      priceMinor: 50,
    });
    expect(tooLow.success).toBe(false);

    const tooHigh = productSchema.safeParse({
      name: "Too Expensive",
      slug: "too-expensive",
      categoryId: validUUID,
      priceMinor: 20000000,
    });
    expect(tooHigh.success).toBe(false);
  });

  it("caps tasting notes to maximum of 10 items", () => {
    const res = productSchema.safeParse({
      name: "Lots of Notes",
      slug: "lots-of-notes",
      categoryId: validUUID,
      priceMinor: 25000,
      ingredients: Array.from({ length: 11 }, (_, i) => `Note ${i + 1}`),
    });
    expect(res.success).toBe(false);
  });

  it("validates category schema", () => {
    const valid = categorySchema.safeParse({
      name: "Artisan Brews",
      slug: "artisan-brews",
      description: "Pour-over and Aeropress extractions",
      sortOrder: 1,
    });
    expect(valid.success).toBe(true);

    const invalidSlug = categorySchema.safeParse({
      name: "Artisan Brews",
      slug: "Artisan Brews",
    });
    expect(invalidSlug.success).toBe(false);
  });
});

describe("Phase 10: Image Binary Magic Bytes Security", () => {
  it("detects valid JPEG magic bytes (FF D8 FF)", () => {
    const jpegBytes = new Uint8Array([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    ]);
    const res = validateImageMagicBytes(jpegBytes);
    expect(res.valid).toBe(true);
    expect(res.mimeType).toBe("image/jpeg");
    expect(res.extension).toBe("jpg");
  });

  it("detects valid PNG magic bytes (89 50 4E 47)", () => {
    const pngBytes = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    ]);
    const res = validateImageMagicBytes(pngBytes);
    expect(res.valid).toBe(true);
    expect(res.mimeType).toBe("image/png");
    expect(res.extension).toBe("png");
  });

  it("detects valid WebP magic bytes (RIFF ... WEBP)", () => {
    // 0..3: RIFF (52 49 46 46), 4..7: size, 8..11: WEBP (57 45 42 50)
    const webpBytes = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
    ]);
    const res = validateImageMagicBytes(webpBytes);
    expect(res.valid).toBe(true);
    expect(res.mimeType).toBe("image/webp");
    expect(res.extension).toBe("webp");
  });

  it("strictly rejects SVG and XML files disguised as images", () => {
    const svgBytes = new TextEncoder().encode(
      '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'
    );
    const res = validateImageMagicBytes(svgBytes);
    expect(res.valid).toBe(false);
    expect(res.error).toContain("SVG and XML vector files are forbidden");
  });

  it("rejects generic text or disguised executables", () => {
    const exeBytes = new TextEncoder().encode("MZ This is a disguised executable binary.");
    const res = validateImageMagicBytes(exeBytes);
    expect(res.valid).toBe(false);
    expect(res.error).toContain("Unsupported file format");
  });
});

describe("Phase 10: Admin Product Server Actions", () => {
  const validUUID = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22";
  const mockAdminUser = { id: "usr-admin-1234", email: "admin@chocobliss.coffee" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createProductAction", () => {
    it("fails when caller is not an admin", async () => {
      mockRequireAdmin.mockRejectedValueOnce(new Error("Unauthorized: Non-admin"));

      const res = await createProductAction({
        name: "Test Coffee",
        slug: "test-coffee",
        categoryId: validUUID,
        priceMinor: 25000,
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Unauthorized");
    });

    it("prevents duplicate slug creation", async () => {
      mockRequireAdmin.mockResolvedValueOnce({ user: mockAdminUser });

      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValueOnce({
          data: { id: "existing-prod-uuid" },
          error: null,
        }),
      });

      const res = await createProductAction({
        name: "Duplicate Roast",
        slug: "duplicate-roast",
        categoryId: validUUID,
        priceMinor: 25000,
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("already exists");
    });

    it("successfully creates product and logs audit action", async () => {
      mockRequireAdmin.mockResolvedValueOnce({ user: mockAdminUser });

      // Slug check returns null (unique)
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValueOnce({ data: null, error: null }),
      });

      // Insert product
      mockFrom.mockReturnValueOnce({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: { id: "new-prod-uuid", slug: "panama-geisha" },
          error: null,
        }),
      });

      const res = await createProductAction({
        name: "Panama Geisha",
        slug: "panama-geisha",
        categoryId: validUUID,
        priceMinor: 65000,
      });

      expect(res.success).toBe(true);
      expect(res.data?.id).toBe("new-prod-uuid");
      expect(mockLogAdminAction).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "CREATE_PRODUCT",
          entityId: "new-prod-uuid",
        })
      );
    });
  });

  describe("softDeleteProductAction & restoreProductAction", () => {
    it("soft deletes product by setting deleted_at and logs action", async () => {
      mockRequireAdmin.mockResolvedValueOnce({ user: mockAdminUser });

      mockFrom.mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValueOnce({ error: null }),
      });

      const res = await softDeleteProductAction(validUUID);
      expect(res.success).toBe(true);
      expect(mockLogAdminAction).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "SOFT_DELETE_PRODUCT",
          entityId: validUUID,
        })
      );
    });

    it("restores soft-deleted product and logs action", async () => {
      mockRequireAdmin.mockResolvedValueOnce({ user: mockAdminUser });

      mockFrom.mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValueOnce({ error: null }),
      });

      const res = await restoreProductAction(validUUID);
      expect(res.success).toBe(true);
      expect(mockLogAdminAction).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "RESTORE_PRODUCT",
          entityId: validUUID,
        })
      );
    });
  });
});
