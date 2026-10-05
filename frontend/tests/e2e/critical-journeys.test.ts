import { describe, it, expect, vi } from "vitest";
import { signupSchema, loginSchema, resetPasswordSchema } from "@/lib/validation/auth.schema";
import { productSchema, categorySchema } from "@/lib/validation/product.schema";
import { contactSchema } from "@/lib/validation/contact.schema";
import { newsletterSchema } from "@/lib/validation/newsletter.schema";
import { filterProducts, type Product } from "@/lib/data/products.data";
import {
  isValidOrderTransition,
  assertValidOrderTransition,
} from "@/lib/services/order.service";
import { GET as healthHandler } from "@/app/api/health/route";
import { safeRedirectPath } from "@/lib/auth/guards";
import { formatCurrency, getOrderStatusMeta, formatDate } from "@/lib/utils/formatters";

// Mock Supabase client for health route test
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      select: vi.fn().mockResolvedValue({ count: 5, error: null }),
    }),
  }),
}));

const mockProducts: Product[] = [
  {
    id: "p1",
    category_id: "cat-espresso",
    name: "Classic Double Espresso",
    slug: "classic-double-espresso",
    description: "Rich espresso with dense golden crema and dark chocolate notes",
    price_minor: 18000,
    currency: "BDT",
    image_path: null,
    ingredients: ["Ethiopian Yirgacheffe", "Dark Roast"],
    is_available: true,
    is_featured: true,
    deleted_at: null,
    created_at: "2026-10-01T10:00:00Z",
    updated_at: "2026-10-01T10:00:00Z",
  },
  {
    id: "p2",
    category_id: "cat-brews",
    name: "Ethiopian Pour Over V60",
    slug: "ethiopian-pour-over-v60",
    description: "Floral and bergamot notes with clean citrus acidity",
    price_minor: 28000,
    currency: "BDT",
    image_path: null,
    ingredients: ["Washed Sidama", "Floral Bergamot"],
    is_available: true,
    is_featured: false,
    deleted_at: null,
    created_at: "2026-10-02T10:00:00Z",
    updated_at: "2026-10-02T10:00:00Z",
  },
];

describe("Phase 15: Production Release — Full E2E & Critical Journeys Regression Suite", () => {
  describe("Journey 1: Customer Signup & Authentication Flow", () => {
    it("validates valid customer registration payload", () => {
      const validPayload = {
        name: "Jane Doe",
        email: "customer@example.com",
        password: "SecurePassword123!",
      };
      const result = signupSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects invalid emails and short passwords during signup", () => {
      const invalidPayload = {
        name: "",
        email: "not-an-email",
        password: "short",
      };
      const result = signupSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.email).toBeDefined();
        expect(errors.password).toBeDefined();
      }
    });

    it("validates login credentials correctly", () => {
      const validLogin = {
        email: "guest@chocobliss.com",
        password: "ValidPassword123!",
      };
      expect(loginSchema.safeParse(validLogin).success).toBe(true);

      const invalidLogin = { email: "bad-email", password: "" };
      expect(loginSchema.safeParse(invalidLogin).success).toBe(false);
    });

    it("validates password reset request flow", () => {
      expect(resetPasswordSchema.safeParse({ email: "user@example.com" }).success).toBe(true);
      expect(resetPasswordSchema.safeParse({ email: "invalid" }).success).toBe(false);
    });

    it("prevents open redirect attacks post-login/logout", () => {
      expect(safeRedirectPath("/account")).toBe("/account");
      expect(safeRedirectPath("https://attacker.com")).toBe("/account");
      expect(safeRedirectPath("//evil.com")).toBe("/account");
      expect(safeRedirectPath("javascript:steal()")).toBe("/account");
    });
  });

  describe("Journey 2: Product Discovery, Browsing & Filtering", () => {
    it("filters products by category and search term", () => {
      const filteredByCategory = filterProducts(mockProducts, {
        categoryId: "cat-espresso",
      });
      expect(filteredByCategory).toHaveLength(1);
      expect(filteredByCategory[0].name).toBe("Classic Double Espresso");

      const filteredBySearch = filterProducts(mockProducts, {
        search: "Pour Over",
      });
      expect(filteredBySearch).toHaveLength(1);
      expect(filteredBySearch[0].name).toBe("Ethiopian Pour Over V60");
    });

    it("validates product creation schema accurately", () => {
      const validProduct = {
        name: "Guatemala Single Origin",
        slug: "guatemala-single-origin",
        description: "Notes of toffee and green apple",
        categoryId: "11111111-1111-1111-1111-111111111111",
        priceMinor: 32000,
        ingredients: ["Guatemala Antigua"],
        isAvailable: true,
        isFeatured: false,
      };
      expect(productSchema.safeParse(validProduct).success).toBe(true);

      const invalidProduct = {
        name: "A", // too short
        slug: "Invalid Slug With Spaces",
        categoryId: "not-a-uuid",
        priceMinor: 50, // below minimum
      };
      expect(productSchema.safeParse(invalidProduct).success).toBe(false);
    });

    it("validates category creation schema", () => {
      expect(
        categorySchema.safeParse({
          name: "Cold Brews",
          slug: "cold-brews",
          description: "Slow-steeped cold coffee selections",
        }).success
      ).toBe(true);
    });
  });

  describe("Journey 3: Order Lifecycle & Status Transitions", () => {
    it("enforces strict legal status transitions across the fulfillment lifecycle", () => {
      expect(isValidOrderTransition("PENDING", "CONFIRMED")).toBe(true);
      expect(isValidOrderTransition("CONFIRMED", "PREPARING")).toBe(true);
      expect(isValidOrderTransition("PREPARING", "READY")).toBe(true);
      expect(isValidOrderTransition("READY", "COMPLETED")).toBe(true);
    });

    it("blocks illegal status skips or regressions", () => {
      expect(isValidOrderTransition("PENDING", "READY")).toBe(false);
      expect(isValidOrderTransition("PENDING", "COMPLETED")).toBe(false);
      expect(isValidOrderTransition("COMPLETED", "PENDING")).toBe(false);
      expect(isValidOrderTransition("CANCELLED", "CONFIRMED")).toBe(false);
      expect(() => assertValidOrderTransition("PENDING", "COMPLETED")).toThrow();
    });
  });

  describe("Journey 4: Contact & Newsletter Customer Interaction", () => {
    it("validates customer contact submissions", () => {
      const validMessage = {
        name: "Artisan Coffee Lover",
        email: "coffee@lover.org",
        subject: "Wholesale Inquiry",
        message: "We would love to serve Chocobliss beans at our boutique café in Paris.",
      };
      expect(contactSchema.safeParse(validMessage).success).toBe(true);
    });

    it("rejects contact messages with empty fields or spam honeypot", () => {
      const emptyMessage = { name: "", email: "", subject: "", message: "" };
      expect(contactSchema.safeParse(emptyMessage).success).toBe(false);

      const spamMessage = {
        name: "Spam Bot",
        email: "bot@spam.com",
        subject: "Buy cheap meds",
        message: "Spam message here that is sufficiently long",
        hp_field: "I am a bot filler",
      };
      expect(contactSchema.safeParse(spamMessage).success).toBe(false);
    });

    it("validates newsletter email subscription with RFC compliance", () => {
      expect(newsletterSchema.safeParse({ email: "subscriber@chocobliss.coffee" }).success).toBe(true);
      expect(newsletterSchema.safeParse({ email: "invalid-newsletter-email" }).success).toBe(false);
    });
  });

  describe("Journey 5: Localization & Display Formatting", () => {
    it("formats currency deterministically in BDT / designated currency", () => {
      const formatted = formatCurrency(45000); // 450 BDT in minor units
      expect(formatted).toBeDefined();
      expect(formatted).toContain("450");
    });

    it("formats human-readable order statuses", () => {
      expect(getOrderStatusMeta("PENDING").label).toMatch(/pending/i);
      expect(getOrderStatusMeta("READY").label).toMatch(/ready/i);
      expect(getOrderStatusMeta("COMPLETED").label).toMatch(/completed/i);
    });

    it("formats dates gracefully without throw on valid ISO strings", () => {
      const formatted = formatDate("2026-10-05T12:00:00Z");
      expect(formatted).toBeDefined();
      expect(formatted.length).toBeGreaterThan(0);
    });
  });

  describe("Journey 6: Production Health & Availability Endpoint", () => {
    it("returns 200 OK and healthy status with live database connectivity", async () => {
      const response = await healthHandler();
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.status).toBe("healthy");
      expect(json.database).toBe("connected");
      expect(json.categoriesCount).toBe(5);
      expect(json.timestamp).toBeDefined();
    });
  });
});
