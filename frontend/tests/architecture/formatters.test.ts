import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDate,
  getOrderStatusMeta,
} from "@/lib/utils/formatters";

describe("Phase 2: Formatters Utility Tests", () => {
  describe("formatCurrency", () => {
    it("formats integer minor units to whole BDT when no cents", () => {
      expect(formatCurrency(18000, "BDT")).toBe("৳180");
      expect(formatCurrency(25000, "BDT")).toBe("৳250");
      expect(formatCurrency(0, "BDT")).toBe("৳0");
    });

    it("formats fractional amounts with decimals", () => {
      expect(formatCurrency(24050, "BDT")).toBe("৳240.50");
    });

    it("supports forced decimal formatting", () => {
      expect(formatCurrency(18000, "BDT", { showDecimals: true })).toBe("৳180.00");
    });
  });

  describe("formatDate", () => {
    it("formats ISO date string into human readable format", () => {
      const formatted = formatDate("2026-10-04T12:00:00Z");
      expect(formatted).toContain("Oct");
      expect(formatted).toContain("2026");
    });

    it("handles invalid date gracefully", () => {
      expect(formatDate("not-a-valid-date")).toBe("Invalid Date");
    });
  });

  describe("getOrderStatusMeta", () => {
    it("returns correct label and styling for every order status", () => {
      const pending = getOrderStatusMeta("PENDING");
      expect(pending.label).toBe("Pending Confirmation");
      expect(pending.badgeClass).toContain("amber");

      const ready = getOrderStatusMeta("READY");
      expect(ready.label).toBe("Ready for Pickup");
      expect(ready.badgeClass).toContain("emerald");

      const preparing = getOrderStatusMeta("PREPARING");
      expect(preparing.label).toBe("Brewing / Preparing");
      expect(preparing.badgeClass).toContain("#C89B5E");
    });
  });
});
