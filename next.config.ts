import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* output: 'export', - Disabled to support Server Actions */
  /* distDir: 'dist', */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
