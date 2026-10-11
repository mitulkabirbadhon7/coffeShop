"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guards";
import { logAdminAction } from "@/lib/audit/log";
import {
  isValidOrderTransition,
  type OrderStatus,
} from "@/lib/services/order.service";

export type AdminOrderResult = {
  success: boolean;
  newStatus?: OrderStatus;
  error?: string;
};

function safeRevalidateOrderPaths(orderId?: string) {
  try {
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/account/orders");
    if (orderId) {
      revalidatePath(`/account/orders/${orderId}`);
    }
  } catch {
    // Safe fallback outside Next.js request context
  }
}

/**
 * Server Action: Updates an order status along the authorized state machine.
 * Enforces admin authorization, state transition validation, and audit trail logging.
 */
export async function updateAdminOrderStatusAction(
  orderId: string,
  nextStatus: OrderStatus
): Promise<AdminOrderResult> {
  try {
    const { user } = await requireAdmin();
    const supabase = await createClient();

    // 1. Fetch current order
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, status, user_id, total_minor")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return { success: false, error: "Order not found." };
    }

    const currentStatus = order.status as OrderStatus;

    // 2. Validate transition against state machine
    if (!isValidOrderTransition(currentStatus, nextStatus)) {
      return {
        success: false,
        error: `Invalid transition: Order cannot transition from "${currentStatus}" to "${nextStatus}".`,
      };
    }

    // 3. Perform atomic status update
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Failed to update order status:", updateError);
      return { success: false, error: updateError.message };
    }

    // 4. Record audit log
    await logAdminAction({
      actorId: user.id,
      action: "UPDATE_ORDER_STATUS",
      entityType: "order",
      entityId: orderId,
      metadata: {
        fromStatus: currentStatus,
        toStatus: nextStatus,
        totalMinor: order.total_minor,
      },
    });

    safeRevalidateOrderPaths(orderId);

    return {
      success: true,
      newStatus: nextStatus,
    };
  } catch (err: unknown) {
    console.error("Error in updateAdminOrderStatusAction:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Unexpected error updating order status.",
    };
  }
}
