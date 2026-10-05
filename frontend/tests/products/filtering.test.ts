import { describe, it, expect } from "vitest";
import { filterProducts, type Product } from "@/lib/data/products.data";

const sampleProducts: Product[] = [
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
  {
    id: "p3",
    category_id: "cat-bakery",
    name: "Artisan Chocolate Truffle",
    slug: "artisan-chocolate-truffle",
    description: "Single origin 70% dark chocolate handcrafted daily",
    price_minor: 15000,
    currency: "BDT",
    image_path: null,
    ingredients: ["70% Single Origin Cocoa", "Vanilla Bean"],
    is_available: false,
    is_featured: false,
    deleted_at: null,
    created_at: "2026-10-03T10:00:00Z",
    updated_at: "2026-10-03T10:00:00Z",
  },
  {
    id: "p4-deleted",
    category_id: "cat-espresso",
    name: "Archived Seasonal Roast",
    slug: "archived-seasonal-roast",
    description: "Old batch roast that has been discontinued",
    price_minor: 30000,
    currency: "BDT",
    image_path: null,
    ingredients: ["Discontinued bean"],
    is_available: false,
    is_featured: false,
    deleted_at: "2026-10-04T00:00:00Z", // Soft deleted!
    created_at: "2026-09-01T10:00:00Z",
    updated_at: "2026-10-04T00:00:00Z",
  },
];

describe("Phase 5: Product Filtering & Soft Deletion Tests", () => {
  it("never includes soft-deleted products in filtered catalog", () => {
    const results = filterProducts(sampleProducts);
    expect(results.some((p) => p.deleted_at !== null)).toBe(false);
    expect(results.some((p) => p.id === "p4-deleted")).toBe(false);
    expect(results).toHaveLength(3);
  });

  it("filters products by category ID", () => {
    const espressoResults = filterProducts(sampleProducts, {
      categoryId: "cat-espresso",
    });
    expect(espressoResults).toHaveLength(1);
    expect(espressoResults[0]?.name).toBe("Classic Double Espresso");

    const bakeryResults = filterProducts(sampleProducts, {
      categoryId: "cat-bakery",
    });
    expect(bakeryResults).toHaveLength(1);
    expect(bakeryResults[0]?.name).toBe("Artisan Chocolate Truffle");
  });

  it("filters products by search term (case-insensitive across name, description, ingredients)", () => {
    // Search by name
    const byName = filterProducts(sampleProducts, { search: "v60" });
    expect(byName).toHaveLength(1);
    expect(byName[0]?.slug).toBe("ethiopian-pour-over-v60");

    // Search by ingredient
    const byIngredient = filterProducts(sampleProducts, { search: "bergamot" });
    expect(byIngredient).toHaveLength(1);
    expect(byIngredient[0]?.name).toBe("Ethiopian Pour Over V60");

    // Search by description
    const byDesc = filterProducts(sampleProducts, { search: "crema" });
    expect(byDesc).toHaveLength(1);
    expect(byDesc[0]?.name).toBe("Classic Double Espresso");
  });

  it("filters by availability (availableOnly)", () => {
    const availableOnly = filterProducts(sampleProducts, {
      availableOnly: true,
    });
    expect(availableOnly).toHaveLength(2);
    expect(availableOnly.some((p) => !p.is_available)).toBe(false);
  });

  it("sorts products by price ascending and descending", () => {
    const priceAsc = filterProducts(sampleProducts, { sort: "price-asc" });
    expect(priceAsc[0]?.price_minor).toBe(15000); // Truffle
    expect(priceAsc[1]?.price_minor).toBe(18000); // Espresso
    expect(priceAsc[2]?.price_minor).toBe(28000); // V60

    const priceDesc = filterProducts(sampleProducts, { sort: "price-desc" });
    expect(priceDesc[0]?.price_minor).toBe(28000);
    expect(priceDesc[2]?.price_minor).toBe(15000);
  });

  it("sorts featured products first by default", () => {
    const featured = filterProducts(sampleProducts, { sort: "featured" });
    expect(featured[0]?.is_featured).toBe(true);
    expect(featured[0]?.name).toBe("Classic Double Espresso");
  });
});
