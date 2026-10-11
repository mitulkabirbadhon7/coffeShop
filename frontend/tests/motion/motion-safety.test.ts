import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Phase 12: Motion, Video & Reduced-Motion Safety", () => {
  const cssPath = path.resolve(__dirname, "../../src/app/globals.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  describe("WCAG 2.2 & Performance Animation Rules", () => {
    it("enforces prefers-reduced-motion block disabling all continuous animations", () => {
      expect(cssContent).toContain("@media (prefers-reduced-motion: reduce)");
      expect(cssContent).toContain("animation-duration: 0.01ms !important;");
      expect(cssContent).toContain(".animate-cinematic-pan");
      expect(cssContent).toContain(".animate-steam-1");
      expect(cssContent).toContain(".animate-float-slow");
      expect(cssContent).toContain("animation: none !important;");
    });

    it("restricts keyframe animations strictly to transform and opacity to prevent CLS", () => {
      // Extract keyframe definitions
      const keyframeRegex = /@keyframes\s+([a-zA-Z0-9_-]+)\s*\{([^}]+(?:\{[^}]+\}[^}]*)*)\}/g;
      const matches = Array.from(cssContent.matchAll(keyframeRegex));

      expect(matches.length).toBeGreaterThanOrEqual(4);

      for (const match of matches) {
        const keyframeBody = match[2];
        // Ensure no layout-shifting properties like width, height, margin, top, left are animated in keyframe steps
        expect(keyframeBody).not.toMatch(/\b(width|height|margin|padding|left|top|right|bottom)\s*:/);
      }
    });

    it("includes will-change: transform for hardware GPU acceleration on cinematic pan and steam", () => {
      expect(cssContent).toContain("will-change: transform;");
      expect(cssContent).toContain("will-change: transform, opacity;");
    });
  });

  describe("VideoBackground and Poster LCP Safety", () => {
    const videoBgPath = path.resolve(__dirname, "../../src/components/ui/video-background.tsx");
    const videoBgContent = fs.readFileSync(videoBgPath, "utf-8");

    it("checks prefers-reduced-motion before enabling background video playback", () => {
      expect(videoBgContent).toContain("prefers-reduced-motion: reduce");
      expect(videoBgContent).toContain("setCanPlayVideo(false)");
    });

    it("checks network saveData and slow connections before enabling background video", () => {
      expect(videoBgContent).toContain("saveData");
      expect(videoBgContent).toContain("slow-2g");
      expect(videoBgContent).toContain("2g");
    });

    it("applies cinematic slow pan to the poster image when video is inactive", () => {
      expect(videoBgContent).toContain("animate-cinematic-pan");
      expect(videoBgContent).toContain("sizes=\"100vw\"");
    });
  });
});
