import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Enterprise Web Application Firewall (WAF) & Global Rate Limiter Middleware
 * Protects Nasmal Tourisms against:
 * 1. SQL Injection (SQLi)
 * 2. NoSQL Injection (NoSQLi)
 * 3. Cross-Site Scripting (XSS)
 * 4. Path Traversal & LFI
 * 5. Remote Code / Command Injection
 * 6. Automated Scanner Bots & Malicious Crawlers
 * 7. DDoS & API Resource Exhaustion
 */

// Sliding window in-memory tracking for Edge Runtime
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();
const MAX_TRACKED_IPS = 10000;

// Malicious attack patterns to detect and block immediately
const ATTACK_PATTERNS = [
  // SQL Injection
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
  /\b(UNION\s+ALL\s+SELECT|UNION\s+SELECT|SELECT\s+.*\s+FROM)\b/i,
  /\b(INSERT\s+INTO|DELETE\s+FROM|DROP\s+TABLE|ALTER\s+TABLE)\b/i,
  // NoSQL Injection
  /\[\$(ne|gt|gte|lt|lte|in|nin|regex|where|or|and)\]/i,
  /\$where/i,
  // Path Traversal
  /(\.\.[\/\\])|(%2e%2e[\/\\])/i,
  /\/etc\/passwd|\/windows\/system32/i,
  // XSS Vectors
  /<script[\s>]/i,
  /javascript:/i,
  /onerror\s*=/i,
  /onload\s*=/i,
  /eval\s*\(/i,
  // Shell / Command Injection
  /(;|\||`|\$\().*(cat\s+|ls\s+|dir\s+|whoami|netstat)/i,
];

// Block automated vulnerability scanner tools
const SCANNER_USER_AGENTS = [
  'sqlmap',
  'nikto',
  'dirbuster',
  'acunetix',
  'wpscan',
  'nmap',
  'masscan',
  'zgrab',
  'gobuster',
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Ultra-fast path for database image delivery: zero overhead, maximum streaming speed
  if (pathname.startsWith('/api/images/')) {
    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return res;
  }

  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

  // 1. Block Automated Vulnerability Scanners
  for (const bot of SCANNER_USER_AGENTS) {
    if (userAgent.includes(bot)) {
      return new NextResponse(
        JSON.stringify({ error: 'Automated vulnerability scanning is strictly prohibited.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 2. Web Attack Pattern Inspection across Query String & Pathname
  const targetUrl = decodeURIComponent(pathname + search).toLowerCase();
  for (const pattern of ATTACK_PATTERNS) {
    if (pattern.test(targetUrl)) {
      return new NextResponse(
        JSON.stringify({ error: 'Malicious request pattern blocked by Security Gateway.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 3. Global API Rate Limiter
  if (pathname.startsWith('/api/')) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfIp = request.headers.get('cf-connecting-ip');
    const clientIp = (cfIp || (forwardedFor ? forwardedFor.split(',')[0].trim() : '') || realIp || '127.0.0.1');

    const now = Date.now();
    const windowMs = 60000; // 1 minute window
    
    // Limits: Sensitive endpoints have tighter limits; general reads have generous limits
    let maxRequestsPerMinute = 240;
    if (pathname.includes('/auth') || pathname.includes('/login') || pathname.includes('/forgot-password')) {
      maxRequestsPerMinute = 25;
    } else if (request.method === 'POST' || request.method === 'PATCH' || request.method === 'DELETE') {
      maxRequestsPerMinute = 60;
    }

    if (ipRequestCounts.size > MAX_TRACKED_IPS) {
      ipRequestCounts.clear();
    }

    const currentRecord = ipRequestCounts.get(clientIp);

    if (!currentRecord || now > currentRecord.resetAt) {
      ipRequestCounts.set(clientIp, { count: 1, resetAt: now + windowMs });
    } else {
      currentRecord.count += 1;
      if (currentRecord.count > maxRequestsPerMinute) {
        const retryAfterSeconds = Math.max(1, Math.ceil((currentRecord.resetAt - now) / 1000));
        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests. Global API rate limit exceeded.',
            retryAfter: retryAfterSeconds,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(retryAfterSeconds),
            },
          }
        );
      }
    }
  }

  // 4. Inject Enterprise Security Headers on all requests
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https:; frame-src 'self' https://www.google.com https://maps.google.com https://*.google.com; child-src 'self' https://www.google.com https://maps.google.com https://*.google.com; frame-ancestors 'self';"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/upload (file uploads stream directly without middleware body cloning)
     * - public files with extensions (.svg, .png, .jpg, .jpeg, .webp, .css, .js)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/upload|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
