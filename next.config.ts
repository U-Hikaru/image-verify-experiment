import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Helps catch React issues early
  typescript: {
    ignoreBuildErrors: false, // Ensures TypeScript errors fail the build
  },
  eslint: {
    ignoreDuringBuilds: true, // Prevent ESLint warnings from failing the build
  },
  output: "standalone", // Useful for Vercel & Docker deployments
};

export default nextConfig;
