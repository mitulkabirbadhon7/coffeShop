/**
 * Error Sanitization & Secret Masking Engine
 * Satisfies Requirement S13 in docs/SECURITY.md:
 * - Production errors must be generic and never leak database internals, table names, or stack traces.
 * - Sensitive values (passwords, tokens, keys) must be masked in log payloads.
 */

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "secret",
  "key",
  "authorization",
  "apikey",
  "service_role",
  "access_token",
  "refresh_token",
  "jwt",
]);

/**
 * Strips internal details, SQL codes, and stack traces from customer-facing errors.
 */
export function sanitizeErrorMessage(
  error: unknown,
  fallback: string = "An unexpected error occurred. Please try again later."
): string {
  if (!error) return fallback;

  const rawMessage =
    typeof error === "string"
      ? error
      : (error as { message?: string })?.message || String(error);

  // If in production, prevent database or internal leaks
  if (process.env.NODE_ENV === "production") {
    // Check for sensitive database/backend leak patterns
    const leakPatterns = [
      /relation ".*" does not exist/i,
      /duplicate key value violates/i,
      /violates .* constraint/i,
      /syntax error at or near/i,
      /database error/i,
      /column ".*" does not exist/i,
      /permission denied for table/i,
      /connection refused/i,
      /jwt expired/i,
      /supabase/i,
      /postgres/i,
      /stack trace/i,
    ];

    for (const pattern of leakPatterns) {
      if (pattern.test(rawMessage)) {
        return fallback;
      }
    }
  }

  // Check for credentials or keys accidentally included in strings
  if (rawMessage.includes("eyJ") || rawMessage.includes("sb_") || rawMessage.includes("upstash")) {
    return fallback;
  }

  return rawMessage;
}

/**
 * Recursively masks sensitive fields in diagnostic objects before logging.
 */
export function maskSensitiveData<T>(data: T): T {
  if (!data || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => maskSensitiveData(item)) as unknown as T;
  }

  const masked: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = Array.from(SENSITIVE_KEYS).some((s) => lowerKey.includes(s));

    if (isSensitive) {
      masked[key] = "[REDACTED]";
    } else if (value && typeof value === "object") {
      masked[key] = maskSensitiveData(value);
    } else {
      masked[key] = value;
    }
  }

  return masked as T;
}
