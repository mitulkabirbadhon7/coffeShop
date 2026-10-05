"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";

interface ScrollVideoProps {
  srcWebm?: string;
  srcMp4?: string;
  poster: string;
  className?: string;
}

export function ScrollVideo({
  srcWebm,
  srcMp4,
  poster,
  className = "",
}: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
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

    let rafId: number;
    let targetTime = 0;

    const updateVideoTime = () => {
      if (videoRef.current && typeof videoRef.current.currentTime !== 'undefined') {
        videoRef.current.currentTime = targetTime;
      }
      rafId = requestAnimationFrame(updateVideoTime);
    };

    rafId = requestAnimationFrame(updateVideoTime);

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      targetTime = latest * duration;
    });

    return () => {
      cancelAnimationFrame(rafId);
      unsubscribe();
    };
  }, [scrollYProgress, duration, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden will-change-transform ${className}`}
    >
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
          // We explicitly do NOT include autoplay, and ensure it's paused.
        >
          {srcWebm && <source src={srcWebm} type="video/webm" />}
          {srcMp4 && <source src={srcMp4} type="video/mp4" />}
        </video>
      )}
    </div>
  );
}
