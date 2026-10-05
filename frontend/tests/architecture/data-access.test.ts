import { describe, it, expect, beforeAll } from "vitest";
import * as dotenv from "dotenv";
import * as path from "path";
import {
  getCategories,
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
} from "@/lib/data/products.data";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

describe("Phase 2: Products Data Access Layer Tests", () => {
  it("fetches categories from database sorted by sort_order", async () => {
    const categories = await getCategories();
    expect(categories).toBeDefined();
    expect(categories.length).toBeGreaterThanOrEqual(5);

    // Verify ordering
    for (let i = 0; i < categories.length - 1; i++) {
      expect(categories[i]!.sort_order).toBeLessThanOrEqual(categories[i + 1]!.sort_order);
    }
  });

  it("fetches active products list", async () => {
    const products = await getProducts();
    expect(products).toBeDefined();
    expect(products.length).toBe(22);
    products.forEach((p) => {
      expect(p.deleted_at).toBeNull();
      expect(p.is_available).toBe(true);
    });
  });

  it("fetches featured products list", async () => {
    const featured = await getFeaturedProducts();
    expect(featured).toBeDefined();
    expect(featured.length).toBeGreaterThan(0);
    featured.forEach((p) => {
      expect(p.is_featured).toBe(true);
    });
  });

  it("fetches a single product by slug", async () => {
    const product = await getProductBySlug("signature-double-espresso");
    expect(product).not.toBeNull();
    expect(product?.name).toBe("Signature Double Espresso");
    expect(product?.price_minor).toBe(18000);
  });

  it("returns null for non-existent product slug", async () => {
    const product = await getProductBySlug("phantom-roast-xyz");
    expect(product).toBeNull();
  });
});
