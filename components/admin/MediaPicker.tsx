"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageOff, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { mediaPublicUrl } from "@/lib/cms/media";
import { uploadMedia } from "@/app/admin/actions/media";

// Server Actions cap request bodies at 4MB (see next.config.ts) — checked
// client-side too so an oversized file fails fast with a clear message
// instead of a slow round-trip that ends in a generic server crash.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

type PickerMedia = {
  id: string;
  bucket: string;
  storage_path: string;
  alt_text: string;
  ar_alt_text: string;
  title: string | null;
  mime_type: string | null;
};

export function MediaPicker({
  value,
  onChange,
  label,
}: {
  value: string | null;
  onChange: (mediaId: string | null) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PickerMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [current, setCurrent] = useState<PickerMedia | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    const query = value
      ? supabase
          .from("media")
          .select("id, bucket, storage_path, alt_text, ar_alt_text, title, mime_type")
          .eq("id", value)
          .maybeSingle()
      : Promise.resolve({ data: null });
    query.then(({ data }) => {
      if (!cancelled) setCurrent((data as PickerMedia | null) ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [value]);

  function openPicker() {
    setOpen(true);
    setLoading(true);
    setUploadError(null);
    const supabase = createClient();
    supabase
      .from("media")
      .select("id, bucket, storage_path, alt_text, ar_alt_text, title, mime_type")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems((data as PickerMedia[]) ?? []);
        setLoading(false);
      });
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploadError(null);

    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError(
        `That file is ${(file.size / (1024 * 1024)).toFixed(1)}MB — the limit is 4MB. Try compressing it or exporting a smaller version.`,
      );
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadMedia(formData);
      if (result.ok) {
        onChange(result.id);
        setOpen(false);
      } else {
        setUploadError(result.error);
      }
    } catch {
      setUploadError("Upload failed — check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-[#3a2420]">{label}</span>
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#e7ddd8] bg-[#efe7e3]">
          {current && current.mime_type?.startsWith("image/") ? (
            <Image src={mediaPublicUrl(current)} alt={current.alt_text} fill className="object-cover" sizes="64px" />
          ) : (
            <div className="flex h-full items-center justify-center text-[#ab8f83]">
              <ImageOff size={18} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={openPicker}
            className="rounded-lg border border-[#ddd0ca] px-3 py-1.5 text-xs font-medium text-[#6b4139] transition-colors hover:border-[#d88880] hover:text-[#c9685e]"
          >
            {current ? "Change" : "Choose image"}
          </button>
          {current ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-xs text-[#ab8f83] transition-colors hover:text-[#a3403c]"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div
            className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e7ddd8] px-5 py-4">
              <p className="text-sm font-semibold text-[#3a2420]">Choose an image</p>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-[#ab8f83] hover:text-[#3a2420]">
                <X size={18} />
              </button>
            </div>

            <label className="flex cursor-pointer items-center justify-center gap-2 border-b border-[#e7ddd8] bg-[#faf7f5] px-5 py-3 text-sm text-[#c9685e]">
              <Upload size={15} />
              {uploading ? "Uploading…" : "Upload a new image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => handleUpload(e.target.files)}
              />
            </label>
            {uploadError ? (
              <p className="border-b border-[#e7ddd8] bg-[#fdf1f1] px-5 py-3 text-xs text-[#a3403c]">{uploadError}</p>
            ) : null}

            <div className="grid grid-cols-4 gap-3 overflow-y-auto p-5">
              {loading ? <p className="col-span-4 text-center text-sm text-[#ab8f83]">Loading…</p> : null}
              {!loading && items.length === 0 ? (
                <p className="col-span-4 text-center text-sm text-[#ab8f83]">No images uploaded yet.</p>
              ) : null}
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange(item.id);
                    setCurrent(item);
                    setOpen(false);
                  }}
                  className="relative aspect-square overflow-hidden rounded-lg border border-[#e7ddd8] bg-[#efe7e3] transition-transform hover:scale-[1.03]"
                >
                  {item.mime_type?.startsWith("image/") ? (
                    <Image src={mediaPublicUrl(item)} alt={item.alt_text} fill className="object-cover" sizes="150px" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#ab8f83]">
                      <ImageOff size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
