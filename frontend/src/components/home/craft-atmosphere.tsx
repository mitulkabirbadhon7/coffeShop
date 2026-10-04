import * as React from "react";
import Link from "next/link";
import { Clock, MapPin, Coffee, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoBackground } from "@/components/ui/video-background";

export function CraftAtmosphereSection() {
  return (
    <VideoBackground
      src="/videos/Steam.mp4"
      poster="/images/hero-poster.jpg"
      posterAlt="Warm ambient steam at Chocobliss Roastery"
      overlayClassName="bg-[#1A1613]/85"
      className="py-24 px-4 sm:px-6 lg:px-8 text-[#FDFBF7]"
    >
      <div className="relative max-w-5xl mx-auto text-center space-y-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4A373]/30 bg-[#2C221E]/60 text-[#D4A373] text-xs font-medium tracking-widest uppercase">
          <Coffee className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>The Atelier Experience</span>
        </div>

        <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl italic text-[#FDFBF7] leading-relaxed max-w-3xl mx-auto">
          &ldquo;In a world of automated rush, we built a sanctuary dedicated to
          the patient, aromatic extraction of exceptional coffee.&rdquo;
        </blockquote>

        {/* Roastery Pillars Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#5C4A3D]/40 text-left max-w-4xl mx-auto">
          <div className="p-6 rounded-lg bg-[#2C221E]/80 border border-[#5C4A3D]/30 space-y-2">
            <Clock className="w-5 h-5 text-[#D4A373]" />
            <h3 className="font-serif text-base font-bold text-[#FDFBF7]">
              Open Daily
            </h3>
            <p className="text-xs text-[#FDFBF7]/75 font-sans leading-relaxed">
              Serving handcrafted brews and warm pastries from 8:00 AM to 10:00 PM.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-[#2C221E]/80 border border-[#5C4A3D]/30 space-y-2">
            <ShoppingBag className="w-5 h-5 text-[#D4A373]" />
            <h3 className="font-serif text-base font-bold text-[#FDFBF7]">
              Fresh Counter Pickup
            </h3>
            <p className="text-xs text-[#FDFBF7]/75 font-sans leading-relaxed">
              Order ahead online and collect your fresh extraction hot at our bar.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-[#2C221E]/80 border border-[#5C4A3D]/30 space-y-2">
            <MapPin className="w-5 h-5 text-[#D4A373]" />
            <h3 className="font-serif text-base font-bold text-[#FDFBF7]">
              Dhaka Atelier
            </h3>
            <p className="text-xs text-[#FDFBF7]/75 font-sans leading-relaxed">
              Road 11, Banani, Dhaka. Visit us for sensory cuppings every Saturday.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Link href="/products">
            <Button
              variant="primary"
              size="md"
              className="bg-[#D4A373] text-[#1A1613] hover:bg-[#FAEDCD] font-medium tracking-wide rounded-md h-11 px-7 transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore Seasonal Menu</span>
            </Button>
          </Link>
        </div>
      </div>
    </VideoBackground>
  );
}
