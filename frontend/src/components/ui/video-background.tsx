"use client";

import * as React from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface VideoBackgroundProps {
  src?: string;
  poster: string;
  posterAlt?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
  className?: string;
  priority?: boolean;
}

export function VideoBackground({
  src,
  poster,
  posterAlt = "Atmospheric coffee roastery background",
  overlayClassName = "bg-[#1A1613]/70",
  children,
  className,
  priority = false,
}: VideoBackgroundProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);
  const [canPlayVideo, setCanPlayVideo] = React.useState<boolean>(false);
  const [hasError, setHasError] = React.useState<boolean>(false);

  React.useEffect(() => {
    // 1. Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setCanPlayVideo(false);
      return;
    }

    // 2. Check for slow network connection (Save-Data or 2G)
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    if (nav.connection) {
      if (
        nav.connection.saveData ||
        nav.connection.effectiveType === "slow-2g" ||
        nav.connection.effectiveType === "2g"
      ) {
        setCanPlayVideo(false);
        return;
      }
    }

    if (src) {
      setCanPlayVideo(true);
    }
  }, [src]);

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-[#1A1613]",
        className
      )}
    >
      {/* Fallback & Pre-load Poster Image */}
      <Image
        src={poster}
        alt={posterAlt}
        fill
        priority={priority}
        sizes="100vw"
        className={cn(
          "object-cover object-center transition-opacity duration-700",
          canPlayVideo && !hasError && isPlaying ? "opacity-40" : "opacity-90"
        )}
      />

      {/* Video Element when supported & enabled */}
      {canPlayVideo && !hasError && src && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          onError={() => setHasError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}

      {/* Cinematic Dark Overlay */}
      <div
        className={cn("absolute inset-0 backdrop-blur-[1px]", overlayClassName)}
        aria-hidden="true"
      />

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>

      {/* Accessible Video Control (WCAG 2.2 AA) */}
      {canPlayVideo && !hasError && src && (
        <div className="absolute bottom-4 right-4 z-20">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause background video" : "Play background video"}
            className="p-2 rounded-full bg-[#1A1613]/70 hover:bg-[#2C221E] text-[#D4A373] border border-[#D4A373]/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
