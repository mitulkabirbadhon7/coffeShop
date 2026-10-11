/**
 * Sentry Error Monitoring Privacy & Data Sanitization Scrubber
 * Ensures zero leakage of personal data (emails, tokens, request bodies, secrets)
 * per Security Requirement S10 and Phase 17 Requirements.
 */
import type { ErrorEvent } from "@sentry/nextjs";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
const TOKEN_REGEX = /(bearer\s+[a-zA-Z0-9._~+/-]+=*|eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)/gi;
const SENSITIVE_KEY_PATTERNS = [
  "password",
  "token",
  "secret",
  "authorization",
  "cookie",
  "access_token",
  "refresh_token",
  "apikey",
  "service_role",
  "anon_key",
  "credit_card",
  "card_number",
  "cvv",
  "ssn",
];

export function scrubString(str: string): string {
  if (!str || typeof str !== "string") return str;
  return str
    .replace(EMAIL_REGEX, "[REDACTED_EMAIL]")
    .replace(TOKEN_REGEX, "[REDACTED_TOKEN]");
}

export function scrubObject(obj: unknown, depth = 0): unknown {
  if (depth > 6 || !obj) return obj;
  if (typeof obj === "string") return scrubString(obj);
  if (Array.isArray(obj)) return obj.map((item) => scrubObject(item, depth + 1));
  if (typeof obj === "object" && obj !== null) {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      const isSensitiveKey = SENSITIVE_KEY_PATTERNS.some((pattern) =>
        lowerKey.includes(pattern)
      );
      if (isSensitiveKey) {
        cleaned[key] = "[REDACTED]";
      } else {
        cleaned[key] = scrubObject(value, depth + 1);
      }
    }
    return cleaned;
  }
  return obj;
}

export function scrubSentryEvent<T extends ErrorEvent>(event: T): T {
  if (!event) return event;

  // 1. Scrub User Identification (no emails, IP addresses, or usernames)
  if (event.user) {
    const safeUser: Record<string, unknown> = {};
    if (event.user.id) {
      safeUser.id = String(event.user.id);
    }
    event.user = safeUser;
  }

  // 2. Scrub Request (Zero request body payload leakage, strip sensitive headers)
  if (event.request) {
    // Completely wipe request body data per Phase 17 requirement
    if (event.request.data) {
      event.request.data = "[SCRUBBED_REQUEST_BODY]";
    }

    if (event.request.headers) {
      const scrubbedHeaders: Record<string, string> = {};
      for (const [key, value] of Object.entries(event.request.headers)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = SENSITIVE_KEY_PATTERNS.some((pattern) =>
          lowerKey.includes(pattern)
        );
        if (isSensitive || lowerKey === "authorization" || lowerKey === "cookie") {
          scrubbedHeaders[key] = "[REDACTED]";
        } else {
          scrubbedHeaders[key] = scrubString(String(value));
        }
      }
      event.request.headers = scrubbedHeaders;
    }

    if (event.request.url) {
      event.request.url = scrubString(event.request.url);
    }

    if (event.request.cookies && typeof event.request.cookies === "object") {
      const scrubbedCookies: Record<string, string> = {};
      for (const key of Object.keys(event.request.cookies)) {
        scrubbedCookies[key] = "[REDACTED]";
      }
      event.request.cookies = scrubbedCookies;
    }
  }

  // 3. Scrub Breadcrumbs
  if (event.breadcrumbs && Array.isArray(event.breadcrumbs)) {
    event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
      const scrubbed = { ...breadcrumb };
      if (scrubbed.message) {
        scrubbed.message = scrubString(scrubbed.message);
      }
      if (scrubbed.data) {
        scrubbed.data = scrubObject(scrubbed.data) as Record<string, unknown>;
      }
      return scrubbed;
    });
  }

  // 4. Scrub Messages & Exception Values
  if (event.message) {
    event.message = scrubString(event.message);
  }

  if (event.exception?.values) {
    for (const exc of event.exception.values) {
      if (exc.value) {
        exc.value = scrubString(exc.value);
      }
    }
  }

  // 5. Scrub Extra & Context Data
  if (event.extra) {
    event.extra = scrubObject(event.extra) as Record<string, unknown>;
  }

  if (event.contexts) {
    event.contexts = scrubObject(event.contexts) as NonNullable<ErrorEvent["contexts"]>;
  }

  return event;
}
