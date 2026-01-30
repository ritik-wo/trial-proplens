/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: { typedRoutes: true, optimizeCss: false },
};

export default nextConfig;
