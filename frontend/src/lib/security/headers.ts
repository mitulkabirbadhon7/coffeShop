/**
 * Comprehensive HTTP Security Headers & Content Security Policy (CSP)
 * Satisfies requirements S4, S7, S10 in docs/SECURITY.md
 */

export function getContentSecurityPolicy(isDev: boolean = false): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sslwbhdcmscsifrwxifa.supabase.co";
  let supabaseDomain = "";
  try {
    supabaseDomain = new URL(supabaseUrl).origin;
  } catch {
    supabaseDomain = "https://*.supabase.co";
  }

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'", // Required for Next.js inline bootstrap scripts
      "'unsafe-eval'", // Required for development and certain Framer Motion / Lottie runtime routines
      "https://challenges.cloudflare.com", // Cloudflare Turnstile widget
    ],
    "style-src": [
      "'self'",
      "'unsafe-inline'", // Next.js inline CSS and Tailwind style injection
      "https://fonts.googleapis.com",
    ],
    "font-src": [
      "'self'",
      "https://fonts.gstatic.com",
      "data:",
    ],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      supabaseDomain,
      "https://images.unsplash.com",
    ],
    "media-src": [
      "'self'",
      "blob:",
      supabaseDomain,
    ],
    "connect-src": [
      "'self'",
      supabaseDomain,
      "https://challenges.cloudflare.com",
      "https://*.upstash.io",
      ...(isDev ? ["ws:", "http://localhost:*", "http://127.0.0.1:*"] : []),
    ],
    "frame-src": [
      "'self'",
      "https://challenges.cloudflare.com",
    ],
    "frame-ancestors": ["'none'"], // Complete clickjacking defense
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
  };

  // Enforce HTTPS upgrade in production
  if (!isDev) {
    directives["upgrade-insecure-requests"] = [];
  }

  return Object.entries(directives)
    .map(([key, values]) => (values.length > 0 ? `${key} ${values.join(" ")}` : key))
    .join("; ");
}

export const BASE_SECURITY_HEADERS: Record<string, string> = {
  // Prevent MIME-type sniffing
  "X-Content-Type-Options": "nosniff",
  // Prevent clickjacking via iframes
  "X-Frame-Options": "DENY",
  // Control referrer information sent with requests
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Restrict access to sensitive browser device features
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  // DNS prefetching control
  "X-DNS-Prefetch-Control": "on",
  // Cross-Origin Isolation policies
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  // Enforce HSTS (Strict-Transport-Security) for 2 years
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

/**
 * Applies all security headers and CSP to a web Response or Next.js response.
 */
export function applySecurityHeaders<T extends { headers: Headers }>(
  response: T,
  isDev: boolean = false
): T {
  for (const [key, value] of Object.entries(BASE_SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  const csp = getContentSecurityPolicy(isDev);
  response.headers.set("Content-Security-Policy", csp);

  return response;
}
