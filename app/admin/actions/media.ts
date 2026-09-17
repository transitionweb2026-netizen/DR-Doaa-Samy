"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Uploading itself now happens client-side, straight to Storage — see
// lib/admin/uploadMediaDirect.ts — since a Server Action's request body is
// bound by Vercel's own ~4.5MB serverless function limit regardless of
// Next's bodySizeLimit config, which real video files routinely exceed.

export async function updateMediaMeta(
  id: string,
  fields: { altText?: string; arAltText?: string; title?: string; description?: string },
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("media")
    .update({
      alt_text: fields.altText,
      ar_alt_text: fields.arAltText,
      title: fields.title || null,
      description: fields.description || null,
    })
    .eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true as const };
}

export async function deleteMedia(id: string) {
  const supabase = await createClient();
  const { data: row } = await supabase.from("media").select("bucket, storage_path").eq("id", id).maybeSingle();

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) {
    // A row still referenced by a foreign key (image_id, thumbnail_id, ...)
    // fails here with a clear FK-violation message — surfaced as-is so the
    // admin knows to unlink it from that content item first.
    return { ok: false as const, error: error.message };
  }

  if (row) {
    await supabase.storage.from(row.bucket).remove([row.storage_path]);
  }

  revalidatePath("/admin/media");
  revalidatePath("/", "layout");
  return { ok: true as const };
}
