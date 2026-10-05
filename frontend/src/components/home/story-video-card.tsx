"use client";

import * as React from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StoryVideoCardProps {
  poster: string;
  videoSrc: string;
  autoPlay?: boolean;
  captionTitle?: string;
  captionSubtitle?: string;
}

/**
 * Artisanal automatic looping video card for the roastery showcase.
 * Plays Ingredients.mp4 automatically in a smooth loop (muted, playsInline) with fallback poster.
 * Respects prefers-reduced-motion and provides an accessible toggle control (WCAG 2.2 AA).
 */
export function StoryVideoCard({
  poster,
  videoSrc,
  autoPlay = true,
  captionTitle = "The Atelier • Dhaka",
  captionSubtitle = "Hand-selected ingredients & small-batch discipline",
}: StoryVideoCardProps) {
  const [isPlaying, setIsPlaying] = React.useState<boolean>(autoPlay);
  const [canAnimate, setCanAnimate] = React.useState<boolean>(true);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setCanAnimate(false);
      setIsPlaying(false);
      return;
    }

    if (autoPlay && videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay policy prevented playback until interaction
          setIsPlaying(false);
        });
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {});
    }
  };

  return (
    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#8A8179]/30 shadow-2xl bg-[#1A1613] group">
      {/* High-Resolution Poster Image as LCP and Fallback */}
      <Image
        src={poster}
        alt="Artisan roaster inspecting single-origin ingredients and green coffee beans"
        fill
        sizes="(max-width: 1024px) 100vw, 40vw"
        className={cn(
          "object-cover object-center transition-opacity duration-700",
          isPlaying && isLoaded ? "opacity-0 pointer-events-none" : "opacity-90 group-hover:scale-105"
        )}
      />

      {/* Video Element: Autoplay, Loop, Muted, PlaysInline */}
      {canAnimate && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay={autoPlay}
          loop
          muted
          playsInline
          preload="metadata"
          onPlaying={() => {
            setIsPlaying(true);
            setIsLoaded(true);
          }}
          onPause={() => setIsPlaying(false)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700",
            isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
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
