import * as React from "react";
import Link from "next/link";
import { Coffee, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AmbientAroma } from "@/components/motion/ambient-aroma";
import { getPublishedContent } from "@/lib/data/content.data";
import { HeroSectionWrapper } from "./hero-section-wrapper";

export async function HeroSection() {
  const dynamicContent = await getPublishedContent("hero_section");

  const title =
    (dynamicContent?.title as string) ||
    "Where Artisanal Roast Meets Pure Chocolate Indulgence";
  const subtitle =
    (dynamicContent?.subtitle as string) ||
    "Immerse yourself in small-batch specialty coffee and handcrafted cocoa confections, meticulously brewed in the heart of Dhaka.";
  const ctaText =
    (dynamicContent?.cta_text as string) || "Explore Menu & Order";
  const ctaLink = (dynamicContent?.cta_link as string) || "/products";
  const secondaryCtaText =
    (dynamicContent?.secondary_cta_text as string) || "Our Story";
  const secondaryCtaLink =
    (dynamicContent?.secondary_cta_link as string) || "/about";

  return (
    <HeroSectionWrapper>
      {/* Ambient Roast Aroma Particles */}
      <AmbientAroma count={10} />
        
      {/* Content Block */}
      <div className="space-y-4 sm:space-y-6 lg:space-y-6 text-left w-full pb-16 lg:pb-0">
          
          {/* Roastery Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#D4A373]/40 bg-[#2C221E]/70 backdrop-blur-md text-[#D4A373] text-xs font-medium tracking-[0.15em] uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-open-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ADE80]" />
            </span>
            <Coffee className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>Small-Batch Roastery & Atelier • Dhaka</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FDFBF7] leading-[1.15] drop-shadow-lg">
            {title}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-[#FDFBF7]/90 font-sans leading-relaxed drop-shadow-md line-clamp-3 sm:line-clamp-none">
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link href={ctaLink}>
              <Button
                variant="primary"
                size="lg"
                className="btn-cup-fill bg-[#D4A373] text-[#1A1613] hover:text-[#1A1613] font-medium tracking-wide border-0 shadow-xl inline-flex items-center gap-2 rounded-md h-14 px-8 transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href={secondaryCtaLink}>
              <Button
                variant="secondary"
                size="lg"
                className="bg-transparent text-[#FDFBF7] hover:bg-[#3A2D26] border-2 border-[#5C4A3D] font-medium tracking-wide rounded-md h-14 px-8 transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{secondaryCtaText}</span>
              </Button>
            </Link>
          </div>

          {/* Key Roastery Markers */}
          <div className="pt-4 lg:pt-6 border-t border-[#5C4A3D]/40 grid grid-cols-2 gap-4 lg:gap-6 text-[#FDFBF7]/80">
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#D4A373] font-bold">
                Origin Quality
              </p>
              <p className="text-sm font-sans font-medium text-[#FDFBF7]">
                100% Specialty Arabica
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#D4A373] font-bold">
                Roasting Cycle
              </p>
              <p className="text-sm font-sans font-medium text-[#FDFBF7]">
                Twice Weekly in Dhaka
              </p>
            </div>

            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#D4A373] font-bold">
                Order Model
              </p>
              <p className="text-sm font-sans font-medium text-[#FDFBF7]">
                Pickup Daily (8 AM – 10 PM)
              </p>
            </div>
          </div>
        </div>
    </HeroSectionWrapper>
  );
}
