import { SUPABASE_URL } from "@/lib/supabase/config";
import type { Locale } from "./types";
import type { ImageAsset } from "@/lib/types/content";

export type MediaRow = {
  id: string;
  bucket: string;
  storage_path: string;
  alt_text: string;
  ar_alt_text: string;
} | null;

/** Builds the public Storage URL for a media row's file. */
export function mediaPublicUrl(row: NonNullable<MediaRow>): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${row.bucket}/${row.storage_path}`;
}

/** Maps a joined `media` row (or null) to the frontend's ImageAsset shape. */
export function toImageAsset(row: MediaRow, locale: Locale, fallbackAlt: string): ImageAsset {
  if (!row) return { alt: fallbackAlt };
  const alt = (locale === "ar" ? row.ar_alt_text : row.alt_text) || fallbackAlt;
  return { src: mediaPublicUrl(row), alt };
}
