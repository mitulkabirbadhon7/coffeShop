import { describe, it, expect } from "vitest";
import { siteConfig } from "@/config/site.config";
import { formatBdt } from "@/lib/utils/formatters";

describe("Phase 4: Design Tokens & Site Configuration", () => {
  it("enforces brand and operating constraints", () => {
    expect(siteConfig.name).toContain("Chocobliss");
    expect(siteConfig.currency).toBe("BDT");
    expect(siteConfig.timezone).toBe("Asia/Dhaka");
    expect(siteConfig.operatingHours).toContain("8:00 AM");
  });

  it("ensures public navigation routes include products, about, contact", () => {
    const hrefs = siteConfig.navigation.main.map((n) => n.href);
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/products");
    expect(hrefs).toContain("/about");
    expect(hrefs).toContain("/contact");
  });

  it("correctly formats Bangladeshi Taka minor currency units", () => {
    expect(formatBdt(0)).toBe("৳0");
    expect(formatBdt(18000)).toBe("৳180");
    expect(formatBdt(32050)).toBe("৳320.50");
  });
});
