import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Optimize for production
  poweredByHeader: false,
  serverExternalPackages: ['iyzipay'],
};

export default nextConfig;
