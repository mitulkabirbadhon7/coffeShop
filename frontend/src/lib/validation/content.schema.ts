import { z } from "zod";

/**
 * Validation schema for site_content entries
 */
export const siteContentSchema = z.object({
  content_key: z
    .string()
    .min(3, "Content key must be at least 3 characters")
    .max(50, "Content key cannot exceed 50 characters")
    .regex(/^[a-z0-9_]+$/, "Content key may only contain lowercase letters, numbers, and underscores"),
  content: z.record(z.unknown()).refine(
    (data) => {
      try {
        const serialized = JSON.stringify(data);
        return serialized.length <= 15000;
      } catch {
        return false;
      }
    },
    { message: "Content JSON structure cannot exceed 15,000 characters" }
  ),
  published: z.boolean().default(false),
});

export type SiteContentInput = z.infer<typeof siteContentSchema>;

/**
 * Validation schema for testimonials entries
 */
export const testimonialSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),
  quote: z
    .string()
    .min(10, "Quote must be at least 10 characters")
    .max(500, "Quote cannot exceed 500 characters")
    .trim(),
  role_or_context: z
    .string()
    .max(100, "Role or context cannot exceed 100 characters")
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  is_published: z.boolean().default(true),
  sort_order: z
    .number()
    .int("Sort order must be an integer")
    .min(0, "Sort order must be 0 or greater")
    .max(1000, "Sort order cannot exceed 1000")
    .default(0),
  image_path: z
    .string()
    .max(500, "Image path cannot exceed 500 characters")
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
