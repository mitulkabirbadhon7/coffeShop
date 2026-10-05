import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Phase 14: Performance & Media Optimization", () => {
  const nextConfigPath = path.resolve(__dirname, "../../next.config.mjs");
  const videoBgPath = path.resolve(__dirname, "../../src/components/ui/video-background.tsx");
  const storyVideoPath = path.resolve(__dirname, "../../src/components/home/story-video-card.tsx");

  it("verifies next.config.mjs enables AVIF and WebP modern image formats", () => {
    const config = fs.readFileSync(nextConfigPath, "utf-8");

    expect(config).toContain("'image/avif'");
    expect(config).toContain("'image/webp'");
    expect(config).toContain("deviceSizes");
    expect(config).toContain("imageSizes");
    expect(config).toContain("remotePatterns");
  });

  it("verifies VideoBackground implements IntersectionObserver and non-blocking preload", () => {
    const code = fs.readFileSync(videoBgPath, "utf-8");

    expect(code).toContain("IntersectionObserver");
    expect(code).toContain('preload="none"');
    expect(code).toContain("playsInline");
    expect(code).toContain("muted");
  });

  it("verifies StoryVideoCard supports metadata preload and muted automatic looping", () => {
    const code = fs.readFileSync(storyVideoPath, "utf-8");

    expect(code).toContain('preload="metadata"');
    expect(code).toContain("playsInline");
    expect(code).toContain("muted");
    expect(code).toContain("loop");
  });
});
