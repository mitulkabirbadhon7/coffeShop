import { describe, it, expect } from "vitest";
import {
  BASE_SECURITY_HEADERS,
  getContentSecurityPolicy,
  applySecurityHeaders,
} from "@/lib/security/headers";

describe("Phase 13: HTTP Security Headers & Content Security Policy (CSP)", () => {
  it("enforces X-Content-Type-Options: nosniff", () => {
    expect(BASE_SECURITY_HEADERS["X-Content-Type-Options"]).toBe("nosniff");
  });

  it("enforces X-Frame-Options: DENY to prevent clickjacking", () => {
    expect(BASE_SECURITY_HEADERS["X-Frame-Options"]).toBe("DENY");
  });

  it("enforces strict Referrer-Policy", () => {
    expect(BASE_SECURITY_HEADERS["Referrer-Policy"]).toBe(
      "strict-origin-when-cross-origin"
    );
  });

  it("restricts sensitive device capabilities in Permissions-Policy", () => {
    const policy = BASE_SECURITY_HEADERS["Permissions-Policy"];
    expect(policy).toContain("camera=()");
    expect(policy).toContain("microphone=()");
    expect(policy).toContain("geolocation=()");
  });

  it("enforces HSTS (Strict-Transport-Security) for 2 years with preload", () => {
    const hsts = BASE_SECURITY_HEADERS["Strict-Transport-Security"];
    expect(hsts).toBe("max-age=63072000; includeSubDomains; preload");
  });

  it("enforces cross-origin opener and resource policies", () => {
    expect(BASE_SECURITY_HEADERS["Cross-Origin-Opener-Policy"]).toBe("same-origin");
    expect(BASE_SECURITY_HEADERS["Cross-Origin-Resource-Policy"]).toBe("same-origin");
  });

  describe("Content-Security-Policy (CSP)", () => {
    it("includes frame-ancestors 'none' for complete clickjacking defense", () => {
      const csp = getContentSecurityPolicy(false);
      expect(csp).toContain("frame-ancestors 'none'");
    });

    it("restricts default-src to 'self'", () => {
      const csp = getContentSecurityPolicy(false);
      expect(csp).toContain("default-src 'self'");
    });

    it("allows Google Fonts and Supabase domains explicitly", () => {
      const csp = getContentSecurityPolicy(false);
      expect(csp).toContain("https://fonts.googleapis.com");
      expect(csp).toContain("https://fonts.gstatic.com");
      expect(csp).toContain("sslwbhdcmscsifrwxifa.supabase.co");
    });

    it("allows Cloudflare Turnstile domain in frame-src and script-src", () => {
      const csp = getContentSecurityPolicy(false);
      expect(csp).toContain("https://challenges.cloudflare.com");
    });

    it("includes upgrade-insecure-requests in production mode", () => {
      const prodCsp = getContentSecurityPolicy(false);
      expect(prodCsp).toContain("upgrade-insecure-requests");

      const devCsp = getContentSecurityPolicy(true);
      expect(devCsp).not.toContain("upgrade-insecure-requests");
    });
  });

  describe("applySecurityHeaders Helper", () => {
    it("applies all baseline security headers and CSP to a Response object", () => {
      const res = new Response("OK", { status: 200 });
      const secured = applySecurityHeaders(res, false);

      expect(secured.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(secured.headers.get("X-Frame-Options")).toBe("DENY");
      expect(secured.headers.get("Content-Security-Policy")).toBeDefined();
      expect(secured.headers.get("Strict-Transport-Security")).toContain("max-age=63072000");
    });
  });
});
