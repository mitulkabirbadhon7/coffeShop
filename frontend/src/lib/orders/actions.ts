"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  placeOrderSchema,
  cancelOrderSchema,
  type PlaceOrderInput,
  type CancelOrderInput,
} from "@/lib/validation/order.schema";
import {
  canUserCancelOrder,
  assertValidOrderTransition,
  type OrderStatus,
} from "@/lib/services/order.service";
import { checkRateLimit } from "@/lib/security/rate-limit";

export type PlaceOrderResult = {
  success: boolean;
  orderId?: string;
  error?: string;
  requiresAuth?: boolean;
};

export type CancelOrderResult = {
  success: boolean;
  error?: string;
};

/**
 * Server Action: Places an atomic pickup order using the database `place_order` RPC.
 * Enforces server-side authentication, item pricing snapshot, and quantity boundary validation.
 */
export async function placeOrderAction(
  rawInput: PlaceOrderInput
): Promise<PlaceOrderResult> {
  try {
    const parseResult = placeOrderSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error.errors[0]?.message || "Invalid order details.",
      };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Please sign in or create an account to place a pickup order.",
        requiresAuth: true,
      };
    }

    // Rate limit order submissions per authenticated user
    const rl = await checkRateLimit("order", user.id);
    if (!rl.success) {
      return {
        success: false,
        error:
          "You have placed multiple orders recently. Please wait a few minutes before placing another order.",
      };
    }

    const rpcItems = parseResult.data.items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    }));

    const { data: orderId, error: rpcError } = await supabase.rpc(
      "place_order",
      {
        items: rpcItems,
        notes: parseResult.data.notes || undefined,
      }
    );

    if (rpcError) {
      console.error("place_order RPC error:", rpcError);
      return {
        success: false,
        error:
          rpcError.message ||
          "Could not place your order. Please check item availability and try again.",
      };
    }

    try {
      revalidatePath("/account/orders");
      revalidatePath("/account");
    } catch {
      // Safe fallback outside Next.js request context
    }

    return {
      success: true,
      orderId: orderId as string,
    };
  } catch (err) {
    console.error("Unexpected error in placeOrderAction:", err);
    return {
      success: false,
      error: "An unexpected error occurred while placing your order.",
    };
  }
}

/**
 * Server Action: Cancels an existing order if it is in PENDING or CONFIRMED state.
 * Enforces anti-IDOR checks (verifying the order belongs strictly to the authenticated user).
 */
export async function cancelCustomerOrderAction(
  rawInput: CancelOrderInput
): Promise<CancelOrderResult> {
  try {
    const parseResult = cancelOrderSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error.errors[0]?.message || "Invalid request.",
      };
    }

    const { orderId } = parseResult.data;
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "You must be signed in to manage orders.",
      };
    }

    // Anti-IDOR: Check order existence & ownership
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, status, user_id")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !order) {
      return {
        success: false,
        error: "Order not found or you do not have permission to cancel it.",
      };
    }

    const currentStatus = order.status as OrderStatus;
    if (!canUserCancelOrder(currentStatus)) {
      return {
        success: false,
        error: `Order cannot be cancelled because it is already "${currentStatus}".`,
      };
    }

    // Verify valid status transition to CANCELLED
    assertValidOrderTransition(currentStatus, "CANCELLED");

    // Perform atomic status cancellation
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "CANCELLED" })
      .eq("id", orderId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Cancel order update error:", updateError);
      return {
        success: false,
        error: "Failed to cancel order. Please contact our atelier staff.",
      };
    }

    try {
      revalidatePath(`/account/orders/${orderId}`);
      revalidatePath("/account/orders");
      revalidatePath("/account");
    } catch {
      // Safe fallback
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("Unexpected error in cancelCustomerOrderAction:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while cancelling your order.",
    };
  }
}
