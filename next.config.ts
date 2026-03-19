import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Optimize for production
  poweredByHeader: false,
  serverExternalPackages: ['iyzipay'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-5472084cb7c9420b9585dfe5cd760b87.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
