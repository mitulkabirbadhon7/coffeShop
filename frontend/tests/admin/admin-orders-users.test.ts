import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateAdminOrderStatusAction } from "@/lib/orders/admin-order-actions";
import { updateUserRoleAction } from "@/lib/users/admin-user-actions";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock requireAdmin guard
const mockRequireAdmin = vi.fn();
vi.mock("@/lib/auth/guards", () => ({
  requireAdmin: () => mockRequireAdmin(),
}));

// Mock logAdminAction
const mockLogAdminAction = vi.fn();
vi.mock("@/lib/audit/log", () => ({
  logAdminAction: (params: any) => mockLogAdminAction(params),
}));

// Mock Supabase server client
const mockFrom = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

// Mock Supabase admin service-role client
const mockAdminFrom = vi.fn();
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(() => ({
    from: mockAdminFrom,
  })),
}));

describe("Phase 11: Admin Orders & Status State Machine Actions", () => {
  const mockAdminUser = { id: "admin-actor-111", email: "admin@chocobliss.coffee" };
  const validOrderId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fails when caller is not an administrator", async () => {
    mockRequireAdmin.mockRejectedValueOnce(new Error("Unauthorized: Admin required"));

    const res = await updateAdminOrderStatusAction(validOrderId, "CONFIRMED");
    expect(res.success).toBe(false);
    expect(res.error).toContain("Unauthorized");
  });

  it("successfully transitions PENDING order to CONFIRMED and logs audit trail", async () => {
    mockRequireAdmin.mockResolvedValueOnce({ user: mockAdminUser });

    // Fetch order returning PENDING
    mockFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({
        data: { id: validOrderId, status: "PENDING", user_id: "customer-1", total_minor: 48000 },
        error: null,
      }),
    });

    // Update order
    mockFrom.mockReturnValueOnce({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValueOnce({ error: null }),
    });

    const res = await updateAdminOrderStatusAction(validOrderId, "CONFIRMED");
    expect(res.success).toBe(true);
    expect(res.newStatus).toBe("CONFIRMED");
    expect(mockLogAdminAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "UPDATE_ORDER_STATUS",
        entityId: validOrderId,
        metadata: expect.objectContaining({
          fromStatus: "PENDING",
          toStatus: "CONFIRMED",
        }),
      })
    );
  });

  it("rejects illegal state transition: PREPARING cannot be CANCELLED", async () => {
    mockRequireAdmin.mockResolvedValueOnce({ user: mockAdminUser });

    // Fetch order returning PREPARING
    mockFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({
        data: { id: validOrderId, status: "PREPARING", user_id: "customer-1", total_minor: 48000 },
        error: null,
      }),
    });

    const res = await updateAdminOrderStatusAction(validOrderId, "CANCELLED");
    expect(res.success).toBe(false);
    expect(res.error).toContain('cannot transition from "PREPARING" to "CANCELLED"');
    expect(mockLogAdminAction).not.toHaveBeenCalled();
  });

  it("rejects transition from terminal COMPLETED state", async () => {
    mockRequireAdmin.mockResolvedValueOnce({ user: mockAdminUser });

    // Fetch order returning COMPLETED
    mockFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({
        data: { id: validOrderId, status: "COMPLETED", user_id: "customer-1", total_minor: 48000 },
        error: null,
      }),
    });

    const res = await updateAdminOrderStatusAction(validOrderId, "PREPARING");
    expect(res.success).toBe(false);
    expect(res.error).toContain('cannot transition from "COMPLETED" to "PREPARING"');
  });
});

describe("Phase 11: Admin Users & Role Promotion/Demotion Security", () => {
  const currentAdmin = { id: "admin-master-001", email: "master@chocobliss.coffee" };
  const targetUser = { id: "target-user-002", email: "staff@chocobliss.coffee" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("strictly prohibits self-demotion by the current administrator", async () => {
    mockRequireAdmin.mockResolvedValueOnce({ user: currentAdmin });

    const res = await updateUserRoleAction(currentAdmin.id, "USER");
    expect(res.success).toBe(false);
    expect(res.error).toContain("cannot demote their own account");
    expect(mockAdminFrom).not.toHaveBeenCalled();
  });

  it("prevents demoting the last remaining administrator", async () => {
    mockRequireAdmin.mockResolvedValueOnce({ user: currentAdmin });

    // Fetch target profile (role ADMIN)
    mockAdminFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({
        data: { id: targetUser.id, role: "ADMIN", display_name: "Only Admin" },
        error: null,
      }),
    });

    // Count admins returning 1
    mockAdminFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValueOnce({
        count: 1,
        error: null,
      }),
    });

    const res = await updateUserRoleAction(targetUser.id, "USER");
    expect(res.success).toBe(false);
    expect(res.error).toContain("At least one active administrator must remain");
  });

  it("successfully promotes customer to ADMIN role and logs audit action", async () => {
    mockRequireAdmin.mockResolvedValueOnce({ user: currentAdmin });

    // 1. Fetch target profile
    mockAdminFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({
        data: { id: targetUser.id, role: "USER", display_name: "Barista Lead" },
        error: null,
      }),
    });

    // 2. Update role
    mockAdminFrom.mockReturnValueOnce({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValueOnce({ error: null }),
    });

    const res = await updateUserRoleAction(targetUser.id, "ADMIN");
    expect(res.success).toBe(true);
    expect(mockLogAdminAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "PROMOTE_ADMIN",
        entityId: targetUser.id,
      })
    );
  });
});
