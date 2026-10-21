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

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
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
    unoptimized: true, // Guarantees all images load directly without Vercel Image Optimization proxy failures
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
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
