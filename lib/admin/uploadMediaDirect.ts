import { createClient } from "@/lib/supabase/client";
import { SUPABASE_URL } from "@/lib/supabase/config";
import { slugifyFilename } from "@/lib/utils/slugify";

export type UploadedMedia = {
  id: string;
  url: string;
  storagePath: string;
  mimeType: string;
};

export type UploadMediaResult = { ok: true; data: UploadedMedia } | { ok: false; error: string };

/**
 * Uploads a file straight from the browser to Supabase Storage, then
 * inserts its `media` row — both authenticated with the same session
 * MediaPicker/MediaLibrary already use for reads, under the existing
 * "media: admins write" RLS policy (identical whether the request comes
 * from a server or the browser, since it's evaluated from the request's
 * JWT either way).
 *
 * This deliberately does NOT go through a Next.js Server Action: those are
 * capped at a request body Vercel's own serverless functions cap at
 * roughly 4.5MB regardless of Next's own bodySizeLimit config, which real
 * video files blow through routinely. Going straight to Storage removes
 * that ceiling entirely — verified with a real 45MB upload.
 */
export async function uploadMediaDirect(file: File): Promise<UploadMediaResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = `${crypto.randomUUID()}-${slugifyFilename(file.name)}`;
  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (uploadError) return { ok: false, error: uploadError.message };

  let width: number | undefined;
  let height: number | undefined;
  if (file.type.startsWith("image/")) {
    try {
      const bitmap = await createImageBitmap(file);
      width = bitmap.width;
      height = bitmap.height;
      bitmap.close();
    } catch {
      // Non-decodable (e.g. SVG) — dimensions stay unset, harmless.
    }
  }

  const { data: row, error: insertError } = await supabase
    .from("media")
    .insert({
      bucket: "media",
      storage_path: path,
      mime_type: file.type || null,
      width,
      height,
      alt_text: "",
      ar_alt_text: "",
      created_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (insertError) {
    await supabase.storage.from("media").remove([path]);
    return { ok: false, error: insertError.message };
  }

  return {
    ok: true,
    data: {
      id: row.id as string,
      url: `${SUPABASE_URL}/storage/v1/object/public/media/${path}`,
      storagePath: path,
      mimeType: file.type || "",
    },
  };
}
