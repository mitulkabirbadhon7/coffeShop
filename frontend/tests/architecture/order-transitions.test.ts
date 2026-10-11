import { describe, it, expect } from "vitest";
import {
  isValidOrderTransition,
  assertValidOrderTransition,
  type OrderStatus,
} from "@/lib/services/order.service";

describe("Phase 2: Order State Machine Transitions", () => {
  describe("Allowed State Transitions", () => {
    const validTransitions: [OrderStatus, OrderStatus][] = [
      ["PENDING", "CONFIRMED"],
      ["PENDING", "CANCELLED"],
      ["CONFIRMED", "PREPARING"],
      ["CONFIRMED", "CANCELLED"],
      ["PREPARING", "READY"],
      ["READY", "COMPLETED"],
      ["PENDING", "PENDING"], // idempotent
      ["READY", "READY"],
    ];

    validTransitions.forEach(([from, to]) => {
      it(`permits transition from ${from} to ${to}`, () => {
        expect(isValidOrderTransition(from, to)).toBe(true);
        expect(() => assertValidOrderTransition(from, to)).not.toThrow();
      });
    });
  });

  describe("Forbidden State Transitions (Tamper Prevention)", () => {
    const invalidTransitions: [OrderStatus, OrderStatus][] = [
      ["COMPLETED", "PENDING"],
      ["COMPLETED", "PREPARING"],
      ["CANCELLED", "CONFIRMED"],
      ["CANCELLED", "READY"],
      ["PENDING", "READY"], // Cannot jump directly to READY without brewing
      ["PENDING", "COMPLETED"], // Cannot jump directly to COMPLETED
      ["PREPARING", "CANCELLED"], // In-progress brewing cannot be cancelled without manager override
      ["READY", "PREPARING"], // Cannot un-ready a completed brew
    ];

    invalidTransitions.forEach(([from, to]) => {
      it(`rejects invalid transition from ${from} to ${to}`, () => {
        expect(isValidOrderTransition(from, to)).toBe(false);
        expect(() => assertValidOrderTransition(from, to)).toThrow(
          `Invalid order status transition from "${from}" to "${to}".`
        );
      });
    });
  });
});
