import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Disable static optimization for pages using auth
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
