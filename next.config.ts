import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: { typedRoutes: true },
};

export default nextConfig;
