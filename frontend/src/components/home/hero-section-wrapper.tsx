"use client";

import { useRef } from "react";
import { FrameSequence } from "@/components/animations/FrameSequence";

export function HeroSectionWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="relative h-auto lg:h-[400vh] w-full bg-[#1A1613]">
      <div className="lg:sticky lg:top-0 h-auto lg:h-[100dvh] w-full overflow-hidden flex items-center justify-center pt-24 pb-16 lg:py-0">
        
        {/* Modern Split Layout Container */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Left: Contained Animation (Small & High Quality) */}
          <div className="w-full lg:w-1/2 h-[40vh] sm:h-[50vh] lg:h-[70vh] rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#5C4A3D]/40 relative flex-shrink-0 z-10 order-first lg:order-none">
            <FrameSequence
              folder="coffee-pour"
              frameCount={120}
              poster="/posters/coffee-pour.jpg"
              className="absolute inset-0 w-full h-full object-cover"
              scrollTarget={containerRef}
            />
          </div>
          
          {/* Right: Typography & Content */}
          <div className="w-full lg:w-1/2 relative z-20">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}
