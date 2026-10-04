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

/**
 * Atmospheric background video / cinematic image component with strict WCAG 2.2 accessibility.
 * Requirements:
 * - Falls back to still image + CSS motion when no video exists.
 * - Respects prefers-reduced-motion and navigator.connection.saveData / 2G.
 * - IntersectionObserver ensures video only initializes when visible in viewport.
 * - The poster image is the LCP element (no layout shift).
 */
export function VideoBackground({
  src,
  poster,
  posterAlt = "Atmospheric coffee roastery background",
  overlayClassName = "bg-[#1A1613]/70",
  children,
  className,
  priority = false,
}: VideoBackgroundProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);
  const [canPlayVideo, setCanPlayVideo] = React.useState<boolean>(false);
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
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

    if (src && src.trim() !== "") {
      setCanPlayVideo(true);
    }
  }, [src]);

  // 3. IntersectionObserver: only load video when in viewport
  React.useEffect(() => {
    if (!containerRef.current || !canPlayVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (videoRef.current && isPlaying) {
              videoRef.current.play().catch(() => {});
            }
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [canPlayVideo, isPlaying]);

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

  const isVideoActive = canPlayVideo && isVisible && !hasError && src;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden bg-[#1A1613]",
        className
      )}
    >
      {/* High-Res Poster Image with Cinematic CSS Pan motion if video is inactive */}
      <div className={cn("absolute inset-0 overflow-hidden", !isVideoActive && "animate-cinematic-pan")}>
        <Image
          src={poster}
          alt={posterAlt}
          fill
          priority={priority}
          sizes="100vw"
          className={cn(
            "object-cover object-center transition-opacity duration-700",
            isVideoActive && isPlaying ? "opacity-30" : "opacity-85"
          )}
        />
      </div>

      {/* Video Element when supported, in-viewport & enabled */}
      {canPlayVideo && !hasError && src && (
        <video
          ref={videoRef}
          src={isVisible ? src : undefined}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
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
      {isVideoActive && (
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
