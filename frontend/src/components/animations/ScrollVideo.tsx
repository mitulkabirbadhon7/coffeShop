"use client";

import { useEffect, useRef } from "react";

interface ScrollVideoProps {
  srcWebm?: string;
  srcMp4?: string;
  poster: string;
  className?: string;
  children?: React.ReactNode;
}

export function ScrollVideo({
  srcWebm,
  srcMp4,
  poster,
  className = "h-[300vh]",
  children,
}: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let rafId: number;
    let currentLerpTime = 0;

    // Force load the video metadata so we have the duration
    video.load();

    const loop = () => {
      if (video.duration) {
        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Total scroll distance available inside this container
        const scrollDistance = rect.height - windowHeight;
        
        // rect.top goes from 0 (start) to negative scrollDistance (end)
        let progress = -rect.top / scrollDistance;
        
        // Clamp between 0 and 1
        progress = Math.max(0, Math.min(1, progress));
        
        // Map [0, 0.9] -> [0, 1] so it finishes slightly before the container unpins
        progress = Math.min(progress / 0.9, 1.0);
        
        const targetTime = progress * video.duration;

        // Linear interpolation (LERP) for buttery smoothness
        currentLerpTime += (targetTime - currentLerpTime) * 0.1;

        // Apply to video if difference is significant enough to warrant a decoder seek
        if (Math.abs(video.currentTime - currentLerpTime) > 0.03) {
          video.currentTime = currentLerpTime;
        }
      }
      
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={poster}
          preload="auto"
          muted
          playsInline
        >
          {srcWebm && <source src={srcWebm} type="video/webm" />}
          {srcMp4 && <source src={srcMp4} type="video/mp4" />}
        </video>
        
        {/* Cinematic Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Sticky Foreground Content */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="pointer-events-auto w-full h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
