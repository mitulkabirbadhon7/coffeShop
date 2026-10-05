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
      {/* Animation section - 150vh for mobile to reduce fatigue, 200vh for desktop */}
      <section ref={containerRef} className="relative h-[150vh] md:h-[200vh] w-full bg-[#1A1613]">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          <FrameSequence
            folder="ingredients"
            frameCount={120}
            poster="/posters/ingredients.jpg"
            scrollProgress={scrollYProgress}
            className="w-full h-full object-cover"
          />
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
