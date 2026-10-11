"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface AmbientAromaProps {
  className?: string;
  count?: number;
}

/**
 * Floating roast aroma particles providing subtle cinematic atmosphere to the hero section.
 * GPU-accelerated: strictly animates transform and opacity.
 * Automatically disabled under prefers-reduced-motion.
 */
export function AmbientAroma({ className, count = 8 }: AmbientAromaProps) {
  // Generate stable deterministic particle positions
  const particles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * 12.5 + 8) % 94}%`,
      bottom: `${(i * 9 + 5) % 40}%`,
      size: i % 2 === 0 ? "w-1.5 h-1.5" : "w-2 h-2",
      delay: `${(i * 0.9) % 5}s`,
      duration: `${6 + (i % 4)}s`,
      opacity: i % 3 === 0 ? "opacity-60" : "opacity-40",
    }));
  }, [count]);

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none overflow-hidden z-10", className)}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            left: p.left,
            bottom: p.bottom,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
          className={cn(
            "absolute rounded-full bg-gradient-to-t from-[#D4A373] to-[#FAEDCD] blur-[0.5px] animate-roast-particle",
            p.size,
            p.opacity
          )}
        />
      ))}
    </div>
  );
}
