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

/**
 * Checks whether an order can be cancelled by the placing customer.
 * Only orders that have not yet entered preparation can be cancelled.
 */
export function canUserCancelOrder(status: OrderStatus): boolean {
  return status === "PENDING" || status === "CONFIRMED";
}

/**
 * Linear fulfillment flow for tracking UI
 */
export const ORDER_FULFILLMENT_STEPS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
];

export interface OrderStatusMeta {
  label: string;
  description: string;
  badgeClass: string;
}

export const ORDER_STATUS_DETAILS: Record<OrderStatus, OrderStatusMeta> = {
  PENDING: {
    label: "Order Placed",
    description: "Your order is received and waiting for atelier confirmation.",
    badgeClass: "bg-[#D4A373]/15 text-[#D4A373] border-[#D4A373]/30",
  },
  CONFIRMED: {
    label: "Confirmed",
    description: "Our baristas confirmed your order and scheduled preparation.",
    badgeClass: "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30",
  },
  PREPARING: {
    label: "Preparing",
    description: "Your espresso or confections are being crafted at the brew bar.",
    badgeClass: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30",
  },
  READY: {
    label: "Ready for Pickup",
    description: "Your order is packaged and waiting at the Banani atelier counter.",
    badgeClass: "bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/30",
  },
  COMPLETED: {
    label: "Collected",
    description: "Order completed and collected. Thank you for visiting Chocobliss!",
    badgeClass: "bg-[#A8A29E]/15 text-[#A8A29E] border-[#A8A29E]/30",
  },
  CANCELLED: {
    label: "Cancelled",
    description: "This order has been cancelled.",
    badgeClass: "bg-[#F87171]/15 text-[#F87171] border-[#F87171]/30",
  },
};
