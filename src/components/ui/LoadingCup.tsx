'use client';

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface LoadingCupProps {
  className?: string;
  size?: number;
}

export const LoadingCup: React.FC<LoadingCupProps> = ({
  className = '',
  size = 220,
}) => {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch('/animations/loading-cup.json')
      .then((res) => {
        if (!res.ok) throw new Error('Animation file not found');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setAnimationData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Could not load loading-cup.json, using fallback animation:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Chocobliss Coffee..."
    >
      {animationData ? (
        <div style={{ width: size, height: size }}>
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : (
        /* Graceful fallback while fetching or if custom JSON is pending */
        <div
          className="relative flex items-center justify-center animate-pulse"
          style={{ width: size, height: size }}
        >
          <div className="w-24 h-24 rounded-full border-4 border-coffee-gold/20 border-t-coffee-gold animate-spin" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <svg
              className="w-10 h-10 text-coffee-gold"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
        </div>
      )}
      <p className="mt-4 text-coffee-gold/90 font-serif tracking-wider text-sm animate-pulse">
        BREWING PERFECTION...
      </p>
    </div>
  );
};

export default LoadingCup;
