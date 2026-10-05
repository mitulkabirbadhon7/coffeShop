import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Please provide a valid email address"),
  // Honeypot field for bot deterrence
  hp_field: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
