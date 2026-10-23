import type { Metadata } from "next";
import Link from "next/link";
import { Star, Quote, ArrowLeft, Coffee, ShieldCheck, HeartHandshake, CheckCircle2 } from "lucide-react";
import { getPublishedTestimonials } from "@/lib/data/content.data";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Guest Reviews & Reflections | Chocobliss Coffee Roastery",
  description:
    "Read authentic reviews from guests and coffee aficionados at Chocobliss Roastery in Banani, Dhaka.",
};

const EXTRA_REVIEWS = [
  {
    id: "r1",
    name: "Dr. Kazi Anisur Rahman",
    role: "Banani Resident & Daily Regular",
    quote: "The Velvet Cortado here is unmatched anywhere in Gulshan or Banani. Dense microfoam, zero bitterness, pure cacao finish.",
    rating: 5,
    date: "October 2026",
  },
  {
    id: "r2",
    name: "Mahira Chowdhury",
    role: "Architect & Specialty Enthusiast",
    quote: "Their Kyoto 12-hour slow drip feels like a fine vintage. You can taste every nuance of jasmine and bergamot.",
    rating: 5,
    date: "October 2026",
  },
  {
    id: "r3",
    name: "Saadman Sakib",
    role: "Software Architect",
    quote: "Ordering ahead for counter pickup on my morning commute saves my day. The packaging preserves the crema perfectly.",
    rating: 5,
    date: "September 2026",
  },
];

export default async function ReviewsPage() {
  const dbTestimonials = await getPublishedTestimonials();

  return (
    <div className="bg-[#FDFBF7] min-h-screen text-[#2C221E] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#8A8179] font-sans"
        >
          <Link href="/" className="hover:text-[#2C221E] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#2C221E] font-medium">Guest Reviews</span>
        </nav>

        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#5C4A3D] hover:text-[#2C221E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Roastery</span>
          </Link>
        </div>

        {/* Page Header Banner */}
        <div className="bg-[#2C221E] text-[#FDFBF7] rounded-xl p-8 sm:p-12 border border-[#5C4A3D]/40 shadow-xl space-y-6 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#D4A373]">
            Atelier Cupping Notes &amp; Reflections
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FDFBF7]">
            Words From Our Guests
          </h1>

          <p className="text-sm sm:text-base text-[#FDFBF7]/85 font-sans leading-relaxed max-w-2xl mx-auto">
            Every cup we pull and every batch we roast is an invitation to pause.
            Here is what Dhaka&apos;s coffee and chocolate community has to say.
          </p>

          {/* Key Trust Metrics */}
          <div className="pt-6 border-t border-[#5C4A3D]/40 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#1A1613] text-[#D4A373] border border-[#5C4A3D]/50">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-[#FDFBF7]">4.9 / 5.0</p>
                <p className="text-xs text-[#8A8179]">From 180+ Dhaka patrons</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#1A1613] text-[#D4A373] border border-[#5C4A3D]/50">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-[#FDFBF7]">88+ SCA</p>
                <p className="text-xs text-[#8A8179]">Specialty micro-lots only</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#1A1613] text-[#D4A373] border border-[#5C4A3D]/50">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-[#FDFBF7]">100% Traceable</p>
                <p className="text-xs text-[#8A8179]">Ethical direct-trade farms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#D4A373]/30 pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#2C221E]">
              Recent Patron Experiences
            </h2>
            <Link
              href="/login?returnUrl=/reviews"
              className="px-4 py-2 rounded-md bg-[#2C221E] text-[#FDFBF7] text-xs font-medium hover:bg-[#3D3028] border border-[#5C4A3D]/60 transition-colors shadow-sm"
            >
              Share Your Experience
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dbTestimonials.map((t) => (
              <div
                key={t.id}
                className="flex flex-col justify-between rounded-lg border border-[#8A8179]/20 bg-[#F4F1EA] p-6 shadow-sm hover:border-[#D4A373]/60 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#D4A373]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <Quote className="w-4 h-4 text-[#8A8179]/40" />
                  </div>

                  <p className="font-serif text-sm text-[#2C221E] leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#8A8179]/15">
                  <p className="font-serif font-bold text-sm text-[#2C221E]">{t.name}</p>
                  {t.role_or_context && (
                    <p className="text-xs text-[#5C4A3D] font-sans">{t.role_or_context}</p>
                  )}
                </div>
              </div>
            ))}

            {EXTRA_REVIEWS.map((r) => (
              <div
                key={r.id}
                className="flex flex-col justify-between rounded-lg border border-[#8A8179]/20 bg-[#F4F1EA] p-6 shadow-sm hover:border-[#D4A373]/60 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#D4A373]">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#8A8179] font-sans">{r.date}</span>
                  </div>

                  <p className="font-serif text-sm text-[#2C221E] leading-relaxed italic">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#8A8179]/15">
                  <p className="font-serif font-bold text-sm text-[#2C221E]">{r.name}</p>
                  <p className="text-xs text-[#5C4A3D] font-sans">{r.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-xl bg-[#F4F1EA] border border-[#8A8179]/20 text-center space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#2C221E]">
            Ready to experience Dhaka&apos;s finest roast?
          </h3>
          <p className="text-xs sm:text-sm text-[#5C4A3D] max-w-md mx-auto">
            Order your freshly pulled espresso, Kyoto cold brew, or French pastry online for hot pickup at our Banani bar.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <Button as="span"
                variant="primary"
                size="md"
                className="bg-[#D4A373] text-[#1A1613] hover:bg-[#FAEDCD] font-medium tracking-wide rounded-md h-11 px-7 transition-all"
              >
                <span>Explore Full Menu</span>
              </Button>
            </Link>
            <Link href="/about">
              <Button as="span"
                variant="outline"
                size="md"
                className="border-[#2C221E] text-[#2C221E] hover:bg-[#2C221E] hover:text-[#FDFBF7] font-medium tracking-wide rounded-md h-11 px-6 transition-all"
              >
                <span>Our Roastery Story</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
