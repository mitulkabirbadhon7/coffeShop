"use client";

import * as React from "react";
import Lottie from "lottie-react";
import coffeeCupAnimation from "@/../public/animations/loading-cup.json";
import { cn } from "@/lib/utils/cn";

interface CoffeeLoaderProps {
  className?: string;
  size?: number;
  label?: string;
}

/**
 * Artisanal coffee cup Lottie loader animation using public/animations/loading-cup.json.
 */
export function CoffeeLoader({
  className,
  size = 120,
  label = "Brewing fresh...",
}: CoffeeLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div style={{ width: size, height: size }}>
        <Lottie
          animationData={coffeeCupAnimation}
          loop={true}
          autoPlay={true}
          rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
        />
      </div>
      {label && (
        <p className="text-xs font-serif text-[#D4A373] tracking-wider animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}
