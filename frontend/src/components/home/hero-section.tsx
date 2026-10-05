import * as React from "react";
import Link from "next/link";
import { Coffee, ArrowRight, Sparkles, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollVideo } from "@/components/animations/ScrollVideo";
import { SteamSwirl } from "@/components/motion/steam-swirl";
import { AmbientAroma } from "@/components/motion/ambient-aroma";
import { getPublishedContent } from "@/lib/data/content.data";

export async function HeroSection() {
  const dynamicContent = await getPublishedContent("hero_section");

  const title =
    (dynamicContent?.title as string) ||
    "Where Artisanal Roast Meets Pure Chocolate Indulgence";
  const subtitle =
    (dynamicContent?.subtitle as string) ||
    "We roast rare single-origin coffees and hand-temper artisanal cocoa in micro-batches. Crafted for those who appreciate nuanced floral notes, velvety crema, and the ritual of slow brewing.";
  const ctaText =
    (dynamicContent?.cta_text as string) || "Explore Menu & Order";
  const ctaLink = (dynamicContent?.cta_link as string) || "/products";
  const secondaryCtaText =
    (dynamicContent?.secondary_cta_text as string) || "Our Craft Story";
  const secondaryCtaLink =
    (dynamicContent?.secondary_cta_link as string) || "/about";

  return (
    <ScrollVideo
      srcMp4="/videos/CoffePour.mp4"
      poster="/images/hero-poster.jpg"
    >
      <div className="relative min-h-screen flex items-center">
        {/* Ambient Roast Aroma Particles */}
        <AmbientAroma count={10} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full relative z-20">
        {/* Editorial Asymmetric Grid (7/5 split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Roastery Badge with Live Pulse Indicator */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#D4A373]/40 bg-[#2C221E]/70 backdrop-blur-md text-[#D4A373] text-xs font-medium tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-open-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ADE80]" />
              </span>
              <Coffee className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Small-Batch Roastery & Atelier • Dhaka</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FDFBF7] leading-[1.08]">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-[#FDFBF7]/85 font-sans leading-relaxed max-w-xl">
              {subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href={ctaLink}>
                <Button
                  variant="primary"
                  size="lg"
                  className="btn-cup-fill bg-[#D4A373] text-[#1A1613] hover:text-[#1A1613] font-medium tracking-wide border-0 shadow-md inline-flex items-center gap-2 rounded-md h-12 px-7 transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href={secondaryCtaLink}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-[#2C221E]/80 text-[#FDFBF7] hover:bg-[#3A2D26] border border-[#5C4A3D] font-medium tracking-wide rounded-md h-12 px-7 transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>{secondaryCtaText}</span>
                </Button>
              </Link>
            </div>

            {/* Key Roastery Markers */}
            <div className="pt-6 border-t border-[#5C4A3D]/40 grid grid-cols-2 sm:grid-cols-3 gap-6 text-[#FDFBF7]/75">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-[#D4A373] font-medium">
                  Origin Quality
                </p>
                <p className="text-sm font-serif font-bold text-[#FDFBF7]">
                  100% Specialty Arabica
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-[#D4A373] font-medium">
                  Roasting Cycle
                </p>
                <p className="text-sm font-serif font-bold text-[#FDFBF7]">
                  Twice Weekly in Dhaka
                </p>
              </div>

              <div className="space-y-1 col-span-2 sm:col-span-1">
                <p className="text-xs uppercase tracking-wider text-[#D4A373] font-medium">
                  Order Model
                </p>
                <p className="text-sm font-serif font-bold text-[#FDFBF7]">
                  Pickup Daily (8 AM – 10 PM)
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Tasting Notes Card with Floating Animation and Steam Swirl */}
          <div className="lg:col-span-5 lg:pl-6">
            <div className="relative rounded-2xl border border-[#D4A373]/30 bg-[#2C221E]/85 backdrop-blur-md p-7 shadow-2xl space-y-6 animate-float-slow hover:border-[#D4A373]/60 transition-colors">
              {/* Animated Steam rising from top right corner */}
              <div className="absolute -top-7 right-8">
                <SteamSwirl size="md" />
              </div>

              {/* Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A373]/15 text-[#D4A373] text-[11px] font-medium uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Roaster&apos;s Reserve
                </span>
                <span className="text-xs text-[#8A8179] font-sans">
                  Batch No. #2026-08
                </span>
              </div>

              {/* Title & Origin */}
              <div className="space-y-1.5">
                <h2 className="font-serif text-2xl font-bold text-[#FDFBF7]">
                  Ethiopian Yirgacheffe &amp; Truffle
                </h2>
                <p className="text-xs text-[#D4A373] font-sans flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  Gedeo Zone, 1,950m • Natural Process
                </p>
              </div>

              {/* Sensory Notes */}
              <div className="space-y-2 py-3 border-y border-[#5C4A3D]/40">
                <p className="text-[11px] uppercase tracking-wider text-[#8A8179] font-medium">
                  Sensory Flavor Profile
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#1A1613] text-[#FDFBF7] text-xs font-sans border border-[#5C4A3D]/50 hover:border-[#D4A373]/40 transition-colors">
                    Bergamot &amp; Jasmine
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#1A1613] text-[#FDFBF7] text-xs font-sans border border-[#5C4A3D]/50 hover:border-[#D4A373]/40 transition-colors">
                    Candied Peach
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#1A1613] text-[#FDFBF7] text-xs font-sans border border-[#5C4A3D]/50 hover:border-[#D4A373]/40 transition-colors">
                    72% Cocoa Truffle
                  </span>
                </div>
              </div>

              {/* Quick Pricing & Action */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#8A8179]">
                    Pickup Price
                  </p>
                  <p className="text-xl font-bold text-[#D4A373] font-serif">
                    ৳ 320
                  </p>
                </div>
                <Link href="/products">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#D4A373] text-[#D4A373] hover:bg-[#D4A373] hover:text-[#1A1613] rounded-md text-xs font-medium transition-all"
                  >
                    <span>View Coffee Details</span>
                  </Button>
                </Link>
              </div>

              {/* Pickup timing hint */}
              <div className="flex items-center gap-2 text-[11px] text-[#8A8179] pt-2">
                <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>Prepared fresh at our Dhaka counter upon pickup</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </ScrollVideo>
  );
}
