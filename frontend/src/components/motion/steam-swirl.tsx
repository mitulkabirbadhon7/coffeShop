"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface SteamSwirlProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Artisanal steam swirl animation rising gracefully from a coffee cup or signature badge.
 * Animates strictly on `transform` and `opacity` (CLS safe, GPU accelerated).
 * Completely static if `prefers-reduced-motion` is enabled.
 */
export function SteamSwirl({ className, size = "md" }: SteamSwirlProps) {
  const sizeClasses = {
    sm: "w-5 h-7",
    md: "w-7 h-10",
    lg: "w-10 h-14",
  }[size];

  return (
    <div
      className={cn("relative pointer-events-none select-none overflow-visible", sizeClasses, className)}
      aria-hidden="true"
    >
      {/* Wisp 1: Left swirl */}
      <svg
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full text-[#D4A373]/70 animate-steam-1"
      >
        <path
          d="M10 32C8 26 14 20 11 14C8 8 13 4 11 2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      {/* Wisp 2: Center higher swirl */}
      <svg
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full text-[#FAEDCD]/80 animate-steam-2"
      >
        <path
          d="M13 34C15 28 9 22 13 16C17 10 11 4 14 1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>

      {/* Wisp 3: Right delicate swirl */}
      <svg
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full text-[#E07A5F]/60 animate-steam-3"
      >
        <path
          d="M16 33C14 27 18 21 15 15C12 9 16 5 13 3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
