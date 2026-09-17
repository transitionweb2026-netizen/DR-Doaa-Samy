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
      // Media uploads go straight to Supabase Storage from the browser now
      // (lib/admin/uploadMediaDirect.ts), not through a Server Action, so
      // this no longer gates upload size — it's just headroom for other
      // actions' payloads (long rich-text fields, etc.). Server Actions
      // default to 1MB; 4MB stays safely under Vercel's own ~4.5MB
      // serverless request-body ceiling, so raising it further wouldn't
      // actually help.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
