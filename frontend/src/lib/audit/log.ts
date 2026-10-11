import { createClient } from "@/lib/supabase/server";

export interface LogAdminActionParams {
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
}

export type AuditLogResult = {
  success: boolean;
  logId?: string;
  error?: string;
};

/**
 * Strips sensitive fields (passwords, tokens, secrets) before writing metadata to audit_logs.
 */
function sanitizeAuditMetadata(
  meta: Record<string, unknown> | null | undefined
): Record<string, unknown> | null {
  if (!meta) return null;
  const sensitiveKeys = ["password", "token", "secret", "cookie", "auth", "key"];
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(meta)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = "[REDACTED]";
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Records an immutable administrative action to `public.audit_logs`.
 * Complies with S4 & Phase 9 audit standards: tracks actor, action, target entity, timestamp,
 * with non-bypassable Row Level Security policies.
 */
export async function logAdminAction({
  actorId,
  action,
  entityType,
  entityId = null,
  metadata = null,
}: LogAdminActionParams): Promise<AuditLogResult> {
  try {
    const supabase = await createClient();
    const sanitizedMetadata = sanitizeAuditMetadata(metadata);

    const { data, error } = await supabase
      .from("audit_logs")
      .insert({
        actor_id: actorId,
        action: action.toUpperCase(),
        entity_type: entityType.toLowerCase(),
        entity_id: entityId,
        metadata: sanitizedMetadata as any,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Audit log error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, logId: data.id };
  } catch (err: unknown) {
    console.error("Unexpected error in logAdminAction:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Audit log exception",
    };
  }
}
