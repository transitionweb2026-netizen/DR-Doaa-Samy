"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Trash2, Upload, X } from "lucide-react";
import { updateMediaMeta, deleteMedia } from "@/app/admin/actions/media";
import { uploadMediaDirect } from "@/lib/admin/uploadMediaDirect";
import { mediaPublicUrl } from "@/lib/cms/media";

// Uploads go straight to Storage (not through a Server Action, so Vercel's
// ~4.5MB request-body limit doesn't apply) — verified working with a real
// 45MB file. This ceiling is a generous sanity check, not a platform limit.
const MAX_UPLOAD_BYTES = 60 * 1024 * 1024;

export type MediaLibraryItem = {
  id: string;
  bucket: string;
  storage_path: string;
  mime_type: string | null;
  title: string | null;
  description: string | null;
  alt_text: string;
  ar_alt_text: string;
  created_at: string;
};

export function MediaLibrary({ initialItems }: { initialItems: MediaLibraryItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [selected, setSelected] = useState<MediaLibraryItem | null>(null);
  const [isUploading, startUpload] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    startUpload(async () => {
      for (const file of Array.from(files)) {
        if (file.size > MAX_UPLOAD_BYTES) {
          setError(`"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB — the limit is 60MB.`);
          continue;
        }
        const result = await uploadMediaDirect(file);
        if (!result.ok) {
          setError(result.error);
          continue;
        }
        setItems((prev) => [
          {
            id: result.data.id,
            bucket: "media",
            storage_path: result.data.storagePath,
            mime_type: result.data.mimeType,
            title: null,
            description: null,
            alt_text: "",
            ar_alt_text: "",
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    });
  }

  return (
    <div>
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#ddd0ca] bg-white px-6 py-10 text-center transition-colors hover:border-[#d88880]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <Upload size={22} className="text-[#ab8f83]" />
        <p className="text-sm text-[#6b4139]">
          Drag files here, or{" "}
          <button
            type="button"
            className="font-medium text-[#c9685e] underline underline-offset-2"
            onClick={() => fileInputRef.current?.click()}
          >
            browse
          </button>
        </p>
        <p className="text-xs text-[#ab8f83]">Images, video, PDF — up to 60MB each.</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {isUploading ? <p className="text-xs text-[#c9685e]">Uploading…</p> : null}
        {error ? <p className="text-xs text-[#a3403c]">{error}</p> : null}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) =>
          item.storage_path ? (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="group relative aspect-square overflow-hidden rounded-lg border border-[#e7ddd8] bg-[#efe7e3] text-left"
            >
              {item.mime_type?.startsWith("image/") ? (
                <Image
                  src={mediaPublicUrl(item)}
                  alt={item.alt_text || item.title || ""}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-[#ab8f83]">
                  {item.mime_type ?? "file"}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 truncate bg-black/50 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                {item.title || item.alt_text || "Untitled"}
              </div>
            </button>
          ) : null,
        )}
      </div>

      {selected ? (
        <MediaDetailDrawer item={selected} onClose={() => setSelected(null)} onDeleted={(id) => {
          setItems((prev) => prev.filter((i) => i.id !== id));
          setSelected(null);
        }} />
      ) : null}
    </div>
  );
}

function MediaDetailDrawer({
  item,
  onClose,
  onDeleted,
}: {
  item: MediaLibraryItem;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [altText, setAltText] = useState(item.alt_text);
  const [arAltText, setArAltText] = useState(item.ar_alt_text);
  const [title, setTitle] = useState(item.title ?? "");
  const [description, setDescription] = useState(item.description ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function save() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateMediaMeta(item.id, { altText, arAltText, title, description });
      if (!result.ok) setError(result.error);
      else setSaved(true);
    });
  }

  function remove() {
    if (!window.confirm("Delete this file permanently? This can't be undone.")) return;
    startTransition(async () => {
      const result = await deleteMedia(item.id);
      if (!result.ok) setError(result.error);
      else onDeleted(item.id);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#3a2420]">Edit media</p>
          <button onClick={onClose} aria-label="Close" className="text-[#ab8f83] hover:text-[#3a2420]">
            <X size={18} />
          </button>
        </div>

        {item.mime_type?.startsWith("image/") ? (
          <div className="relative mb-4 aspect-video overflow-hidden rounded-lg border border-[#e7ddd8]">
            <Image src={mediaPublicUrl(item)} alt={altText} fill className="object-contain" sizes="400px" />
          </div>
        ) : null}

        <Field label="Title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Alt text (English)" helpText="Describes the image for screen readers and SEO.">
          <input value={altText} onChange={(e) => setAltText(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Alt text (Arabic)">
          <input
            dir="rtl"
            value={arAltText}
            onChange={(e) => setArAltText(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Description">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} />
        </Field>

        {error ? <p className="mb-3 text-xs text-[#a3403c]">{error}</p> : null}
        {saved ? <p className="mb-3 text-xs text-[#3a7a4f]">Saved.</p> : null}

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={save}
            disabled={isPending}
            className="rounded-lg bg-[#d88880] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c9685e] disabled:opacity-60"
          >
            Save
          </button>
          <button
            onClick={remove}
            disabled={isPending}
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-[#f2c9c9] px-3 py-2 text-sm text-[#a3403c] transition-colors hover:bg-[#fdf1f1] disabled:opacity-60"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#ddd0ca] bg-[#fbfaf9] px-3 py-2 text-sm text-[#3a2420] outline-none transition-colors focus:border-[#d88880] focus:ring-2 focus:ring-[#d88880]/20";

function Field({ label, helpText, children }: { label: string; helpText?: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm font-medium text-[#3a2420]">{label}</span>
      {children}
      {helpText ? <span className="mt-1 block text-xs text-[#ab8f83]">{helpText}</span> : null}
    </label>
  );
}
