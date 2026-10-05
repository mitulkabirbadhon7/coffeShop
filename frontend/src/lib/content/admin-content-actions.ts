"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { logAdminAction } from "@/lib/audit/log";
import { siteContentSchema } from "@/lib/validation/content.schema";
import { sanitizeJsonContent } from "@/lib/sanitizer";
import type { Json } from "@/types/database.types";

export type AdminContentActionResult =
  | { success: true; message: string; contentKey?: string }
  | { error: string };

function safeRevalidateContentPaths() {
  try {
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/admin/content");
  } catch {
    // Graceful fallback outside Next.js request context
  }
}

/**
 * Upserts a site_content entry.
 * Validates with Zod, sanitizes content to prevent XSS, checks admin privileges,
 * and records an audit log.
 */
export async function upsertSiteContentAction(
  rawInput: unknown
): Promise<AdminContentActionResult> {
  try {
    const { user } = await requireAdmin();

    const parsed = siteContentSchema.safeParse(rawInput);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid content data";
      return { error: firstError };
    }

    const { content_key, content, published } = parsed.data;

    // Recursively sanitize all string fields in the content object
    const sanitizedContent = sanitizeJsonContent(content) as Json;

    const supabase = await createClient();

    // Upsert into public.site_content
    const { data: updatedRecord, error: upsertError } = await supabase
      .from("site_content")
      .upsert(
        {
          content_key,
          content: sanitizedContent,
          published,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "content_key" }
      )
      .select("id")
      .single();

    if (upsertError) {
      console.error("Database error saving site content:", upsertError);
      return { error: `Failed to save content: ${upsertError.message}` };
    }

    // Write audit log
    await logAdminAction({
      actorId: user.id,
      action: "UPDATE_SITE_CONTENT",
      entityType: "site_content",
      entityId: updatedRecord?.id || null,
      metadata: {
        content_key,
        published,
        actor_email: user.email,
      },
    });

    safeRevalidateContentPaths();

    return {
      success: true,
      message: `Content for "${content_key}" saved successfully (${published ? "Published" : "Draft"}).`,
      contentKey: content_key,
    };
  } catch (err: unknown) {
    console.error("Error in upsertSiteContentAction:", err);
    return {
      error: err instanceof Error ? err.message : "Failed to update site content",
    };
  }
}

/**
 * In-place toggle for site_content draft/published status
 */
export async function toggleSiteContentPublishAction(
  contentKey: string,
  published: boolean
): Promise<AdminContentActionResult> {
  try {
    const { user } = await requireAdmin();

    const supabase = await createClient();

    const { data: record, error: updateError } = await supabase
      .from("site_content")
      .update({
        published,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("content_key", contentKey)
      .select("id")
      .single();

    if (updateError) {
      return { error: updateError.message };
    }

    await logAdminAction({
      actorId: user.id,
      action: "TOGGLE_CONTENT_PUBLISH",
      entityType: "site_content",
      entityId: record?.id || null,
      metadata: {
        content_key: contentKey,
        published,
        actor_email: user.email,
      },
    });

    safeRevalidateContentPaths();

    return {
      success: true,
      message: `"${contentKey}" status set to ${published ? "Published" : "Draft"}.`,
      contentKey,
    };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : "Failed to toggle content status",
    };
  }
}
