import { describe, it, expect, vi, beforeEach } from "vitest";
import { requireAdmin, assertAdmin } from "@/lib/auth/guards";
import { logAdminAction } from "@/lib/audit/log";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Mock next/navigation
const mockRedirect = vi.fn((destination: string) => {
  const err = new Error(`NEXT_REDIRECT: ${destination}`);
  (err as any).digest = `NEXT_REDIRECT;${destination}`;
  throw err;
});

vi.mock("next/navigation", () => ({
  redirect: (dest: string) => mockRedirect(dest),
}));

// Mock Supabase server client
const mockAuthGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockAuthGetUser,
    },
    from: mockFrom,
  })),
}));

describe("Phase 9: Admin Authorization & Guards", () => {
  const mockAdminUser: User = {
    id: "usr-admin-1234",
    email: "admin@chocobliss.coffee",
    email_confirmed_at: "2026-10-04T12:00:00Z",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2026-10-04T12:00:00Z",
  };

  const mockAdminProfile: Profile = {
    id: "usr-admin-1234",
    role: "ADMIN",
    display_name: "Master Roaster",
    avatar_url: null,
    created_at: "2026-10-04T12:00:00Z",
    updated_at: "2026-10-04T12:00:00Z",
  };

  const mockCustomerProfile: Profile = {
    id: "usr-customer-5678",
    role: "USER",
    display_name: "Coffee Lover",
    avatar_url: null,
    created_at: "2026-10-04T12:00:00Z",
    updated_at: "2026-10-04T12:00:00Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("requireAdmin()", () => {
    it("redirects unauthenticated anonymous visitor to login with returnUrl", async () => {
      mockAuthGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: null,
      });

      await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT: /login?returnUrl=%2Fadmin");
      expect(mockRedirect).toHaveBeenCalledWith("/login?returnUrl=%2Fadmin");
    });

    it("redirects unverified email admin to /verify-email", async () => {
      mockAuthGetUser.mockResolvedValueOnce({
        data: {
          user: {
            ...mockAdminUser,
            email_confirmed_at: null as any,
          },
        },
        error: null,
      });

      await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT: /verify-email");
      expect(mockRedirect).toHaveBeenCalledWith("/verify-email");
    });

    it("redirects regular customer with role USER to /account", async () => {
      mockAuthGetUser.mockResolvedValueOnce({
        data: { user: { ...mockAdminUser, id: "usr-customer-5678" } },
        error: null,
      });

      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: mockCustomerProfile,
          error: null,
        }),
      });

      await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT: /account");
      expect(mockRedirect).toHaveBeenCalledWith("/account");
    });

    it("authorizes verified ADMIN and returns user and database profile", async () => {
      mockAuthGetUser.mockResolvedValueOnce({
        data: { user: mockAdminUser },
        error: null,
      });

      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: mockAdminProfile,
          error: null,
        }),
      });

      const result = await requireAdmin();
      expect(result.user.id).toBe(mockAdminUser.id);
      expect(result.profile.role).toBe("ADMIN");
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe("assertAdmin()", () => {
    it("throws error when email is unconfirmed", () => {
      const unverifiedUser = { ...mockAdminUser, email_confirmed_at: null as any };
      expect(() => assertAdmin(unverifiedUser, mockAdminProfile)).toThrow(
        "Administrator email address must be confirmed"
      );
    });

    it("throws error when role is not ADMIN (anti-forgery defense)", () => {
      expect(() => assertAdmin(mockAdminUser, mockCustomerProfile)).toThrow(
        "requires administrator privileges"
      );
    });

    it("succeeds silently when user is verified admin", () => {
      expect(() => assertAdmin(mockAdminUser, mockAdminProfile)).not.toThrow();
    });
  });

  describe("logAdminAction()", () => {
    it("inserts audit log and redacts sensitive metadata", async () => {
      let insertedPayload: any = null;

      mockFrom.mockReturnValueOnce({
        insert: vi.fn().mockImplementation((payload) => {
          insertedPayload = payload;
          return {
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValueOnce({
                data: { id: "log-1234-uuid" },
                error: null,
              }),
            }),
          };
        }),
      });

      const result = await logAdminAction({
        actorId: mockAdminUser.id,
        action: "UPDATE_PRODUCT",
        entityType: "product",
        entityId: "prod-999-uuid",
        metadata: {
          productName: "Ethiopia Yirgacheffe",
          priceMinor: 48000,
          secretToken: "super-secret-123",
          adminPassword: "admin-pass-word",
        },
      });

      expect(result.success).toBe(true);
      expect(result.logId).toBe("log-1234-uuid");
      expect(insertedPayload).toBeDefined();
      expect(insertedPayload.action).toBe("UPDATE_PRODUCT");
      expect(insertedPayload.entity_type).toBe("product");
      expect(insertedPayload.metadata.productName).toBe("Ethiopia Yirgacheffe");
      expect(insertedPayload.metadata.secretToken).toBe("[REDACTED]");
      expect(insertedPayload.metadata.adminPassword).toBe("[REDACTED]");
    });

    it("handles database insert error gracefully without throwing", async () => {
      mockFrom.mockReturnValueOnce({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValueOnce({
              data: null,
              error: { message: "Database constraint error" },
            }),
          }),
        }),
      });

      const result = await logAdminAction({
        actorId: mockAdminUser.id,
        action: "DELETE_PRODUCT",
        entityType: "product",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Database constraint error");
    });
  });
});
