import { describe, it, expect } from "vitest";
import {
  scrubString,
  scrubObject,
  scrubSentryEvent,
} from "@/lib/monitoring/sentry-scrubber";
import type { ErrorEvent } from "@sentry/nextjs";

describe("Phase 17: Production Monitoring & Privacy Sanitization", () => {
  describe("scrubString", () => {
    it("redacts standard email addresses", () => {
      const input = "Customer john.doe@example.com reported an issue with payment.";
      const scrubbed = scrubString(input);
      expect(scrubbed).not.toContain("john.doe@example.com");
      expect(scrubbed).toContain("[REDACTED_EMAIL]");
    });

    it("redacts JWT authorization tokens and Bearer tokens", () => {
      const jwt =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      const scrubbed = scrubString(`User authenticated with header: ${jwt}`);
      expect(scrubbed).not.toContain("eyJhbGci");
      expect(scrubbed).toContain("[REDACTED_TOKEN]");
    });
  });

  describe("scrubObject", () => {
    it("redacts values under sensitive key names recursively", () => {
      const data = {
        name: "Test Product",
        credentials: {
          password: "SuperSecretPassword123!",
          service_role_key: "secret-key-123",
          apiKey: "sk_live_12345",
        },
        meta: {
          note: "Order placed by contact@chocobliss.com",
        },
      };

      const result = scrubObject(data) as typeof data;
      expect(result.credentials.password).toBe("[REDACTED]");
      expect(result.credentials.service_role_key).toBe("[REDACTED]");
      expect(result.credentials.apiKey).toBe("[REDACTED]");
      expect(result.meta.note).toContain("[REDACTED_EMAIL]");
      expect(result.meta.note).not.toContain("contact@chocobliss.com");
      expect(result.name).toBe("Test Product");
    });
  });

  describe("scrubSentryEvent", () => {
    it("scrubs user email, ip_address, and keeps user id intact", () => {
      const event = {
        event_id: "test-event-1",
        timestamp: 1700000000,
        level: "error",
        user: {
          id: "usr-456",
          email: "confidential@customer.com",
          ip_address: "192.168.1.100",
          username: "confidential_user",
        },
      };

      const scrubbed = scrubSentryEvent(event as unknown as ErrorEvent);
      expect(scrubbed.user?.id).toBe("usr-456");
      expect(scrubbed.user?.email).toBeUndefined();
      expect(scrubbed.user?.ip_address).toBeUndefined();
      expect(scrubbed.user?.username).toBeUndefined();
    });

    it("scrubs request body completely per Phase 17 requirement", () => {
      const event = {
        event_id: "test-event-2",
        timestamp: 1700000000,
        level: "error",
        request: {
          url: "https://chocobliss.com/api/checkout?ref=test@customer.com",
          method: "POST",
          data: {
            items: [{ id: "prod-1", quantity: 2 }],
            notes: "Please deliver carefully",
            customer_email: "test@customer.com",
          },
          headers: {
            authorization: "Bearer eyJhbGciOi...",
            cookie: "sb-auth-token=xyz; session=abc",
            "content-type": "application/json",
          },
        },
      };

      const scrubbed = scrubSentryEvent(event as unknown as ErrorEvent);
      expect(scrubbed.request?.data).toBe("[SCRUBBED_REQUEST_BODY]");
      expect(scrubbed.request?.headers?.authorization).toBe("[REDACTED]");
      expect(scrubbed.request?.headers?.cookie).toBe("[REDACTED]");
      expect(scrubbed.request?.headers?.["content-type"]).toBe("application/json");
      expect(scrubbed.request?.url).not.toContain("test@customer.com");
      expect(scrubbed.request?.url).toContain("[REDACTED_EMAIL]");
    });

    it("scrubs breadcrumbs and exception messages containing sensitive data", () => {
      const event = {
        event_id: "test-event-3",
        timestamp: 1700000000,
        level: "error",
        exception: {
          values: [
            {
              type: "AuthError",
              value: "Failed to authenticate admin admin@chocobliss.com with key secret_service_123",
            },
          ],
        },
        breadcrumbs: [
          {
            message: "User sent password to reset endpoint for target@domain.com",
            data: {
              token: "raw-auth-token-123",
              action: "login",
            },
          },
        ],
      };

      const scrubbed = scrubSentryEvent(event as unknown as ErrorEvent);
      expect(scrubbed.exception?.values?.[0]?.value).not.toContain("admin@chocobliss.com");
      expect(scrubbed.exception?.values?.[0]?.value).toContain("[REDACTED_EMAIL]");
      expect(scrubbed.breadcrumbs?.[0]?.message).not.toContain("target@domain.com");
      expect(scrubbed.breadcrumbs?.[0]?.message).toContain("[REDACTED_EMAIL]");
      expect(scrubbed.breadcrumbs?.[0]?.data?.token).toBe("[REDACTED]");
      expect(scrubbed.breadcrumbs?.[0]?.data?.action).toBe("login");
    });
  });
});
