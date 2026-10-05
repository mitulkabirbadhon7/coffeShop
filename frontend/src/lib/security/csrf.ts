import { env } from "@/lib/env";

/**
 * Validates that an incoming Server Action / mutation originates from an allowed origin.
 * Defense-in-depth against Cross-Site Request Forgery (CSRF).
 */
export function verifyActionOrigin(
  headers: Headers | Record<string, string | string[] | undefined>
): { valid: boolean; reason?: string } {
  const getHeader = (key: string): string | null => {
    if (typeof (headers as Headers).get === "function") {
      return (headers as Headers).get(key);
    }
    const val = (headers as Record<string, string | string[] | undefined>)[key];
    if (Array.isArray(val)) return val[0] || null;
    return val || null;
  };

  const origin = getHeader("origin");
  const referer = getHeader("referer");

  // In testing/mock environments without origin/referer, allow if explicitly mocked
  if (!origin && !referer) {
    if (process.env.NODE_ENV === "test") {
      return { valid: true };
    }
    return { valid: false, reason: "Missing Origin and Referer headers" };
  }

  const targetUrl = origin || referer || "";
  let requestOrigin = "";
  try {
    requestOrigin = new URL(targetUrl).origin;
  } catch {
    return { valid: false, reason: "Malformed Origin/Referer header" };
  }

  const allowedOrigins = new Set<string>();

  if (env.NEXT_PUBLIC_SITE_URL) {
    try {
      allowedOrigins.add(new URL(env.NEXT_PUBLIC_SITE_URL).origin);
    } catch {
      // Ignore URL parse error
    }
  }

  // Always allow localhost in development and test
  if (process.env.NODE_ENV !== "production") {
    allowedOrigins.add("http://localhost:3000");
    allowedOrigins.add("http://127.0.0.1:3000");
  }

  if (!allowedOrigins.has(requestOrigin)) {
    return {
      valid: false,
      reason: `Untrusted origin: ${requestOrigin}`,
    };
  }

  return { valid: true };
}
