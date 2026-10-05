"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useScroll, useTransform, useMotionValueEvent, useReducedMotion } from "framer-motion";
import Image from "next/image";

interface FrameSequenceProps {
  folder: string;
  frameCount: number;
  poster: string;
  className?: string;
}

export function FrameSequence({
  folder,
  frameCount,
  poster,
  className = "",
}: FrameSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [inView, setInView] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Determine if we show poster based on load progress (50% threshold)
  const isLoaded = loadedFrames >= frameCount * 0.5;

  // Use framer-motion useScroll to track the element
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start tracking when top of element hits top of viewport (scroll = 0 for hero)
    // End tracking when bottom of element hits top of viewport (element completely scrolled out)
    offset: ["start start", "end start"],
  });

  // Map scroll progress (0 to 1) to frame index (1 to frameCount)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, frameCount]);

  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (!prefersReducedMotion && isLoaded) {
      setCurrentFrame(Math.round(latest));
    }
  });

  // Intersection observer to only load when nearby
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          // Once in view, we can disconnect if we want to preload all and not worry about out-of-view unloading
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Preload frames when in view
  useEffect(() => {
    if (!inView || prefersReducedMotion) return;

    let loaded = 0;
    const preloadPromises: Promise<void>[] = [];

    for (let i = 1; i <= frameCount; i++) {
      const paddedIndex = i.toString().padStart(3, "0");
      const imgPath = `/frames/${folder}/ezgif-frame-${paddedIndex}.jpg`;

      preloadPromises.push(
        new Promise((resolve) => {
          const img = new window.Image();
          img.src = imgPath;
          img.onload = () => {
            loaded++;
            setLoadedFrames(loaded);
            resolve();
          };
          img.onerror = () => {
            // In case of a missing frame, count it to avoid being stuck
            loaded++;
            setLoadedFrames(loaded);
            resolve();
          };
        })
      );
    }
  }, [inView, frameCount, folder, prefersReducedMotion]);

  const paddedFrame = currentFrame.toString().padStart(3, "0");
  const currentImgSrc = `/frames/${folder}/ezgif-frame-${paddedFrame}.jpg`;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden will-change-transform ${className}`}
      style={{ aspectRatio: "16/9" }}
    >
      {(!isLoaded || prefersReducedMotion) ? (
        <Image
          src={poster}
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden="true"
          role="presentation"
        />
      ) : (
        <img
          src={currentImgSrc}
          alt=""
          className="w-full h-full object-cover transition-opacity duration-500 opacity-100"
          aria-hidden="true"
          role="presentation"
        />
      )}
    </div>
  );
}
