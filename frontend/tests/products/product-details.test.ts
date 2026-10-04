import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products.data";

const mockSingle = vi.fn();
const mockLimit = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        order: () => ({
          limit: mockLimit,
        }),
        single: mockSingle,
      }),
    }),
  }),
}));

describe("Phase 5: Product Details & Related Products Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns product when slug exists and is not deleted", async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: "prod-1",
        name: "Classic Cortado",
        slug: "classic-cortado",
        price_minor: 22000,
        is_available: true,
        deleted_at: null,
      },
      error: null,
    });

    const product = await getProductBySlug("classic-cortado");
    expect(product).not.toBeNull();
    expect(product?.name).toBe("Classic Cortado");
  });

  it("returns null when product does not exist or database error occurs", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "Row not found" },
    });

    const product = await getProductBySlug("non-existent-roast");
    expect(product).toBeNull();
  });

  it("fetches related products in the same category excluding the current product", async () => {
    mockLimit.mockResolvedValueOnce({
      data: [
        { id: "rel-1", name: "Flat White", category_id: "cat-1" },
        { id: "rel-2", name: "Cappuccino", category_id: "cat-1" },
      ],
      error: null,
    });

    const related = await getRelatedProducts("prod-1", "cat-1", 2);
    expect(related).toHaveLength(2);
    expect(related[0]?.name).toBe("Flat White");
  });
});
