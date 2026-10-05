import { describe, it, expect } from "vitest";
import { safeRedirectPath } from "@/lib/auth/guards";

describe("Phase 3: Auth Security & Open Redirect Protection Tests", () => {
  it("allows safe internal relative paths", () => {
    expect(safeRedirectPath("/account")).toBe("/account");
    expect(safeRedirectPath("/products/signature-double-espresso")).toBe(
      "/products/signature-double-espresso"
    );
    expect(safeRedirectPath("/admin/orders?status=PENDING")).toBe(
      "/admin/orders?status=PENDING"
    );
  });

  it("deflects protocol-relative URL attempts (//evil.com)", () => {
    expect(safeRedirectPath("//evil.com")).toBe("/account");
    expect(safeRedirectPath("//evil.com/phishing")).toBe("/account");
  });

  it("deflects backslash protocol bypass attempts (/\\evil.com)", () => {
    expect(safeRedirectPath("/\\evil.com")).toBe("/account");
  });

  it("deflects absolute external URLs", () => {
    expect(safeRedirectPath("https://malicious-phishing.com")).toBe("/account");
    expect(safeRedirectPath("http://evil.com")).toBe("/account");
  });

  it("deflects javascript: and data: pseudo-schemes", () => {
    expect(safeRedirectPath("javascript:alert(1)")).toBe("/account");
    expect(safeRedirectPath("data:text/html,<script>alert(1)</script>")).toBe("/account");
  });

  it("deflects control characters and null bytes", () => {
    expect(safeRedirectPath("/account\u0000/evil")).toBe("/account");
    expect(safeRedirectPath("/account\n/test")).toBe("/account");
  });

  it("falls back to custom default path if specified", () => {
    expect(safeRedirectPath("https://evil.com", "/products")).toBe("/products");
    expect(safeRedirectPath(null, "/")).toBe("/");
    expect(safeRedirectPath(undefined, "/products")).toBe("/products");
  });
});
