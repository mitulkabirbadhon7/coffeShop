"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { FrameSequence } from "@/components/animations/FrameSequence";

export function RoasteryHero({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <>
      {/* Animation section - 250vh for mobile, 400vh for desktop for smooth slower scroll */}
      <section ref={containerRef} className="relative h-[250vh] md:h-[400vh] w-full bg-[#1A1613]">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
          
          {/* Framed Contained Animation */}
          <div className="w-full max-w-5xl h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#5C4A3D]/40 relative z-10">
            <FrameSequence
              folder="ingredients"
              frameCount={120}
              poster="/posters/ingredients.jpg"
              scrollProgress={scrollYProgress}
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* Content reveals after animation */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="py-20 md:py-32 bg-[#FDFBF7]"
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          {children}
        </div>
      </motion.section>
    </>
  );
}
