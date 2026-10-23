"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * High-performance luxury top navigation progress indicator.
 * Provides immediate visual feedback when navigating between routes without jarring full-screen spinners.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = React.useState<number>(0);
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // When route changes, complete the progress bar smoothly and fade out
  React.useEffect(() => {
    if (isVisible) {
      setProgress(100);
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(hideTimer);
    }
  }, [pathname, searchParams, isVisible]);

  // Intercept link clicks to start progress immediately
  React.useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Only animate internal cross-page navigations
      const isExternal =
        target.target === "_blank" ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#");

      const isSamePage = href === pathname || href === window.location.pathname;

      if (!isExternal && !isSamePage && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        setIsVisible(true);
        setProgress(25);

        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 85) {
              if (timerRef.current) clearInterval(timerRef.current);
              return prev;
            }
            return prev + Math.random() * 15;
          });
        }, 150);
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pathname]);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[2.5px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#D4A373] via-[#E07A5F] to-[#D4A373] shadow-[0_0_12px_rgba(212,163,115,0.8)] transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "150ms" : "300ms",
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
