import { NextResponse } from 'next/server';

/**
 * Enterprise Sliding Window Rate Limiter
 * Protects endpoints from abuse, credential stuffing, scraping, and DoS attacks.
 * Bounded memory with LRU eviction ensures zero memory leaks under high concurrency.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const MAX_RECORDS = 10000;

// Periodic cleanup every 2 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    pruneExpiredRecords();
  }, 120000);
}

function pruneExpiredRecords() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    // Retain only timestamps from the last 10 minutes
    const valid = record.timestamps.filter(t => now - t < 600000);
    if (valid.length === 0) {
      rateLimitStore.delete(key);
    } else {
      record.timestamps = valid;
    }
  }
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

  // Bounded map protection against memory exhaustion
  if (rateLimitStore.size > MAX_RECORDS) {
    pruneExpiredRecords();
    if (rateLimitStore.size > MAX_RECORDS) {
      // Evict oldest entry
      const oldestKey = rateLimitStore.keys().next().value;
      if (oldestKey) rateLimitStore.delete(oldestKey);
    }
  }

  let record = rateLimitStore.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(identifier, record);
  }

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter(t => t > windowStart);

  if (record.timestamps.length >= options.max) {
    const oldest = record.timestamps[0];
    const resetTime = Math.max(1, Math.ceil((oldest + options.windowMs - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      resetTime,
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: options.max - record.timestamps.length,
    resetTime: Math.ceil(options.windowMs / 1000),
  };
}

/**
 * Extracts client IP from standard proxy and CDN headers
 */
export function getClientIp(request: Request): string {
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  const trueClientIp = request.headers.get('true-client-ip');
  if (trueClientIp) return trueClientIp.trim();

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return '127.0.0.1';
}

/**
 * Standard HTTP 429 Rate Limit Response Helper
 */
export function createRateLimitResponse(resetTimeSeconds: number, customMessage?: string): NextResponse {
  return NextResponse.json(
    {
      error: customMessage || 'Too many requests. Please wait before trying again.',
      retryAfter: resetTimeSeconds,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(resetTimeSeconds),
        'X-RateLimit-Reset': String(resetTimeSeconds),
      },
    }
  );
}
