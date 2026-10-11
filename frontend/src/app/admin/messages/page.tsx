import { MessageSquare, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/formatters";

export const metadata = {
  title: "Inquiries & Messages | Chocobliss Admin Atelier",
};

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("id, name, email, subject, message, status, created_at")
    .order("created_at", { ascending: false })
    .limit(25);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F5E6D3]">
          Customer Messages &amp; Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-[#F5E6D3]/60 font-sans">
          Messages sent via the Contact page form from atelier guests and wholesale inquiries.
        </p>
      </div>

      <div className="rounded-2xl bg-[#231B18] border border-[#5C4A3D]/40 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#5C4A3D]/40 bg-[#1A1613]/50 flex items-center justify-between text-xs text-[#8A8179] font-medium font-sans">
          <span>Sender &amp; Subject</span>
          <span>Date</span>
        </div>

        <div className="divide-y divide-[#5C4A3D]/30">
          {messages && messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[#F5E6D3]">
                      {msg.name}
                    </span>
                    <span className="text-[#D4A373] text-[11px] font-mono">
                      &lt;{msg.email}&gt;
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D4A373]/15 text-[#D4A373] border border-[#D4A373]/30">
                      {msg.status}
                    </span>
                  </div>

                  <p className="font-medium text-[#F5E6D3] text-xs">
                    {msg.subject}
                  </p>

                  <p className="text-[#8A8179] leading-relaxed pt-1 bg-[#2C221E]/60 p-3 rounded-lg border border-[#5C4A3D]/30">
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[#8A8179] shrink-0 text-xs">
                  <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>{formatDate(msg.created_at)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-[#8A8179] space-y-2">
              <MessageSquare className="w-8 h-8 text-[#8A8179]/40 mx-auto" />
              <p>No contact inquiries received yet.</p>
              <p className="text-[11px] text-[#8A8179]/60">
                Messages submitted through `/contact` will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
