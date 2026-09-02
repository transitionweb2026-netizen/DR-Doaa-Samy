"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugifyFilename(name: string) {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
  const safeBase = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return ext ? `${safeBase || "file"}.${ext}` : safeBase || "file";
}

export async function uploadMedia(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "No file provided." };
  }

  const altText = String(formData.get("altText") ?? "");
  const arAltText = String(formData.get("arAltText") ?? "");
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = `${crypto.randomUUID()}-${slugifyFilename(file.name)}`;
  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (uploadError) return { ok: false as const, error: uploadError.message };

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
      title: title || null,
      description: description || null,
      alt_text: altText,
      ar_alt_text: arAltText,
      created_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (insertError) {
    await supabase.storage.from("media").remove([path]);
    return { ok: false as const, error: insertError.message };
  }

  revalidatePath("/admin/media");
  return { ok: true as const, id: row.id as string };
}

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
