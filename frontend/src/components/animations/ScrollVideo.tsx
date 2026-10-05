"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";

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
  className = "h-[300vh]", // Default to a tall container for scrolling
  children,
}: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Finish the video scrub at 85% of the scroll container,
  // so the last frame stays visible before it scrolls away.
  const rawProgress = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  const scrubProgress = useSpring(rawProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (!videoRef.current || prefersReducedMotion) return;

    const video = videoRef.current;

    const onLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    // In case it's already loaded
    if (video.readyState >= 1) {
      setDuration(video.duration);
    }

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || duration === 0 || !videoRef.current) return;

    const video = videoRef.current;
    let targetTime = 0;
    let isSeeking = false;

    // Bulletproof MP4 scrub logic:
    // We only trigger a new seek if the video is NOT currently seeking.
    // When a seek finishes, we check if the target has moved further and seek again.
    const onSeeked = () => {
      isSeeking = false;
      // If targetTime has drifted away from where we just seeked, trigger another seek immediately
      if (Math.abs(video.currentTime - targetTime) > 0.05) {
        isSeeking = true;
        video.currentTime = targetTime;
      }
    };

    video.addEventListener("seeked", onSeeked);

    const unsubscribe = scrubProgress.on("change", (latest) => {
      targetTime = latest * duration;
      
      // If we aren't currently waiting for a seek to finish, start one
      if (!isSeeking && Math.abs(video.currentTime - targetTime) > 0.05) {
        isSeeking = true;
        video.currentTime = targetTime;
      }
    });

    return () => {
      video.removeEventListener("seeked", onSeeked);
      unsubscribe();
    };
  }, [scrubProgress, duration, prefersReducedMotion]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden will-change-transform z-0">
        {prefersReducedMotion ? (
          <Image
            src={poster}
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
            role="presentation"
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={poster}
            preload="auto"
            muted
            playsInline
            aria-hidden="true"
            role="presentation"
          >
            {srcWebm && <source src={srcWebm} type="video/webm" />}
            {srcMp4 && <source src={srcMp4} type="video/mp4" />}
          </video>
        )}
        
        {/* Cinematic Dark Overlay */}
        <div
          className="absolute inset-0 backdrop-blur-[1px] bg-gradient-to-r from-[#1A1613]/95 via-[#1A1613]/85 to-[#1A1613]/60"
          aria-hidden="true"
        />

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
