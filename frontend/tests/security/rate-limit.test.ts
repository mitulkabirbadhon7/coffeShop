import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  getClientIp,
  resetInMemoryRateLimits,
} from "@/lib/security/rate-limit";

describe("Phase 13: Rate Limiting & Abuse Prevention", () => {
  beforeEach(() => {
    resetInMemoryRateLimits();
  });

  describe("checkRateLimit Sliding Window", () => {
    it("allows requests within the configured tier threshold", async () => {
      const id = "patron-101";

      const r1 = await checkRateLimit("auth", id);
      expect(r1.success).toBe(true);
      expect(r1.remaining).toBe(4); // 5 max - 1 = 4

      const r2 = await checkRateLimit("auth", id);
      expect(r2.success).toBe(true);
      expect(r2.remaining).toBe(3);
    });

    it("enforces hard limit when request count exceeds auth tier threshold (5 requests)", async () => {
      const attackerId = "brute-force-attacker";

      for (let i = 0; i < 5; i++) {
        const res = await checkRateLimit("auth", attackerId);
        expect(res.success).toBe(true);
      }

      // 6th attempt must be rejected
      const blocked = await checkRateLimit("auth", attackerId);
      expect(blocked.success).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.reset).toBeGreaterThan(Date.now());
    });

    it("isolates rate limits between different client identifiers", async () => {
      const userA = "client-alpha";
      const userB = "client-bravo";

      for (let i = 0; i < 5; i++) {
        await checkRateLimit("auth", userA);
      }

      // userA is blocked
      const blockedA = await checkRateLimit("auth", userA);
      expect(blockedA.success).toBe(false);

      // userB is independent and must succeed
      const allowedB = await checkRateLimit("auth", userB);
      expect(allowedB.success).toBe(true);
      expect(allowedB.remaining).toBe(4);
    });

    it("applies public mutation limits for contact and newsletter (10 requests)", async () => {
      const ip = "192.168.1.50";

      for (let i = 0; i < 10; i++) {
        const res = await checkRateLimit("publicMutation", ip);
        expect(res.success).toBe(true);
      }

      const blocked = await checkRateLimit("publicMutation", ip);
      expect(blocked.success).toBe(false);
      expect(blocked.remaining).toBe(0);
    });

    it("enforces order rate limiter per user/IP (5 orders per window)", async () => {
      const userId = "user-spamming-orders";

      for (let i = 0; i < 5; i++) {
        const res = await checkRateLimit("order", userId);
        expect(res.success).toBe(true);
      }

      const blocked = await checkRateLimit("order", userId);
      expect(blocked.success).toBe(false);
    });
  });

  describe("getClientIp Header Extraction", () => {
    it("extracts client IP from x-forwarded-for header", () => {
      const headers = new Headers({
        "x-forwarded-for": "203.0.113.195, 70.41.3.18, 150.172.238.178",
      });

      const ip = getClientIp(headers);
      expect(ip).toBe("203.0.113.195");
    });

    it("extracts client IP from cf-connecting-ip header", () => {
      const headers = new Headers({
        "cf-connecting-ip": "198.51.100.22",
      });

      const ip = getClientIp(headers);
      expect(ip).toBe("198.51.100.22");
    });

    it("falls back to 127.0.0.1 when no trusted IP headers are present", () => {
      const headers = new Headers();
      const ip = getClientIp(headers);
      expect(ip).toBe("127.0.0.1");
    });

    it("rejects malformed IP injection strings in headers and falls back safely", () => {
      const headers = new Headers({
        "x-forwarded-for": "<script>alert('xss')</script>",
      });

      const ip = getClientIp(headers);
      expect(ip).toBe("127.0.0.1");
    });
  });
});
