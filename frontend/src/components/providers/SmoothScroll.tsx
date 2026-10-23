"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { useReducedMotion } from "framer-motion";

interface SmoothScrollProps {
  children: React.ReactNode;
}

function ScrollResetOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();

  React.useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <ScrollResetOnNavigate />
      {children}
    </ReactLenis>
  );
}
