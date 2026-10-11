"use client";

import { useRef } from "react";
import { FrameSequence } from "@/components/animations/FrameSequence";

export function ProductsHeroWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="relative h-[200vh] w-full bg-[#1A1613]">
      <div className="sticky top-0 h-[60vh] sm:h-screen w-full overflow-hidden flex items-center">
        <FrameSequence
          folder="ingredients"
          frameCount={120}
          poster="/posters/ingredients.jpg"
          className="absolute inset-0 w-full h-full z-0"
          scrollTarget={containerRef}
        />
        
        {/* Cinematic Dark Overlay */}
        <div className="absolute inset-0 backdrop-blur-[1px] bg-gradient-to-r from-transparent via-[#1A1613]/40 to-[#1A1613]/95 z-0" />
        
        <div className="relative z-10 w-full pointer-events-none">
          <div className="pointer-events-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
