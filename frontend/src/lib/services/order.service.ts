import type { Database } from "@/types/database.types";

export type OrderStatus = Database["public"]["Enums"]["order_status"];

/**
 * Valid state transitions for Chocobliss customer orders per SCHEMA.md:
 * - PENDING → CONFIRMED
 * - CONFIRMED → PREPARING
 * - PREPARING → READY
 * - READY → COMPLETED
 * - PENDING → CANCELLED
 * - CONFIRMED → CANCELLED
 */
const VALID_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY"],
  READY: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

/**
 * Checks whether transitioning from `currentStatus` to `nextStatus` is permissible.
 */
export function isValidOrderTransition(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus
): boolean {
  if (currentStatus === nextStatus) return true;
  const allowed = VALID_ORDER_TRANSITIONS[currentStatus];
  return allowed ? allowed.includes(nextStatus) : false;
}

/**
 * Asserts that an order transition is valid; throws an Error if invalid.
 */
export function assertValidOrderTransition(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus
): void {
  if (!isValidOrderTransition(currentStatus, nextStatus)) {
    throw new Error(
      `Invalid order status transition from "${currentStatus}" to "${nextStatus}".`
    );
  }
}
