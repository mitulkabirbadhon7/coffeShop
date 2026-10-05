"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { logAdminAction } from "@/lib/audit/log";
import { testimonialSchema } from "@/lib/validation/content.schema";
import { sanitizeText } from "@/lib/sanitizer";

export type AdminTestimonialActionResult =
  | { success: true; message: string; testimonialId?: string }
  | { error: string };

function safeRevalidateTestimonialsPaths() {
  try {
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
  } catch {
    // Graceful fallback outside Next.js request context
  }
}

/**
 * Creates a new testimonial.
 */
export async function createTestimonialAction(
  rawInput: unknown
): Promise<AdminTestimonialActionResult> {
  try {
    const { user } = await requireAdmin();

    const parsed = testimonialSchema.safeParse(rawInput);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid testimonial data";
      return { error: firstError };
    }

    const { name, quote, role_or_context, is_published, sort_order, image_path } = parsed.data;

    // Sanitize string inputs to neutralize any XSS tags
    const safeName = sanitizeText(name, 100);
    const safeQuote = sanitizeText(quote, 500);
    const safeRole = role_or_context ? sanitizeText(role_or_context, 100) : null;

    const supabase = await createClient();

    const { data: newRecord, error: insertError } = await supabase
      .from("testimonials")
      .insert({
        name: safeName,
        quote: safeQuote,
        role_or_context: safeRole,
        is_published,
        sort_order,
        image_path: image_path || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Database error creating testimonial:", insertError);
      return { error: `Failed to create testimonial: ${insertError.message}` };
    }

    await logAdminAction({
      actorId: user.id,
      action: "CREATE_TESTIMONIAL",
      entityType: "testimonials",
      entityId: newRecord.id,
      metadata: {
        name: safeName,
        is_published,
        sort_order,
        actor_email: user.email,
      },
    });

    safeRevalidateTestimonialsPaths();

    return {
      success: true,
      message: `Testimonial from "${safeName}" created successfully.`,
      testimonialId: newRecord.id,
    };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : "Failed to create testimonial",
    };
  }
}

/**
 * Updates an existing testimonial.
 */
export async function updateTestimonialAction(
  id: string,
  rawInput: unknown
): Promise<AdminTestimonialActionResult> {
  try {
    const { user } = await requireAdmin();

    if (!id || typeof id !== "string") {
      return { error: "Missing testimonial ID" };
    }

    const parsed = testimonialSchema.safeParse(rawInput);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid testimonial data";
      return { error: firstError };
    }

    const { name, quote, role_or_context, is_published, sort_order, image_path } = parsed.data;

    const safeName = sanitizeText(name, 100);
    const safeQuote = sanitizeText(quote, 500);
    const safeRole = role_or_context ? sanitizeText(role_or_context, 100) : null;

    const supabase = await createClient();

    const { error: updateError } = await supabase
      .from("testimonials")
      .update({
        name: safeName,
        quote: safeQuote,
        role_or_context: safeRole,
        is_published,
        sort_order,
        image_path: image_path || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Database error updating testimonial:", updateError);
      return { error: `Failed to update testimonial: ${updateError.message}` };
    }

    await logAdminAction({
      actorId: user.id,
      action: "UPDATE_TESTIMONIAL",
      entityType: "testimonials",
      entityId: id,
      metadata: {
        name: safeName,
        is_published,
        sort_order,
        actor_email: user.email,
      },
    });

    safeRevalidateTestimonialsPaths();

    return {
      success: true,
      message: `Testimonial from "${safeName}" updated successfully.`,
      testimonialId: id,
    };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : "Failed to update testimonial",
    };
  }
}

/**
 * Toggles a testimonial's published status in-place.
 */
export async function toggleTestimonialPublishAction(
  id: string,
  is_published: boolean
): Promise<AdminTestimonialActionResult> {
  try {
    const { user } = await requireAdmin();

    const supabase = await createClient();

    const { error: updateError } = await supabase
      .from("testimonials")
      .update({
        is_published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      return { error: updateError.message };
    }

    await logAdminAction({
      actorId: user.id,
      action: "TOGGLE_TESTIMONIAL_PUBLISH",
      entityType: "testimonials",
      entityId: id,
      metadata: {
        is_published,
        actor_email: user.email,
      },
    });

    safeRevalidateTestimonialsPaths();

    return {
      success: true,
      message: `Testimonial publishing status set to ${is_published ? "Published" : "Draft"}.`,
      testimonialId: id,
    };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : "Failed to toggle testimonial status",
    };
  }
}

/**
 * Updates sort orders for multiple testimonials.
 */
export async function reorderTestimonialsAction(
  orderedItems: { id: string; sort_order: number }[]
): Promise<AdminTestimonialActionResult> {
  try {
    const { user } = await requireAdmin();

    const supabase = await createClient();

    for (const item of orderedItems) {
      await supabase
        .from("testimonials")
        .update({
          sort_order: item.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);
    }

    await logAdminAction({
      actorId: user.id,
      action: "REORDER_TESTIMONIALS",
      entityType: "testimonials",
      entityId: null,
      metadata: {
        count: orderedItems.length,
        actor_email: user.email,
      },
    });

    safeRevalidateTestimonialsPaths();

    return {
      success: true,
      message: "Testimonials reordered successfully.",
    };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : "Failed to reorder testimonials",
    };
  }
}

/**
 * Permanently deletes a testimonial.
 */
export async function deleteTestimonialAction(
  id: string
): Promise<AdminTestimonialActionResult> {
  try {
    const { user } = await requireAdmin();

    const supabase = await createClient();

    const { error: deleteError } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return { error: deleteError.message };
    }

    await logAdminAction({
      actorId: user.id,
      action: "DELETE_TESTIMONIAL",
      entityType: "testimonials",
      entityId: id,
      metadata: {
        actor_email: user.email,
      },
    });

    safeRevalidateTestimonialsPaths();

    return {
      success: true,
      message: "Testimonial deleted successfully.",
      testimonialId: id,
    };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : "Failed to delete testimonial",
    };
  }
}
