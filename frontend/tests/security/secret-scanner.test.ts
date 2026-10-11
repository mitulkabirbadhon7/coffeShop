import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Phase 13: Secret Scanning & Environment Verification", () => {
  const srcDir = path.resolve(__dirname, "../../src");

  function getFilesRecursively(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...getFilesRecursively(fullPath));
      } else if (
        entry.name.endsWith(".ts") ||
        entry.name.endsWith(".tsx") ||
        entry.name.endsWith(".js") ||
        entry.name.endsWith(".mjs")
      ) {
        files.push(fullPath);
      }
    }
    return files;
  }

  it("verifies no client component imports SUPABASE_SERVICE_ROLE_KEY directly", () => {
    const allFiles = getFilesRecursively(srcDir);

    for (const file of allFiles) {
      const content = fs.readFileSync(file, "utf-8");
      const isClientComponent = content.startsWith('"use client"') || content.startsWith("'use client'");

      if (isClientComponent) {
        expect(content).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
        expect(content).not.toContain("TURNSTILE_SECRET_KEY");
        expect(content).not.toContain("UPSTASH_REDIS_REST_TOKEN");
      }
    }
  });

  it("verifies public environment schema only exposes safe NEXT_PUBLIC_ variables", () => {
    const envFile = path.join(srcDir, "lib/env.ts");
    const content = fs.readFileSync(envFile, "utf-8");

    // Ensure publicEnvSchema does not include any secrets
    expect(content).toContain("const publicEnvSchema = z.object({");
    expect(content).not.toMatch(/publicEnvSchema[\s\S]*SUPABASE_SERVICE_ROLE_KEY:\s*z\.string\(\)\.min/);
    expect(content).not.toMatch(/publicEnvSchema[\s\S]*TURNSTILE_SECRET_KEY:\s*z\.string\(\)\.min/);
    expect(content).not.toMatch(/publicEnvSchema[\s\S]*UPSTASH_REDIS_REST_TOKEN:\s*z\.string\(\)\.min/);
  });

  it("verifies next.config.mjs does not expose server secrets to env object", () => {
    const nextConfigFile = path.resolve(__dirname, "../../next.config.mjs");
    const content = fs.readFileSync(nextConfigFile, "utf-8");

    expect(content).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(content).not.toContain("TURNSTILE_SECRET_KEY");
  });
});
