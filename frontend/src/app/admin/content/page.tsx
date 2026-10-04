import { FileText, Sparkles } from "lucide-react";

export const metadata = {
  title: "Site Content | Chocobliss Admin Atelier",
};

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F5E6D3]">
          Editorial Site Content
        </h1>
        <p className="text-xs sm:text-sm text-[#F5E6D3]/60 font-sans">
          Manage homepage announcements, roastery stories, and atelier headlines.
        </p>
      </div>

      <div className="rounded-2xl bg-[#231B18] border border-[#5C4A3D]/40 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#D4A373]/15 text-[#D4A373] flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h2 className="font-serif font-bold text-base text-[#F5E6D3]">
            Content Management Hub
          </h2>
          <p className="text-xs text-[#8A8179] leading-relaxed">
            Content editor foundation active. Section updates and dynamic publishing workflow will be expanded in Phase 12.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A373]/10 border border-[#D4A373]/30 text-[#D4A373] text-[11px] font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Scheduled for Phase 12</span>
        </div>
      </div>
    </div>
  );
}
