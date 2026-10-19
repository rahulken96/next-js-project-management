import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Untuk Docker Multi-Stage agar bundle ramping
};

export default nextConfig;
