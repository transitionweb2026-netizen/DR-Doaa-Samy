import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the project root explicitly: an unrelated project's lockfile
    // sits one level up (outside this Git repo) and would otherwise
    // confuse Turbopack's automatic workspace-root detection.
    root: path.join(__dirname),
  },
};

export default nextConfig;
