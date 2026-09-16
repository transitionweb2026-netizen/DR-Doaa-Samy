"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { uploadMedia } from "@/app/admin/actions/media";

// Server Actions cap request bodies at 4MB (see next.config.ts) — video
// files hit this far more often than images, so it's checked client-side
// too for a fast, clear message instead of a failed upload with no
// explanation.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/**
 * A video's `video_url` column stays a plain URL string — same shape as
 * before, still pasteable by hand — but this adds an upload button next to
 * it: pick a file, it uploads to the `media` Storage bucket (via the same
 * uploadMedia action every image field uses) and this fills the URL field
 * with the resulting public Storage URL. No new column, no schema change.
 */
export function VideoUrlField({
  value,
  onChange,
  dir,
}: {
  value: unknown;
  onChange: (v: string) => void;
  dir?: "rtl";
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current = typeof value === "string" ? value : "";

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    setError(null);

    if (file.size > MAX_UPLOAD_BYTES) {
      setError(
        `That file is ${(file.size / (1024 * 1024)).toFixed(1)}MB — the limit is 4MB. A short, compressed clip usually fits; for longer video, paste a hosted link (YouTube, Vimeo, etc.) instead.`,
      );
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadMedia(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onChange(result.url);
    } catch {
      setError("Upload failed — check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          dir={dir}
          type="url"
          value={current}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          className="w-full rounded-lg border border-[#ddd0ca] bg-[#fbfaf9] px-3 py-2 text-sm text-[#3a2420] outline-none transition-colors focus:border-[#d88880] focus:ring-2 focus:ring-[#d88880]/20"
        />
        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-[#ddd0ca] px-3 py-2 text-xs font-medium text-[#6b4139] transition-colors hover:border-[#d88880] hover:text-[#c9685e]">
          <Upload size={14} />
          {uploading ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="video/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleUpload(e.target.files)}
          />
        </label>
      </div>
      {error ? <p className="mt-1 text-xs text-[#a3403c]">{error}</p> : null}
      {current ? (
        <video src={current} controls className="mt-2 max-h-40 w-full rounded-lg bg-black" preload="metadata" />
      ) : null}
    </div>
  );
}
