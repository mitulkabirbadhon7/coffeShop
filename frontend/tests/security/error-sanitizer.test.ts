import { describe, it, expect, vi, afterEach } from "vitest";
import {
  sanitizeErrorMessage,
  maskSensitiveData,
} from "@/lib/security/error-sanitizer";

describe("Phase 13: Error Sanitization & Secret Masking", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("sanitizeErrorMessage", () => {
    it("masks internal database errors and stack traces in production", () => {
      vi.stubEnv("NODE_ENV", "production");

      const rawSqlError = 'Database error: relation "users_private" does not exist';
      const sanitized = sanitizeErrorMessage(rawSqlError);

      expect(sanitized).toBe("An unexpected error occurred. Please try again later.");
      expect(sanitized).not.toContain("users_private");
    });

    it("masks duplicate key and database constraint violations in production", () => {
      vi.stubEnv("NODE_ENV", "production");

      const constraintError =
        'duplicate key value violates unique constraint "products_slug_key"';
      const sanitized = sanitizeErrorMessage(constraintError);

      expect(sanitized).toBe("An unexpected error occurred. Please try again later.");
      expect(sanitized).not.toContain("products_slug_key");
    });

    it("preserves safe, user-friendly validation messages", () => {
      const safeMessage = "Please enter a valid phone number for order updates.";
      const result = sanitizeErrorMessage(safeMessage);
      expect(result).toBe(safeMessage);
    });

    it("redacts JWT tokens if accidentally leaked into error strings", () => {
      const tokenError =
        "Auth failed: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.malicious_payload";
      const sanitized = sanitizeErrorMessage(tokenError);
      expect(sanitized).toBe("An unexpected error occurred. Please try again later.");
      expect(sanitized).not.toContain("eyJ");
    });
  });

  describe("maskSensitiveData", () => {
    it("redacts passwords, tokens, and secret keys recursively", () => {
      const input = {
        user: "admin@chocobliss.coffee",
        password: "SuperSecretPassword123!",
        session: {
          access_token: "jwt-token-string",
          service_role_key: "supabase-service-key",
          notes: "Customer VIP order",
        },
      };

      const masked = maskSensitiveData(input);

      expect(masked.user).toBe("admin@chocobliss.coffee");
      expect(masked.password).toBe("[REDACTED]");
      expect(masked.session.access_token).toBe("[REDACTED]");
      expect(masked.session.service_role_key).toBe("[REDACTED]");
      expect(masked.session.notes).toBe("Customer VIP order");
    });

    it("handles arrays and nested objects cleanly", () => {
      const input = [
        { apiKey: "test-api-key-123", label: "Payment gateway" },
        { clientSecret: "shh-secret", label: "OAuth client" },
      ];

      const masked = maskSensitiveData(input);

      expect(masked[0].apiKey).toBe("[REDACTED]");
      expect(masked[0].label).toBe("Payment gateway");
      expect(masked[1].clientSecret).toBe("[REDACTED]");
    });
  });
});
