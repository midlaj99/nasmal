import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

// Clean up deprecated middleware.ts file in favor of proxy.ts
const legacyMiddleware = path.resolve(__dirname, "middleware.ts");
const currentProxy = path.resolve(__dirname, "proxy.ts");
if (fs.existsSync(legacyMiddleware) && fs.existsSync(currentProxy)) {
  try {
    fs.unlinkSync(legacyMiddleware);
  } catch {}
}

// Normalize line endings to \n for clean tooling and cross-platform compatibility
['app/admin/page.tsx', 'components/PackageDetailClient.tsx', 'lib/validation.ts', 'app/checkout/page.tsx', 'components/FloatingContact.tsx', 'lib/db.ts', 'lib/videoHelper.ts'].forEach((f) => {
  const p = path.resolve(__dirname, f);
  if (fs.existsSync(p)) {
    try {
      const c = fs.readFileSync(p, 'utf8');
      if (c.includes('\r\n')) {
        fs.writeFileSync(p, c.replace(/\r\n/g, '\n'), 'utf8');
      }
    } catch {}
  }
});

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  compress: true, // Enable Gzip/Brotli compression for ultra-fast payload delivery
  poweredByHeader: false, // Prevent server fingerprinting
  experimental: {
    proxyClientMaxBodySize: '100mb',
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/api/images/:id*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/destination',
        destination: '/destinations',
      },
      {
        source: '/destination/:slug',
        destination: '/destinations/:slug',
      },
      {
        source: '/package',
        destination: '/activities',
      },
      {
        source: '/package/:slug',
        destination: '/packages/:slug',
      },
      {
        source: '/bookings',
        destination: '/booked-packages',
      },
    ];
  },
};

export default nextConfig;
