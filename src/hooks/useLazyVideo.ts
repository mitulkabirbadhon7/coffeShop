'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

interface UseLazyVideoOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export function useLazyVideo<T extends HTMLElement = HTMLDivElement>(
  options: UseLazyVideoOptions = { rootMargin: '120px', threshold: 0.15 }
): [RefObject<T>, boolean] {
  const containerRef = useRef<T>(null);
  const [isInView, setIsInView] = useState<boolean>(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options.rootMargin, options.threshold]);

  return [containerRef, isInView];
}
