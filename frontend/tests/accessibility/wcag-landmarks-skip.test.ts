import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Phase 14: Accessibility (WCAG 2.2 AA) Landmarks & Controls", () => {
  const rootLayoutPath = path.resolve(__dirname, "../../src/app/layout.tsx");
  const publicLayoutPath = path.resolve(__dirname, "../../src/app/(public)/layout.tsx");
  const headerPath = path.resolve(__dirname, "../../src/components/layout/header.tsx");

  it("verifies skip-to-content landmark link exists in RootLayout with sr-only focusable styling", () => {
    const layoutContent = fs.readFileSync(rootLayoutPath, "utf-8");

    expect(layoutContent).toContain('href="#main-content"');
    expect(layoutContent).toContain("sr-only focus:not-sr-only");
    expect(layoutContent).toContain("Skip to main content");
  });

  it("verifies <main id=\"main-content\"> target landmark is defined in PublicLayout", () => {
    const publicContent = fs.readFileSync(publicLayoutPath, "utf-8");

    expect(publicContent).toContain('id="main-content"');
    expect(publicContent).toContain("<main");
  });

  it("verifies mobile navigation button exposes aria-expanded and aria-controls attributes", () => {
    const headerContent = fs.readFileSync(headerPath, "utf-8");

    expect(headerContent).toContain("aria-expanded={mobileMenuOpen}");
    expect(headerContent).toContain('aria-controls="mobile-navigation"');
    expect(headerContent).toContain('id="mobile-navigation"');
    expect(headerContent).toContain('role="navigation"');
  });

  it("verifies header listens for Escape key to close navigation overlay", () => {
    const headerContent = fs.readFileSync(headerPath, "utf-8");

    expect(headerContent).toContain('e.key === "Escape"');
    expect(headerContent).toContain("setMobileMenuOpen(false)");
  });
});
