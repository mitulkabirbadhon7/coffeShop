"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guards";
import { logAdminAction } from "@/lib/audit/log";
import {
  productSchema,
  updateProductSchema,
  type ProductInput,
  type UpdateProductInput,
} from "@/lib/validation/product.schema";

export type AdminActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

function safeRevalidate() {
  try {
    revalidatePath("/products");
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
  } catch {
    // Safe fallback outside Next.js request context
  }
}

/**
 * Creates a new specialty coffee or confectionery product.
 * Enforces admin authorization, slug uniqueness, and audit trail retention.
 */
export async function createProductAction(
  rawInput: ProductInput
): Promise<AdminActionResult<{ id: string; slug: string }>> {
  try {
    const { user } = await requireAdmin();

    const parseResult = productSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error.errors[0]?.message || "Invalid product details.",
      };
    }

    const {
      name,
      slug,
      description,
      categoryId,
      priceMinor,
      imagePath,
      ingredients,
      variants,
      discountPercentage,
      isAvailable,
      isFeatured,
    } = parseResult.data;

    const supabase = await createClient();

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error: `A product with slug "${slug}" already exists. Please choose a unique slug.`,
      };
    }

    const { data: created, error: insertError } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        description,
        category_id: categoryId,
        price_minor: priceMinor,
        currency: "BDT",
        image_path: imagePath,
        ingredients,
        variants,
        discount_percentage: discountPercentage,
        is_available: isAvailable,
        is_featured: isFeatured,
      })
      .select("id, slug")
      .single();

    if (insertError || !created) {
      console.error("Failed to insert product:", insertError);
      return { success: false, error: insertError?.message || "Database insert failed." };
    }

    // Record audit log
    await logAdminAction({
      actorId: user.id,
      action: "CREATE_PRODUCT",
      entityType: "product",
      entityId: created.id,
      metadata: { name, slug, priceMinor },
    });

    safeRevalidate();

    return {
      success: true,
      data: { id: created.id, slug: created.slug },
    };
  } catch (err: unknown) {
    console.error("Error in createProductAction:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unexpected error creating product.",
    };
  }
}

/**
 * Updates an existing product's fields.
 */
export async function updateProductAction(
  rawInput: UpdateProductInput
): Promise<AdminActionResult<{ id: string }>> {
  try {
    const { user } = await requireAdmin();

    const parseResult = updateProductSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error.errors[0]?.message || "Invalid product data.",
      };
    }

    const {
      id,
      name,
      slug,
      description,
      categoryId,
      priceMinor,
      imagePath,
      ingredients,
      variants,
      discountPercentage,
      isAvailable,
      isFeatured,
    } = parseResult.data;

    const supabase = await createClient();

    // Check slug collision if slug changed
    const { data: existingSlug } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        error: `Another product is already using the slug "${slug}".`,
      };
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({
        name,
        slug,
        description,
        category_id: categoryId,
        price_minor: priceMinor,
        image_path: imagePath,
        ingredients,
        variants,
        discount_percentage: discountPercentage,
        is_available: isAvailable,
        is_featured: isFeatured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Failed to update product:", updateError);
      return { success: false, error: updateError.message };
    }

    // Record audit log
    await logAdminAction({
      actorId: user.id,
      action: "UPDATE_PRODUCT",
      entityType: "product",
      entityId: id,
      metadata: { name, slug, priceMinor },
    });

    safeRevalidate();
    try {
      revalidatePath(`/products/${slug}`);
    } catch {
      // Safe fallback
    }

    return { success: true, data: { id } };
  } catch (err: unknown) {
    console.error("Error in updateProductAction:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unexpected error updating product.",
    };
  }
}

/**
 * Toggles product availability (in-stock vs sold-out).
 */
export async function toggleProductAvailabilityAction(
  productId: string,
  isAvailable: boolean
): Promise<AdminActionResult> {
  try {
    const { user } = await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase
      .from("products")
      .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
      .eq("id", productId);

    if (error) {
      return { success: false, error: error.message };
    }

    await logAdminAction({
      actorId: user.id,
      action: isAvailable ? "SET_AVAILABLE" : "SET_UNAVAILABLE",
      entityType: "product",
      entityId: productId,
    });

    safeRevalidate();
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle availability.",
    };
  }
}

/**
 * Toggles featured showcase status on homepage.
 */
export async function toggleProductFeaturedAction(
  productId: string,
  isFeatured: boolean
): Promise<AdminActionResult> {
  try {
    const { user } = await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase
      .from("products")
      .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
      .eq("id", productId);

    if (error) {
      return { success: false, error: error.message };
    }

    await logAdminAction({
      actorId: user.id,
      action: isFeatured ? "FEATURE_PRODUCT" : "UNFEATURE_PRODUCT",
      entityType: "product",
      entityId: productId,
    });

    safeRevalidate();
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle featured status.",
    };
  }
}

/**
 * Performs a safe soft delete by populating `deleted_at = now()` and `is_available = false`.
 * Preserves historical orders and database foreign key integrity.
 */
export async function softDeleteProductAction(
  productId: string
): Promise<AdminActionResult> {
  try {
    const { user } = await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase
      .from("products")
      .update({
        deleted_at: new Date().toISOString(),
        is_available: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) {
      return { success: false, error: error.message };
    }

    await logAdminAction({
      actorId: user.id,
      action: "SOFT_DELETE_PRODUCT",
      entityType: "product",
      entityId: productId,
    });

    safeRevalidate();
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to soft delete product.",
    };
  }
}

/**
 * Restores a previously soft-deleted product (`deleted_at = null`, `is_available = true`).
 */
export async function restoreProductAction(
  productId: string
): Promise<AdminActionResult> {
  try {
    const { user } = await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase
      .from("products")
      .update({
        deleted_at: null,
        is_available: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) {
      return { success: false, error: error.message };
    }

    await logAdminAction({
      actorId: user.id,
      action: "RESTORE_PRODUCT",
      entityType: "product",
      entityId: productId,
    });

    safeRevalidate();
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to restore product.",
    };
  }
}
