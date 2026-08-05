import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /**
   * `next dev` and `next build` both write to `.next`, so building while a dev
   * server is running corrupts its cache — every route then fails with
   * "Internal Server Error" or "Cannot find module './1234.js'".
   *
   * Set NEXT_DIST_DIR to build into a separate folder and leave the running dev
   * server alone:  NEXT_DIST_DIR=.next-verify npm run build
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
