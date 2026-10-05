/**
 * Pure TypeScript sanitization utilities to prevent Stored XSS and unsafe script injection.
 * Complies with requirement S8: all dynamic content rendered in public pages must be safe.
 */

// Patterns that can lead to script execution
const SCRIPT_TAG_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const DANGEROUS_TAGS_REGEX = /<\/?(script|style|iframe|object|embed|applet|meta|link|form|svg|canvas|base)\b[^>]*>/gi;
const INLINE_EVENT_REGEX = /\s*on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi;
const JAVASCRIPT_URI_REGEX = /(?:href|src|action)\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|javascript:[^\s>]+)/gi;
const VBSCRIPT_URI_REGEX = /(?:href|src|action)\s*=\s*(?:'vbscript:[^']*'|"vbscript:[^"]*"|vbscript:[^\s>]+)/gi;
const DATA_HTML_URI_REGEX = /(?:href|src)\s*=\s*(?:'data:text\/html[^']*'|"data:text\/html[^"]*"|data:text\/html[^\s>]+)/gi;

/**
 * Sanitizes plain text by stripping all HTML tags, removing event handlers,
 * and normalizing whitespace. Safe to render in React without dangerous HTML.
 */
export function sanitizeText(input: unknown, maxLength?: number): string {
  if (typeof input !== "string") {
    if (input === null || input === undefined) return "";
    return String(input);
  }

  let sanitized = input
    // Remove script tags and contents first
    .replace(SCRIPT_TAG_REGEX, "")
    // Remove all HTML tags
    .replace(/<[^>]*>/g, "")
    // Replace dangerous entity encodings
    .replace(/&lt;script/gi, "")
    .replace(/&lt;\/script&gt;/gi, "")
    // Strip inline event attributes if leftover
    .replace(INLINE_EVENT_REGEX, "")
    .trim();

  if (maxLength && maxLength > 0 && sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitizes an HTML or rich text string by stripping dangerous tags,
 * event handlers, and malicious URI schemes (javascript:, vbscript:, data:text/html),
 * while preserving safe basic text formatting tags (<b>, <i>, <em>, <strong>, <p>, <br>).
 */
export function sanitizeRichText(input: unknown, maxLength?: number): string {
  if (typeof input !== "string") {
    if (input === null || input === undefined) return "";
    return String(input);
  }

  let sanitized = input
    // Strip dangerous tags completely
    .replace(SCRIPT_TAG_REGEX, "")
    .replace(DANGEROUS_TAGS_REGEX, "")
    // Strip event handlers
    .replace(INLINE_EVENT_REGEX, "")
    // Strip dangerous schemes
    .replace(JAVASCRIPT_URI_REGEX, 'href="#"')
    .replace(VBSCRIPT_URI_REGEX, 'href="#"')
    .replace(DATA_HTML_URI_REGEX, 'href="#"')
    .trim();

  if (maxLength && maxLength > 0 && sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
}

/**
 * Recursively traverses a JSON object or array, sanitizing all nested string values.
 */
export function sanitizeJsonContent(value: unknown): unknown {
  if (typeof value === "string") {
    return sanitizeRichText(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeJsonContent(item));
  }

  if (value !== null && typeof value === "object") {
    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      // Sanitize the key itself to prevent prototype pollution or invalid keys
      const safeKey = sanitizeText(key, 100);
      if (safeKey && safeKey !== "__proto__" && safeKey !== "constructor" && safeKey !== "prototype") {
        sanitizedObj[safeKey] = sanitizeJsonContent(val);
      }
    }
    return sanitizedObj;
  }

  return value;
}
