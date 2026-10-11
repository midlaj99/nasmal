/**
 * In-memory Sliding Window Rate Limiter
 * Protects endpoints from abuse, credential stuffing, and spam attacks.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired records every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      // Keep only timestamps within last 10 minutes
      const validTimestamps = record.timestamps.filter(t => now - t < 600000);
      if (validTimestamps.length === 0) {
        rateLimitStore.delete(key);
      } else {
        record.timestamps = validTimestamps;
      }
    }
  }, 300000);
}

export interface RateLimitOptions {
  windowMs: number; // Window size in milliseconds
  max: number;      // Maximum allowed requests in windowMs
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 60000, max: 60 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  let record = rateLimitStore.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(identifier, record);
  }

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter(t => t > windowStart);

  if (record.timestamps.length >= options.max) {
    const oldest = record.timestamps[0];
    const resetTime = oldest + options.windowMs;
    return {
      allowed: false,
      remaining: 0,
      resetTime: Math.ceil((resetTime - now) / 1000)
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: options.max - record.timestamps.length,
    resetTime: Math.ceil(options.windowMs / 1000)
  };
}

/**
 * Extracts client IP from standard Next.js request headers
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}
