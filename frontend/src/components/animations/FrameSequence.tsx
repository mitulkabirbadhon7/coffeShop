"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useTransform, useMotionValueEvent, useReducedMotion } from "framer-motion";
import Image from "next/image";

interface FrameSequenceProps {
  folder: string;
  frameCount: number;
  poster: string;
  className?: string;
  scrollTarget?: React.RefObject<HTMLElement>;
  scrollProgress?: import("framer-motion").MotionValue<number>;
}

export function FrameSequence({
  folder,
  frameCount,
  poster,
  className = "",
  scrollTarget,
  scrollProgress: externalScrollProgress,
}: FrameSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const targetFrameRef = useRef<number>(1);
  const currentFrameRef = useRef<number>(1);
  const animFrameIdRef = useRef<number | null>(null);
  const lastRenderedFrameRef = useRef<number>(-1);

  const [isReady, setIsReady] = useState(false);
  const [inView, setInView] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Scroll tracking: internally or from external progress
  const { scrollYProgress: internalScrollProgress } = useScroll({
    target: scrollTarget || containerRef,
    offset: ["start start", "end end"],
  });

  const activeScrollProgress = externalScrollProgress || internalScrollProgress;

  // Map scroll progress (0 to 0.88) to frame index (1 to frameCount).
  // The remaining 0.88 to 1.0 holds the completed frame 120 so the user fully sees the final pour!
  const frameIndex = useTransform(
    activeScrollProgress,
    [0, 0.88, 1],
    [1, frameCount, frameCount]
  );

  // High performance cover drawing onto canvas
  const drawCover = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number) => {
      if (!img.complete || img.naturalWidth === 0) return;

      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = width / height;

      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawWidth = width;
        drawHeight = width / imgRatio;
        offsetY = (height - drawHeight) / 2;
      } else {
        drawHeight = height;
        drawWidth = height * imgRatio;
        offsetX = (width - drawWidth) / 2;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    },
    []
  );

  // Render a specific frame, falling back to nearest loaded frame if needed
  const renderFrame = useCallback(
    (frameNumber: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      let targetImg = imagesRef.current.get(frameNumber);

      // If requested frame isn't loaded yet, search downward for nearest loaded frame
      if (!targetImg || !targetImg.complete) {
        for (let i = frameNumber - 1; i >= 1; i--) {
          const fallback = imagesRef.current.get(i);
          if (fallback && fallback.complete) {
            targetImg = fallback;
            break;
          }
        }
      }

      if (targetImg && targetImg.complete) {
        drawCover(ctx, targetImg, canvas.width, canvas.height);
        lastRenderedFrameRef.current = frameNumber;
      }
    },
    [drawCover]
  );

  // Smooth LERP animation loop: smoothly interpolates currentFrame towards targetFrame
  const startAnimationLoop = useCallback(() => {
    if (animFrameIdRef.current) return;

    const tick = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.02) {
        // Buttery-smooth interpolation factor (0.22 provides snappy yet fluid tracking)
        currentFrameRef.current += diff * 0.22;
        const rounded = Math.round(currentFrameRef.current);
        if (rounded !== lastRenderedFrameRef.current) {
          renderFrame(rounded);
        }
        animFrameIdRef.current = requestAnimationFrame(tick);
      } else {
        currentFrameRef.current = target;
        const rounded = Math.round(target);
        if (rounded !== lastRenderedFrameRef.current) {
          renderFrame(rounded);
        }
        animFrameIdRef.current = null;
      }
    };

    animFrameIdRef.current = requestAnimationFrame(tick);
  }, [renderFrame]);

  // Update target frame when scroll changes (no React re-renders, instant GPU response)
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (prefersReducedMotion) return;
    const clamped = Math.max(1, Math.min(frameCount, latest));
    targetFrameRef.current = clamped;
    startAnimationLoop();
  });

  // Handle canvas sizing and retina scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      // Re-render current frame after resize
      renderFrame(Math.round(currentFrameRef.current));
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => observer.disconnect();
  }, [renderFrame]);

  // Intersection observer to only preload when user approaches the section
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Preload frames in prioritized order (first frames first for instant interactivity)
  useEffect(() => {
    if (!inView || prefersReducedMotion) return;

    let loadedCount = 0;
    const totalToLoad = frameCount;

    // Helper to load a single frame
    const loadFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const paddedIndex = index.toString().padStart(3, "0");
        const img = new window.Image();
        img.src = `/frames/${folder}/frame-${paddedIndex}.jpg`;

        const onFinished = () => {
          imagesRef.current.set(index, img);
          loadedCount++;

          // Once first 10 frames are ready, enable canvas immediately so animation starts without delay
          if (loadedCount >= Math.min(10, totalToLoad * 0.1) && !isReady) {
            setIsReady(true);
            renderFrame(1);
          }
          resolve();
        };

        if (img.complete) {
          onFinished();
        } else {
          img.onload = onFinished;
          img.onerror = onFinished;
        }
      });
    };

    // Load first 15 frames immediately
    const priorityBatch: Promise<void>[] = [];
    for (let i = 1; i <= Math.min(15, totalToLoad); i++) {
      priorityBatch.push(loadFrame(i));
    }

    // Load remaining frames smoothly in chunks
    Promise.all(priorityBatch).then(() => {
      const remaining: number[] = [];
      for (let i = 16; i <= totalToLoad; i++) {
        remaining.push(i);
      }

      // Load in small concurrent chunks to prevent network thread saturation
      const chunkSize = 10;
      const loadChunks = async () => {
        for (let i = 0; i < remaining.length; i += chunkSize) {
          const chunk = remaining.slice(i, i + chunkSize);
          await Promise.all(chunk.map((idx) => loadFrame(idx)));
        }
      };

      loadChunks();
    });

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [inView, frameCount, folder, prefersReducedMotion, isReady, renderFrame]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: "16/9" }}
    >
      {/* High-quality poster backdrop */}
      <Image
        src={poster}
        alt=""
        fill
        className={`object-cover transition-opacity duration-700 pointer-events-none ${
          !isReady || prefersReducedMotion ? "opacity-100" : "opacity-0"
        }`}
        priority
        aria-hidden="true"
        role="presentation"
      />

      {/* GPU-accelerated Canvas for 60/120fps scrubbing */}
      {!prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
