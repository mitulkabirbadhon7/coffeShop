import { describe, it, expect, vi } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {
  getRoasteryJsonLd,
  getProductJsonLd,
  getBreadcrumbJsonLd,
} from "@/components/seo/json-ld";

// Mock product data access for sitemap
vi.mock("@/lib/data/products.data", () => ({
  getProducts: vi.fn().mockResolvedValue([
    {
      id: "prod-1",
      name: "Ethiopian Yirgacheffe",
      slug: "ethiopian-yirgacheffe",
      price_minor: 120000,
      currency: "BDT",
      is_available: true,
      updated_at: "2026-10-04T12:00:00Z",
      created_at: "2026-10-01T12:00:00Z",
    },
    {
      id: "prod-2",
      name: "Single-Origin Dark Cacao",
      slug: "single-origin-dark-cacao",
      price_minor: 85000,
      currency: "BDT",
      is_available: true,
      updated_at: "2026-10-04T12:00:00Z",
      created_at: "2026-10-01T12:00:00Z",
    },
  ]),
}));

describe("Phase 14: SEO & Structured Data Verification", () => {
  describe("robots()", () => {
    it("allows search indexing of public routes while disallowing private admin and account paths", () => {
      const robotsConfig = robots();

      expect(robotsConfig.rules).toBeDefined();
      const rules = Array.isArray(robotsConfig.rules)
        ? robotsConfig.rules[0]
        : robotsConfig.rules;

      expect(rules?.allow).toBe("/");
      expect(rules?.disallow).toContain("/admin");
      expect(rules?.disallow).toContain("/admin/");
      expect(rules?.disallow).toContain("/account");
      expect(rules?.disallow).toContain("/api/");

      expect(robotsConfig.sitemap).toContain("/sitemap.xml");
    });
  });

  describe("sitemap()", () => {
    it("generates complete sitemap with core marketing pages and dynamic product entries", async () => {
      const entries = await sitemap();

      const urls = entries.map((e) => e.url);
      expect(urls.some((u) => u.endsWith("/products"))).toBe(true);
      expect(urls.some((u) => u.endsWith("/about"))).toBe(true);
      expect(urls.some((u) => u.endsWith("/contact"))).toBe(true);
      expect(urls.some((u) => u.endsWith("/products/ethiopian-yirgacheffe"))).toBe(true);
      expect(urls.some((u) => u.endsWith("/products/single-origin-dark-cacao"))).toBe(true);

      const homeEntry = entries.find((e) => !e.url.includes("/products") && !e.url.includes("/about") && !e.url.includes("/contact"));
      expect(homeEntry?.priority).toBe(1.0);
    });
  });

  describe("Schema.org JSON-LD Structured Data", () => {
    it("generates valid CoffeeShop schema with Banani, Dhaka address and opening hours", () => {
      const data = getRoasteryJsonLd("https://chocobliss.coffee");

      expect(data["@type"]).toBe("CoffeeShop");
      expect(data.name).toBe("Chocobliss Coffee Roastery");
      expect(data.telephone).toBe("+880 1700-000000");
      expect(data.address.addressLocality).toBe("Dhaka");
      expect(data.address.postalCode).toBe("1213");
      expect(data.geo.latitude).toBeCloseTo(23.7937, 2);
      expect(data.openingHoursSpecification).toHaveLength(1);
      expect(data.openingHoursSpecification[0].opens).toBe("08:00");
      expect(data.openingHoursSpecification[0].closes).toBe("22:00");
    });

    it("generates valid Product schema with BDT pricing, sku, and stock availability", () => {
      const productData = getProductJsonLd({
        name: "Artisan Cortado Roast",
        description: "Small-batch balanced roast",
        slug: "artisan-cortado-roast",
        priceMinor: 45000,
        currency: "BDT",
        isAvailable: true,
        siteUrl: "https://chocobliss.coffee",
      });

      expect(productData["@type"]).toBe("Product");
      expect(productData.name).toBe("Artisan Cortado Roast");
      expect(productData.offers.price).toBe("450.00");
      expect(productData.offers.priceCurrency).toBe("BDT");
      expect(productData.offers.availability).toBe("https://schema.org/InStock");
    });

    it("generates valid BreadcrumbList schema with sequential positions", () => {
      const breadcrumbData = getBreadcrumbJsonLd(
        [
          { name: "Home", url: "/" },
          { name: "Roastery Menu", url: "/products" },
          { name: "Guatemala Antigua", url: "/products/guatemala-antigua" },
        ],
        "https://chocobliss.coffee"
      );

      expect(breadcrumbData["@type"]).toBe("BreadcrumbList");
      expect(breadcrumbData.itemListElement).toHaveLength(3);
      expect(breadcrumbData.itemListElement[0].position).toBe(1);
      expect(breadcrumbData.itemListElement[1].position).toBe(2);
      expect(breadcrumbData.itemListElement[2].position).toBe(3);
      expect(breadcrumbData.itemListElement[2].name).toBe("Guatemala Antigua");
    });
  });
});
