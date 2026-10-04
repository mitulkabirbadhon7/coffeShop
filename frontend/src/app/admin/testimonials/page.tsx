import { Star, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Testimonials | Chocobliss Admin Atelier",
};

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, name, quote, role_or_context, is_published, sort_order, created_at")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F5E6D3]">
          Guest Testimonials &amp; Reviews
        </h1>
        <p className="text-xs sm:text-sm text-[#F5E6D3]/60 font-sans">
          Manage customer reviews displayed across the homepage and roastery showcase.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials && testimonials.length > 0 ? (
          testimonials.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl bg-[#231B18] border border-[#5C4A3D]/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#D4A373]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D4A373]" />
                  ))}
                </div>
                {t.is_published && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/30">
                    Published
                  </span>
                )}
              </div>

              <p className="text-xs text-[#F5E6D3]/85 italic leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="pt-2 border-t border-[#5C4A3D]/30 flex items-center justify-between text-xs text-[#8A8179]">
                <span className="font-serif font-bold text-[#F5E6D3]">{t.name}</span>
                <span className="text-[10px]">{t.role_or_context || "Verified Guest"}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-xs text-[#8A8179]">
            No testimonials found in database.
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl bg-[#2C221E] border border-[#5C4A3D]/40 text-xs text-[#8A8179] flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#D4A373] shrink-0" />
        <span>Full curation and publishing controls will be active in Phase 12.</span>
      </div>
    </div>
  );
}
