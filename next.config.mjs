/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [25, 50, 75, 80, 88, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'saudagarproperties.com',
      },
      {
        protocol: 'https',
        hostname: 'www.saudagarproperties.com',
      }
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons', 'framer-motion'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ];
  },
  trailingSlash: false,
  async redirects() {
    return [
      // Blog aliases
      {
        source: '/blogs',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blogs/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/post/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/article/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      // Team and clients aliases
      {
        source: '/our-team',
        destination: '/team',
        permanent: true,
      },
      {
        source: '/clients',
        destination: '/about',
        permanent: true,
      },
      // Legacy service/corridor routes to dedicated 1-to-1 destination
      {
        source: '/services/dlf-phase-1',
        destination: '/blog/location/dlf-phase-1',
        permanent: true,
      },
      {
        source: '/services/dlf-phase-2',
        destination: '/blog/location/dlf-phase-2',
        permanent: true,
      },
      {
        source: '/services/dlf-phase-3',
        destination: '/blog/location/dlf-phase-3',
        permanent: true,
      },
      {
        source: '/services/dlf-phase-4',
        destination: '/blog/location/dlf-phase-4',
        permanent: true,
      },
      {
        source: '/services/sushant-lok',
        destination: '/blog/location/sushant-lok-1',
        permanent: true,
      },
      {
        source: '/services/udyog-vihar',
        destination: '/services/industrial',
        permanent: true,
      },
      // Legacy property catalog routes redirected to active counterparts
      {
        source: '/ready-to-move',
        destination: '/properties',
        permanent: true,
      },
      {
        source: '/new-launches',
        destination: '/properties',
        permanent: true,
      },
      {
        source: '/under-construction',
        destination: '/properties',
        permanent: true,
      },
      {
        source: '/developers',
        destination: '/about',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

