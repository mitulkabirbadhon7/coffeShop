"use client";

import * as React from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StoryVideoCardProps {
  poster?: string;
  videoSrc: string;
  autoPlay?: boolean;
  startTime?: number;
  endTime?: number;
  captionTitle?: string;
  captionSubtitle?: string;
}

/**
 * Artisanal looping video card for the roastery showcase.
 * Plays the finished coffee segment of Ingredients.mp4 (6.0s to 8.0s) in a seamless loop with steam rising.
 * Uses Media Fragment URI (#t=6.0,8.0) combined with seek-guard clamping so the making sequence (falling beans, milk pouring)
 * is completely omitted, showing exclusively the completed handcrafted latte art cup with rising steam.
 * Respects prefers-reduced-motion and provides an accessible toggle control (WCAG 2.2 AA).
 */
export function StoryVideoCard({
  poster = "/posters/finished-cup.jpg",
  videoSrc,
  autoPlay = true,
  startTime = 6.0,
  endTime = 8.0,
  captionTitle = "The Atelier • Dhaka",
  captionSubtitle = "Hand-selected ingredients & small-batch discipline",
}: StoryVideoCardProps) {
  const [isPlaying, setIsPlaying] = React.useState<boolean>(autoPlay);
  const [canAnimate, setCanAnimate] = React.useState<boolean>(true);
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Check prefers-reduced-motion
  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setCanAnimate(false);
      setIsPlaying(false);
    }
  }, []);

  // Initialize playback clamped to [startTime, endTime]
  React.useEffect(() => {
    if (!canAnimate) return;
    const v = videoRef.current;
    if (!v) return;

    const enforceStartTime = () => {
      if (v.currentTime < startTime || v.currentTime >= endTime) {
        v.currentTime = startTime;
      }
    };

    const handleSeeked = () => {
      if (v.currentTime >= startTime - 0.15) {
        setIsReady(true);
      }
    };

    v.addEventListener("loadedmetadata", enforceStartTime);
    v.addEventListener("seeked", handleSeeked);

    if (v.readyState >= 1) {
      enforceStartTime();
    }

    if (autoPlay) {
      v.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Browser autoplay policy caught; user can click to play
          setIsPlaying(false);
        });
    }

    return () => {
      v.removeEventListener("loadedmetadata", enforceStartTime);
      v.removeEventListener("seeked", handleSeeked);
    };
  }, [autoPlay, canAnimate, startTime, endTime]);

  // Keep playback looped strictly within [startTime, endTime]
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;

    // Guard against starting before startTime
    if (v.currentTime < startTime - 0.2) {
      v.currentTime = startTime;
      return;
    }

    // When nearing end of the steam loop, loop back to startTime
    if (v.currentTime >= endTime - 0.08) {
      v.currentTime = startTime;
      if (isPlaying && v.paused) {
        v.play().catch(() => {});
      }
    }

    if (!isReady && v.currentTime >= startTime - 0.1) {
      setIsReady(true);
    }
  };

  const handleEnded = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = startTime;
    if (isPlaying) {
      v.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
    } else {
      if (v.currentTime >= endTime - 0.1 || v.currentTime < startTime) {
        v.currentTime = startTime;
      }
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  // Fragment URI sets native browser media segment start
  const mediaFragmentSrc = `${videoSrc}#t=${startTime},${endTime}`;

  return (
    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#8A8179]/30 shadow-2xl bg-[#1A1613] group">
      {/* High-Resolution Finished Cup Poster as Fallback and LCP */}
      <Image
        src={poster}
        alt="Handcrafted artisanal coffee with delicate steam rising from rosetta latte art"
        fill
        sizes="(max-width: 1024px) 100vw, 40vw"
        priority
        className={cn(
          "object-cover object-center transition-opacity duration-700",
          isPlaying && isReady ? "opacity-0 pointer-events-none" : "opacity-100 group-hover:scale-105"
        )}
      />

      {/* Video Element: Plays ONLY the finished cup segment with rising steam */}
      {canAnimate && (
        <video
          ref={videoRef}
          src={mediaFragmentSrc}
          autoPlay={autoPlay}
          muted
          playsInline
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500",
            isPlaying && isReady ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        />
      )}

      {/* Atmospheric Dark Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#1A1613]/90 via-[#1A1613]/25 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Accessible Video Control Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause roastery video" : "Play roastery video"}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1613]/80 hover:bg-[#2C221E] text-[#D4A373] border border-[#D4A373]/40 backdrop-blur-md text-xs font-medium transition-all shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-[#D4A373]" />
              <span>Play Video</span>
            </>
          )}
        </button>
      </div>

      {/* Roastery Caption */}
      <div className="absolute bottom-6 left-6 right-6 text-[#FDFBF7] z-10 pointer-events-none">
        <p className="text-xs uppercase tracking-widest text-[#D4A373] font-medium">
          {captionTitle}
        </p>
        <p className="font-serif text-lg font-bold">
          {captionSubtitle}
        </p>
      </div>
    </div>
  );
}
