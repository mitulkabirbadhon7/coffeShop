import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitTier = "auth" | "publicMutation" | "order" | "admin" | "api";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in ms
}

interface InMemoBucket {
  timestamps: number[];
}

// In-memory sliding window fallback store for offline/testing/dev environments
const inMemoryStore = new Map<string, InMemoBucket>();

// Tier configs: [maxRequests, windowDurationInSeconds]
const TIER_CONFIGS: Record<RateLimitTier, { max: number; windowSec: number }> = {
  auth: { max: 5, windowSec: 15 * 60 }, // 5 reqs per 15 min
  publicMutation: { max: 10, windowSec: 10 * 60 }, // 10 reqs per 10 min
  order: { max: 5, windowSec: 5 * 60 }, // 5 orders per 5 min
  admin: { max: 60, windowSec: 60 }, // 60 reqs per min
  api: { max: 30, windowSec: 60 }, // 30 reqs per min
};

let upstashRedisClient: Redis | null = null;
const upstashLimiters = new Map<RateLimitTier, Ratelimit>();

function getUpstashClient(): Redis | null {
  // During unit tests, use deterministic local in-memory sliding window
  if (process.env.NODE_ENV === "test" && !process.env.TEST_USE_UPSTASH) {
    return null;
  }

  if (upstashRedisClient) return upstashRedisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token && url.startsWith("https://")) {
    try {
      upstashRedisClient = new Redis({
        url,
        token,
      });
      return upstashRedisClient;
    } catch (err) {
      console.warn("Failed to initialize Upstash Redis, using in-memory rate limiter:", err);
      return null;
    }
  }

  return null;
}

function getUpstashLimiter(tier: RateLimitTier): Ratelimit | null {
  const redis = getUpstashClient();
  if (!redis) return null;

  if (upstashLimiters.has(tier)) {
    return upstashLimiters.get(tier)!;
  }

  const config = TIER_CONFIGS[tier];
  const windowStr = `${config.windowSec} s` as `${number} s`;

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.max, windowStr),
    analytics: false,
    prefix: `chocobliss:rl:${tier}`,
  });

  upstashLimiters.set(tier, limiter);
  return limiter;
}

/**
 * In-memory sliding window fallback
 */
function checkInMemoryRateLimit(tier: RateLimitTier, identifier: string): RateLimitResult {
  const now = Date.now();
  const config = TIER_CONFIGS[tier];
  const windowMs = config.windowSec * 1000;
  const key = `${tier}:${identifier}`;

  let bucket = inMemoryStore.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    inMemoryStore.set(key, bucket);
  }

  // Filter timestamps within current window
  const validTimestamps = bucket.timestamps.filter((ts) => now - ts < windowMs);
  const remaining = Math.max(0, config.max - validTimestamps.length);
  const reset = validTimestamps.length > 0 ? validTimestamps[0] + windowMs : now + windowMs;

  if (validTimestamps.length >= config.max) {
    bucket.timestamps = validTimestamps;
    return {
      success: false,
      limit: config.max,
      remaining: 0,
      reset,
    };
  }

  validTimestamps.push(now);
  bucket.timestamps = validTimestamps;

  return {
    success: true,
    limit: config.max,
    remaining: remaining - 1,
    reset,
  };
}

/**
 * Checks rate limit for a specific tier and identifier (IP, user ID, email).
 * Uses Upstash Redis when configured, with seamless in-memory sliding window fallback.
 */
export async function checkRateLimit(
  tier: RateLimitTier,
  identifier: string
): Promise<RateLimitResult> {
  const cleanId = identifier.trim() || "anonymous";
  const upstashLimiter = getUpstashLimiter(tier);

  if (upstashLimiter) {
    try {
      const result = await upstashLimiter.limit(cleanId);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    } catch (error) {
      console.warn(`Upstash rate limit check failed for ${tier}:${cleanId}, falling back to memory:`, error);
      return checkInMemoryRateLimit(tier, cleanId);
    }
  }

  return checkInMemoryRateLimit(tier, cleanId);
}

/**
 * Utility to extract client IP from Next.js request headers.
 * Safely evaluates x-forwarded-for, cf-connecting-ip, and x-real-ip.
 */
export function getClientIp(
  headers: Headers | Record<string, string | string[] | undefined>
): string {
  const getHeader = (key: string): string | null => {
    if (typeof (headers as Headers).get === "function") {
      return (headers as Headers).get(key);
    }
    const val = (headers as Record<string, string | string[] | undefined>)[key];
    if (Array.isArray(val)) return val[0] || null;
    return val || null;
  };

  const forwardedFor = getHeader("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp && isValidIp(firstIp)) {
      return firstIp;
    }
  }

  const cfConnectingIp = getHeader("cf-connecting-ip");
  if (cfConnectingIp && isValidIp(cfConnectingIp.trim())) {
    return cfConnectingIp.trim();
  }

  const realIp = getHeader("x-real-ip");
  if (realIp && isValidIp(realIp.trim())) {
    return realIp.trim();
  }

  return "127.0.0.1";
}

function isValidIp(ip: string): boolean {
  // Matches standard IPv4 and IPv6 strings
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6 = /^[0-9a-fA-F:]+$/;
  return ipv4.test(ip) || ipv6.test(ip);
}

/**
 * Resets in-memory rate limits (primarily for testing suites)
 */
export function resetInMemoryRateLimits(): void {
  inMemoryStore.clear();
}
