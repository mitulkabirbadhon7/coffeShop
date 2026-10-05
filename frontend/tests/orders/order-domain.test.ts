import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isValidOrderTransition,
  assertValidOrderTransition,
  canUserCancelOrder,
  ORDER_FULFILLMENT_STEPS,
  type OrderStatus,
} from "@/lib/services/order.service";
import {
  orderItemInputSchema,
  placeOrderSchema,
  cancelOrderSchema,
} from "@/lib/validation/order.schema";
import { placeOrderAction, cancelCustomerOrderAction } from "@/lib/orders/actions";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock Supabase server client
const mockRpc = vi.fn();
const mockAuthGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockAuthGetUser,
    },
    rpc: mockRpc,
    from: mockFrom,
  })),
}));

describe("Phase 8: Order Domain & State Transition Rules", () => {
  it("permits valid linear order status transitions", () => {
    expect(isValidOrderTransition("PENDING", "CONFIRMED")).toBe(true);
    expect(isValidOrderTransition("CONFIRMED", "PREPARING")).toBe(true);
    expect(isValidOrderTransition("PREPARING", "READY")).toBe(true);
    expect(isValidOrderTransition("READY", "COMPLETED")).toBe(true);
  });

  it("permits customer cancellation only in PENDING and CONFIRMED states", () => {
    expect(isValidOrderTransition("PENDING", "CANCELLED")).toBe(true);
    expect(isValidOrderTransition("CONFIRMED", "CANCELLED")).toBe(true);
    expect(canUserCancelOrder("PENDING")).toBe(true);
    expect(canUserCancelOrder("CONFIRMED")).toBe(true);
  });

  it("prohibits cancellation once order preparation has begun", () => {
    expect(isValidOrderTransition("PREPARING", "CANCELLED")).toBe(false);
    expect(isValidOrderTransition("READY", "CANCELLED")).toBe(false);
    expect(isValidOrderTransition("COMPLETED", "CANCELLED")).toBe(false);
    expect(canUserCancelOrder("PREPARING")).toBe(false);
    expect(canUserCancelOrder("READY")).toBe(false);
    expect(canUserCancelOrder("COMPLETED")).toBe(false);
  });

  it("throws descriptive error on invalid transition attempt via assertValidOrderTransition", () => {
    expect(() => assertValidOrderTransition("PREPARING", "CANCELLED")).toThrow(
      'Invalid order status transition from "PREPARING" to "CANCELLED".'
    );
    expect(() => assertValidOrderTransition("COMPLETED", "PENDING")).toThrow(
      'Invalid order status transition from "COMPLETED" to "PENDING".'
    );
  });

  it("includes all 5 linear fulfillment steps in correct chronological order", () => {
    expect(ORDER_FULFILLMENT_STEPS).toEqual([
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "READY",
      "COMPLETED",
    ]);
  });
});

describe("Phase 8: Order Validation Schemas", () => {
  const validUUID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

  it("validates legitimate order item input", () => {
    const res = orderItemInputSchema.safeParse({
      productId: validUUID,
      quantity: 3,
    });
    expect(res.success).toBe(true);
  });

  it("enforces item quantity bounds (1 to 20)", () => {
    const tooLow = orderItemInputSchema.safeParse({
      productId: validUUID,
      quantity: 0,
    });
    expect(tooLow.success).toBe(false);

    const tooHigh = orderItemInputSchema.safeParse({
      productId: validUUID,
      quantity: 21,
    });
    expect(tooHigh.success).toBe(false);
  });

  it("rejects non-UUID product identifiers", () => {
    const res = orderItemInputSchema.safeParse({
      productId: "invalid-id-format",
      quantity: 1,
    });
    expect(res.success).toBe(false);
  });

  it("rejects an empty items array when placing an order", () => {
    const res = placeOrderSchema.safeParse({
      items: [],
      notes: "Please pack carefully",
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.errors[0].message).toContain("at least one item");
    }
  });

  it("accepts valid order payload with sanitized pickup notes", () => {
    const res = placeOrderSchema.safeParse({
      items: [{ productId: validUUID, quantity: 2 }],
      notes: "  Whole bean please, grind size coarse.  ",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.notes).toBe("Whole bean please, grind size coarse.");
    }
  });

  it("validates cancel order schema", () => {
    const valid = cancelOrderSchema.safeParse({ orderId: validUUID });
    expect(valid.success).toBe(true);

    const invalid = cancelOrderSchema.safeParse({ orderId: "bad-id" });
    expect(invalid.success).toBe(false);
  });
});

describe("Phase 8: Order Server Actions", () => {
  const validUUID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const mockUserId = "usr-12345-abcde";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("placeOrderAction", () => {
    it("fails early on invalid input without querying database", async () => {
      const result = await placeOrderAction({
        items: [],
      });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockAuthGetUser).not.toHaveBeenCalled();
    });

    it("requires authentication to place an order", async () => {
      mockAuthGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: "No session" },
      });

      const result = await placeOrderAction({
        items: [{ productId: validUUID, quantity: 2 }],
      });

      expect(result.success).toBe(false);
      expect(result.requiresAuth).toBe(true);
      expect(mockRpc).not.toHaveBeenCalled();
    });

    it("successfully calls place_order RPC with formatted items and returns orderId", async () => {
      mockAuthGetUser.mockResolvedValueOnce({
        data: { user: { id: mockUserId, email: "customer@chocobliss.coffee" } },
        error: null,
      });

      const createdOrderId = "ord-9999-beef";
      mockRpc.mockResolvedValueOnce({
        data: createdOrderId,
        error: null,
      });

      const result = await placeOrderAction({
        items: [{ productId: validUUID, quantity: 4 }],
        notes: "Pickup at 3 PM",
      });

      expect(result.success).toBe(true);
      expect(result.orderId).toBe(createdOrderId);
      expect(mockRpc).toHaveBeenCalledWith("place_order", {
        items: [{ product_id: validUUID, quantity: 4 }],
        notes: "Pickup at 3 PM",
      });
    });
  });

  describe("cancelCustomerOrderAction", () => {
    it("requires authenticated user", async () => {
      mockAuthGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: null,
      });

      const result = await cancelCustomerOrderAction({ orderId: validUUID });
      expect(result.success).toBe(false);
      expect(result.error).toContain("must be signed in");
    });

    it("enforces anti-IDOR checks (fails if order does not belong to user)", async () => {
      mockAuthGetUser.mockResolvedValueOnce({
        data: { user: { id: mockUserId } },
        error: null,
      });

      // Mock finding no order for this user
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: null,
          error: { message: "Row not found" },
        }),
      });

      const result = await cancelCustomerOrderAction({ orderId: validUUID });
      expect(result.success).toBe(false);
      expect(result.error).toContain("not found or you do not have permission");
    });

    it("rejects cancellation if order status has moved to PREPARING", async () => {
      mockAuthGetUser.mockResolvedValueOnce({
        data: { user: { id: mockUserId } },
        error: null,
      });

      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: { id: validUUID, status: "PREPARING", user_id: mockUserId },
          error: null,
        }),
      });

      const result = await cancelCustomerOrderAction({ orderId: validUUID });
      expect(result.success).toBe(false);
      expect(result.error).toContain('cannot be cancelled because it is already "PREPARING"');
    });

    it("successfully cancels order in PENDING status", async () => {
      mockAuthGetUser.mockResolvedValueOnce({
        data: { user: { id: mockUserId } },
        error: null,
      });

      // 1. Fetch order check
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: { id: validUUID, status: "PENDING", user_id: mockUserId },
          error: null,
        }),
      });

      // 2. Update order to CANCELLED
      mockFrom.mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({ error: null }),
      });

      const result = await cancelCustomerOrderAction({ orderId: validUUID });
      expect(result.success).toBe(true);
    });
  });
});
