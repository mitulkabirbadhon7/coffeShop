import { describe, it, expect, vi, afterEach } from "vitest";
import { verifyActionOrigin } from "@/lib/security/csrf";

describe("Phase 13: CSRF & Origin Verification", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows requests matching NEXT_PUBLIC_SITE_URL or localhost", () => {
    const headers = new Headers({
      origin: "http://localhost:3000",
    });

    const result = verifyActionOrigin(headers);
    expect(result.valid).toBe(true);
  });

  it("blocks requests originating from untrusted third-party domains", () => {
    vi.stubEnv("NODE_ENV", "production");

    const headers = new Headers({
      origin: "https://malicious-phishing-site.xyz",
    });

    const result = verifyActionOrigin(headers);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("Untrusted origin");
  });

  it("validates referer header if origin header is omitted by browser", () => {
    const headers = new Headers({
      referer: "http://localhost:3000/contact",
    });

    const result = verifyActionOrigin(headers);
    expect(result.valid).toBe(true);
  });

  it("rejects malformed origin headers", () => {
    const headers = new Headers({
      origin: "not-a-valid-url-scheme",
    });

    const result = verifyActionOrigin(headers);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("Malformed");
  });
});
