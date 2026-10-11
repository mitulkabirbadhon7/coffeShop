import { describe, it, expect, vi } from "vitest";
import { GET as healthHandler } from "@/app/api/health/route";
import { requireAdmin, safeRedirectPath } from "@/lib/auth/guards";
import nextConfig from "../../next.config.mjs";

describe("Phase 17: Post-Deploy Smoke Test Suite", () => {
  describe("Security Headers Verification (Equivalent to curl -I)", () => {
    it("configures all mandatory baseline HTTP security headers", async () => {
      // Extract header configuration from next.config.mjs
      const rawHeaders = typeof nextConfig.headers === "function" ? await nextConfig.headers() : [];
      expect(rawHeaders.length).toBeGreaterThan(0);

      const catchAllRule = rawHeaders.find((rule: { source: string }) => rule.source === "/:path*");
      expect(catchAllRule).toBeDefined();
      if (!catchAllRule) throw new Error("Catch-all header rule is missing");

      const headerMap = new Map<string, string>();
      for (const h of catchAllRule.headers) {
        headerMap.set(h.key.toLowerCase(), h.value);
      }

      // 1. Strict-Transport-Security (HSTS 2-years preload)
      expect(headerMap.get("strict-transport-security")).toBe("max-age=63072000; includeSubDomains; preload");

      // 2. X-Content-Type-Options (nosniff)
      expect(headerMap.get("x-content-type-options")).toBe("nosniff");

      // 3. X-Frame-Options (DENY)
      expect(headerMap.get("x-frame-options")).toBe("DENY");

      // 4. Referrer-Policy
      expect(headerMap.get("referrer-policy")).toBe("strict-origin-when-cross-origin");

      // 5. Permissions-Policy
      expect(headerMap.get("permissions-policy")).toContain("camera=()");

      // 6. Cross-Origin policies
      expect(headerMap.get("cross-origin-opener-policy")).toBe("same-origin");
      expect(headerMap.get("cross-origin-resource-policy")).toBe("same-origin");
    });
  });

  describe("Route Access & Guard Smoke Verification", () => {
    it("denies access to /admin when logged out and protects redirect targets", async () => {
      // Verify safe redirect behavior for admin protection
      const nextPath = safeRedirectPath("/admin");
      expect(nextPath).toBe("/admin");

      const maliciousNext = safeRedirectPath("https://attacker.com/phish", "/");
      expect(maliciousNext).toBe("/");

      // Verify that requireAdmin throws or redirects when unauthenticated
      vi.mock("@/lib/supabase/server", () => ({
        createClient: () => ({
          auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
          },
        }),
      }));

      await expect(requireAdmin()).rejects.toThrow();
    });

    it("verifies public health check endpoint (/api/health) returns healthy status", async () => {
      const response = await healthHandler();
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBe("healthy");
      expect(data.database).toBe("connected");
    });
  });
});
