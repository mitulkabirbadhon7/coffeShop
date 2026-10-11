import { History, Shield, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/formatters";

export const metadata = {
  title: "Audit Trail | Chocobliss Admin Atelier",
};

export default async function AdminAuditPage() {
  const supabase = await createClient();

  const { data: logs, error } = await supabase
    .from("audit_logs")
    .select("id, actor_id, action, entity_type, entity_id, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F5E6D3]">
            Security Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-[#F5E6D3]/60 font-sans">
            Immutable log of staff and system administrative actions for security compliance.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#2C221E] border border-[#5C4A3D]/50 text-xs text-[#D4A373]">
          <History className="w-3.5 h-3.5" />
          <span>Last 50 Entries</span>
        </div>
      </div>

      <div className="rounded-2xl bg-[#231B18] border border-[#5C4A3D]/40 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#5C4A3D]/40 bg-[#1A1613]/50 flex items-center justify-between text-xs text-[#8A8179] font-medium font-sans">
          <span>Action / Target</span>
          <span>Timestamp</span>
        </div>

        <div className="divide-y divide-[#5C4A3D]/30">
          {logs && logs.length > 0 ? (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold px-2 py-0.5 rounded bg-[#D4A373]/15 text-[#D4A373] border border-[#D4A373]/30 text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-[#F5E6D3] font-medium">
                      {log.entity_type}
                    </span>
                    {log.entity_id && (
                      <span className="font-mono text-[#8A8179] text-[11px]">
                        ({log.entity_id.slice(0, 8)})
                      </span>
                    )}
                  </div>
                  {log.metadata && (
                    <p className="text-[11px] text-[#8A8179] font-mono truncate max-w-md">
                      {JSON.stringify(log.metadata)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[#8A8179] shrink-0">
                  <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>{formatDate(log.created_at)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-[#8A8179] space-y-2">
              <Shield className="w-8 h-8 text-[#8A8179]/40 mx-auto" />
              <p>No audit log events recorded yet.</p>
              <p className="text-[11px] text-[#8A8179]/60">
                Administrative operations (product creation, order status changes) will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
