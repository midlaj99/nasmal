import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
