import { z } from "zod";

export const profileSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
});

export const addressSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Label must be at least 2 characters (e.g. Home, Work)")
    .max(50, "Label is too long")
    .default("Home"),
  recipient_name: z
    .string()
    .trim()
    .min(2, "Recipient name must be at least 2 characters")
    .max(100, "Recipient name is too long"),
  phone: z
    .string()
    .trim()
    .min(6, "Phone number must be at least 6 characters")
    .max(20, "Phone number is too long"),
  line1: z
    .string()
    .trim()
    .min(3, "Street address must be at least 3 characters")
    .max(200, "Street address is too long"),
  line2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(100, "City is too long")
    .default("Dhaka"),
  postal_code: z
    .string()
    .trim()
    .min(2, "Postal code is required")
    .max(20, "Postal code is too long"),
  country: z.string().trim().default("Bangladesh"),
  is_default: z.boolean().default(false),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
