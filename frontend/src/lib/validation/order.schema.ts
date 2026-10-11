import { z } from "zod";

export const orderItemInputSchema = z.object({
  productId: z.string().uuid("Invalid product identifier."),
  quantity: z
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.")
    .max(20, "Quantity cannot exceed 20 units per item."),
});

export const placeOrderSchema = z.object({
  items: z
    .array(orderItemInputSchema)
    .min(1, "Your cart must contain at least one item to place an order.")
    .max(50, "Orders cannot exceed 50 distinct items."),
  notes: z
    .string()
    .max(500, "Pickup notes cannot exceed 500 characters.")
    .optional()
    .nullable()
    .transform((val) => (val && val.trim().length > 0 ? val.trim() : null)),
});

export const cancelOrderSchema = z.object({
  orderId: z.string().uuid("Invalid order identifier."),
  reason: z.string().max(300, "Cancellation reason cannot exceed 300 characters.").optional(),
});

export type OrderItemInput = z.infer<typeof orderItemInputSchema>;
export type PlaceOrderInput = z.input<typeof placeOrderSchema>;
export type PlaceOrderOutput = z.output<typeof placeOrderSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
