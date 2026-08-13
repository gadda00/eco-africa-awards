/**
 * Rate limiting utility — in-memory, per-IP, sliding window.
 * For production at scale, swap with @upstash/ratelimit + Redis.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

// Cleanup expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitConfig = {
  /** Max requests allowed in the window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
};

export const RATE_LIMITS = {
  // Auth: 5 attempts per 10 minutes per IP (brute-force protection)
  auth: { limit: 5, windowMs: 10 * 60 * 1000 },
  // Public form submissions: 10 per minute per IP
  form: { limit: 10, windowMs: 60 * 1000 },
  // AI endpoints: 5 per minute per IP (token cost protection)
  ai: { limit: 5, windowMs: 60 * 1000 },
  // API read endpoints: 60 per minute per IP
  read: { limit: 60, windowMs: 60 * 1000 },
} as const;

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup();
  const key = identifier;
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    // New window
    const bucket: Bucket = { count: 1, resetAt: now + config.windowMs };
    buckets.set(key, bucket);
    return { ok: true, remaining: config.limit - 1, resetAt: bucket.resetAt };
  }

  // Existing window
  if (existing.count >= config.limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count++;
  return {
    ok: true,
    remaining: config.limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Extract client IP from a NextRequest, accounting for common proxy headers.
 * Falls back to "unknown" if no IP can be determined (typically local dev).
 */
export function getClientIP(req: Request): string {
  const headers = new Headers(req.headers);
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    headers.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

/**
 * Apply rate limiting to a request. Returns null if allowed, or a NextResponse
 * with 429 if the limit is exceeded.
 */
export function applyRateLimit(
  req: Request,
  config: RateLimitConfig,
  identifierSuffix?: string
): null | { status: 429; headers: Record<string, string>; body: { error: string } } {
  const ip = getClientIP(req);
  const id = `${ip}:${identifierSuffix ?? ""}`;
  const result = rateLimit(id, config);

  if (!result.ok) {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
    return {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(config.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
      },
      body: {
        error: `Rate limit exceeded. Try again in ${retryAfter}s.`,
      },
    };
  }

  return null;
}
