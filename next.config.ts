import path from "node:path";
import type { NextConfig } from "next";

// Derived from the env var (rather than hardcoded) so a different Supabase
// project — a new environment, a project transfer — doesn't need a matching
// code change here too.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the project root explicitly: an unrelated project's lockfile
    // sits one level up (outside this Git repo) and would otherwise
    // confuse Turbopack's automatic workspace-root detection.
    root: path.join(__dirname),
  },
  images: {
    // Every uploaded image/video-thumbnail is served from Supabase Storage
    // — next/image refuses to optimize a remote host it doesn't know about
    // (400 "url parameter is not allowed") unless it's listed here. Without
    // this, no CMS-uploaded image can ever render anywhere on the site.
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https" as const,
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  experimental: {
    serverActions: {
      // Server Actions default to a 1MB request body, which real photos
      // routinely exceed — uploads would silently fail past that (see
      // components/admin/MediaPicker.tsx). 4MB stays safely under Vercel's
      // own ~4.5MB serverless request-body ceiling, so raising this further
      // wouldn't actually help; a file bigger than that needs compressing
      // before upload (or a direct-to-Storage upload path, which is a
      // separate change).
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
