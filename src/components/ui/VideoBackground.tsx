'use client';

import React, { useState, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLazyVideo } from '@/hooks/useLazyVideo';

export interface VideoBackgroundProps {
  srcWebm?: string;
  srcMp4: string;
  poster: string;
  className?: string;
  overlayClassName?: string;
  lazy?: boolean;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  srcWebm,
  srcMp4,
  poster,
  className = '',
  overlayClassName = 'bg-black/40',
  lazy = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [lazyContainerRef, isInView] = useLazyVideo<HTMLDivElement>();

  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldLoadVideo = !lazy || isInView;

  return (
    <div
      ref={lazy ? lazyContainerRef : undefined}
      className={`absolute inset-0 w-full h-full overflow-hidden -z-10 ${className}`}
      aria-hidden="true"
    >
      {/* If prefers-reduced-motion is active or not mounted yet, render static poster for accessibility */}
      {mounted && prefersReducedMotion ? (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          role="presentation"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        shouldLoadVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={poster}
            aria-hidden="true"
            role="presentation"
            className="absolute inset-0 w-full h-full object-cover"
          >
            {srcWebm && <source src={srcWebm} type="video/webm" />}
            <source src={srcMp4} type="video/mp4" />
            <img
              src={poster}
              alt=""
              aria-hidden="true"
              role="presentation"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </video>
        )
      )}

      {/* Atmospheric darkening overlay to guarantee text contrast */}
      {overlayClassName && (
        <div
          className={`absolute inset-0 pointer-events-none ${overlayClassName}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default VideoBackground;
