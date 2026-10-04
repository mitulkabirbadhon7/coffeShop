"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAdminAction } from "@/lib/audit/log";
import type { Database } from "@/types/database.types";

export type UserRole = Database["public"]["Enums"]["user_role"];

export interface UpdateUserRoleResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action: Promotes or demotes user administrative privileges.
 * Enforces admin caller authentication, self-demotion prevention,
 * guaranteed last-admin retention, and audit trail logging.
 */
export async function updateUserRoleAction(
  targetUserId: string,
  newRole: UserRole
): Promise<UpdateUserRoleResult> {
  try {
    const { user } = await requireAdmin();

    // 1. Strict self-demotion prevention
    if (targetUserId === user.id && newRole !== "ADMIN") {
      return {
        success: false,
        error: "Administrators cannot demote their own account. Another administrator must perform this action.",
      };
    }

    const adminClient = createAdminClient();

    // 2. Fetch target profile
    const { data: targetProfile, error: fetchError } = await adminClient
      .from("profiles")
      .select("id, role, display_name")
      .eq("id", targetUserId)
      .single();

    if (fetchError || !targetProfile) {
      return { success: false, error: "Target user profile not found." };
    }

    // 3. Prevent demoting the last active administrator
    if (targetProfile.role === "ADMIN" && newRole !== "ADMIN") {
      const { count: adminCount, error: countError } = await adminClient
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "ADMIN");

      if (countError || !adminCount || adminCount <= 1) {
        return {
          success: false,
          error: "Operation denied: At least one active administrator must remain in the system.",
        };
      }
    }

    // 4. Update role via service-role client
    const { error: updateError } = await adminClient
      .from("profiles")
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetUserId);

    if (updateError) {
      console.error("Failed to update user role:", updateError);
      return { success: false, error: updateError.message };
    }

    // 5. Record audit log
    await logAdminAction({
      actorId: user.id,
      action: newRole === "ADMIN" ? "PROMOTE_ADMIN" : "DEMOTE_ADMIN",
      entityType: "user",
      entityId: targetUserId,
      metadata: {
        fromRole: targetProfile.role,
        toRole: newRole,
        targetDisplayName: targetProfile.display_name,
      },
    });

    try {
      revalidatePath("/admin/users");
      revalidatePath("/admin");
    } catch {
      // Safe fallback
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("Error in updateUserRoleAction:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update user role.",
    };
  }
}
