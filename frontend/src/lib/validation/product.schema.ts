import { z } from "zod";

export const productSlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters.")
    .max(100, "Product name cannot exceed 100 characters.")
    .trim(),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters.")
    .max(100, "Slug cannot exceed 100 characters.")
    .regex(
      productSlugRegex,
      "Slug must be lowercase alphanumeric with hyphens (e.g. 'ethiopia-yirgacheffe')."
    ),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters.")
    .optional()
    .nullable()
    .transform((val) => (val && val.trim().length > 0 ? val.trim() : null)),
  categoryId: z.string().uuid("Please select a valid product category."),
  priceMinor: z
    .number()
    .int("Price must be an integer minor unit (poisha).")
    .min(100, "Price must be at least ৳1.00 (100 minor units).")
    .max(10000000, "Price exceeds maximum threshold (৳100,000)."),
  imagePath: z
    .string()
    .max(500, "Image path cannot exceed 500 characters.")
    .optional()
    .nullable()
    .transform((val) => (val && val.trim().length > 0 ? val.trim() : null)),
  ingredients: z
    .array(z.string().min(1).max(50))
    .max(10, "Cannot specify more than 10 tasting notes or ingredients.")
    .default([]),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const updateProductSchema = productSchema.extend({
  id: z.string().uuid("Invalid product identifier."),
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters.")
    .max(50, "Category name cannot exceed 50 characters.")
    .trim(),
  slug: z
    .string()
    .min(2, "Category slug must be at least 2 characters.")
    .max(50, "Category slug cannot exceed 50 characters.")
    .regex(productSlugRegex, "Category slug must be lowercase alphanumeric with hyphens."),
  description: z
    .string()
    .max(300, "Category description cannot exceed 300 characters.")
    .optional()
    .nullable(),
  sortOrder: z.number().int().min(0).max(100).default(0),
});

export type ProductInput = z.input<typeof productSchema>;
export type ProductOutput = z.output<typeof productSchema>;
export type UpdateProductInput = z.input<typeof updateProductSchema>;
export type CategoryInput = z.input<typeof categorySchema>;
