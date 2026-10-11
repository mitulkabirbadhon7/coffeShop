"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Coffee, Play, Pause, Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ScrollVideoCardProps {
  poster: string;
  videoSrc: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Scroll-driven video animation component.
 * As the user scrolls through the section, the video smoothly scrubs its timeline in sync with scroll position.
 * Also provides an interactive play/pause toggle.
 * Respects prefers-reduced-motion by falling back to static high-res poster.
 */
export function ScrollVideoCard({
  poster,
  videoSrc,
  title = "Small-batch drum roasting calibrated twice a week",
  subtitle = "The Atelier • Dhaka",
  className,
}: ScrollVideoCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [scrollProgressVal, setScrollProgressVal] = React.useState<number>(0);
  const shouldReduceMotion = useReducedMotion();

  // Scroll tracking across the container's viewport journey
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax subtle scale & y-offset
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98]);
  const yOffset = useTransform(scrollYProgress, [0, 1], [15, -15]);

  // Scrub video playback based on scroll position when not in manual play mode
  React.useEffect(() => {
    if (shouldReduceMotion) return;

    let rafId: number;
    let lastTime = 0;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrollProgressVal(latest);

      if (isPlaying) return; // don't override manual playback

      const video = videoRef.current;
      if (!video || !video.duration || isNaN(video.duration)) return;

      // Throttle seeking to ~30 FPS to avoid decoder saturation
      const now = performance.now();
      if (now - lastTime < 32) return;
      lastTime = now;

      // Map scroll progress (0..1) to video duration
      // Clamp between 0.05 and 0.95 to avoid edge black frames
      const targetTime = Math.max(0, Math.min(video.duration, latest * video.duration));

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (Math.abs(video.currentTime - targetTime) > 0.05) {
          video.currentTime = targetTime;
        }
      });
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(rafId);
    };
  }, [scrollYProgress, isPlaying, shouldReduceMotion]);

  const toggleManualPlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  return (
    <motion.div
      ref={containerRef}
      style={{
        scale: shouldReduceMotion ? 1 : scale,
        y: shouldReduceMotion ? 0 : yOffset,
      }}
      className={cn(
        "relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#D4A373]/30 shadow-2xl bg-[#1A1613] group",
        className
      )}
    >
      {/* High-Res Poster Fallback */}
      <Image
        src={poster}
        alt={title}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 40vw"
        className={cn(
          "object-cover object-center transition-opacity duration-700",
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-90"
        )}
      />

      {/* Scrubbable Video Element */}
      {!shouldReduceMotion && (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={() => setIsLoaded(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Atmospheric Dark Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#1A1613]/90 via-[#1A1613]/25 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Bar: Scroll Scrub Indicator & Play Toggle */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1613]/80 border border-[#D4A373]/40 backdrop-blur-md text-[11px] font-medium text-[#D4A373] shadow-md">
          <Compass className="w-3.5 h-3.5 animate-spin-slow" />
          <span>{isPlaying ? "Playing Video" : "Scroll To Scrub"}</span>
        </div>

        <button
          type="button"
          onClick={toggleManualPlayback}
          aria-label={isPlaying ? "Pause craft video" : "Play continuous video"}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1613]/80 hover:bg-[#2C221E] text-[#FDFBF7] hover:text-[#D4A373] border border-[#5C4A3D]/50 backdrop-blur-md text-xs font-medium transition-all shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
              <span>Auto-Play</span>
            </>
          )}
        </button>
      </div>

      {/* Scroll Timeline Progress Bar along the bottom card edge */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2C221E]/80 z-20 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#D4A373] to-[#FAEDCD] transition-all duration-75"
          style={{ width: `${Math.round(scrollProgressVal * 100)}%` }}
        />
      </div>

      {/* Bottom Atelier Caption */}
      <div className="absolute bottom-5 left-6 right-6 text-[#FDFBF7] z-10 pointer-events-none space-y-1">
        <p className="text-xs uppercase tracking-widest text-[#D4A373] font-medium flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          <span>{subtitle}</span>
        </p>
        <p className="font-serif text-lg font-bold leading-snug">
          {title}
        </p>
      </div>
    </motion.div>
  );
}
