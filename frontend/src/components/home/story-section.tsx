import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Coffee, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { getPublishedContent } from "@/lib/data/content.data";

export async function StorySection() {
  const dynamicContent = await getPublishedContent("story_section");

  const heading =
    (dynamicContent?.heading as string) ||
    "Coffee as an Art Form, Not a Rushed Commodity";
  const subheading =
    (dynamicContent?.subheading as string) || "Our Roastery Philosophy";
  const body =
    (dynamicContent?.body as string) ||
    "Founded on the belief that extraordinary coffee begins long before the water touches the grounds. We partner with smallholder cooperatives across high-altitude terroirs to bring micro-lot green beans to our Dhaka roastery.";

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#F4F1EA] text-[#2C221E] border-t border-[#8A8179]/15">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Asymmetric Left Image Showcase (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-[#8A8179]/30 shadow-md">
              <Image
                src="/images/story-craft.jpg"
                alt="Artisan roaster inspecting single-origin green coffee beans"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#1A1613]/80 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-6 left-6 right-6 text-[#FDFBF7]">
                <p className="text-xs uppercase tracking-widest text-[#D4A373] font-medium">
                  The Atelier • Dhaka
                </p>
                <p className="font-serif text-lg font-bold">
                  Small-batch drum roasting calibrated twice a week
                </p>
              </div>
            </div>

            {/* Decorative Offset Badge */}
            <div className="hidden sm:flex absolute -bottom-5 -right-5 p-4 rounded-lg bg-[#2C221E] text-[#FDFBF7] shadow-lg border border-[#D4A373]/30 items-center gap-3">
              <Coffee className="w-6 h-6 text-[#D4A373] shrink-0" />
              <div>
                <p className="font-serif text-sm font-bold">88+ SCA Score</p>
                <p className="text-[11px] text-[#8A8179]">Specialty Grade Only</p>
              </div>
            </div>
          </div>

          {/* Asymmetric Right Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAEDCD] text-[#5C4A3D] text-xs font-medium tracking-widest uppercase">
                <HeartHandshake className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>{subheading}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2C221E] leading-[1.12]">
                {heading}
              </h2>
            </div>

            <p className="text-base text-[#5C4A3D] font-sans leading-relaxed">
              {body}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-lg border border-[#8A8179]/20 bg-[#FDFBF7] space-y-2">
                <Coffee className="w-5 h-5 text-[#E07A5F]" />
                <h3 className="font-serif text-base font-bold text-[#2C221E]">
                  Single-Origin Direct Trade
                </h3>
                <p className="text-xs text-[#5C4A3D] leading-relaxed">
                  Transparent farm partnerships with 100% traceable origins and living wages for pickers.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-[#8A8179]/20 bg-[#FDFBF7] space-y-2">
                <ShieldCheck className="w-5 h-5 text-[#D4A373]" />
                <h3 className="font-serif text-base font-bold text-[#2C221E]">
                  Pure Bean-to-Bar Cocoa
                </h3>
                <p className="text-xs text-[#5C4A3D] leading-relaxed">
                  We hand-temper unadulterated cocoa nibs to blend harmoniously with espresso crema.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/about">
                <Button
                  variant="outline"
                  size="md"
                  className="border-[#2C221E] text-[#2C221E] hover:bg-[#2C221E] hover:text-[#FDFBF7] rounded-md font-medium inline-flex items-center gap-2 h-11 px-6"
                >
                  <span>Read The Full Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
