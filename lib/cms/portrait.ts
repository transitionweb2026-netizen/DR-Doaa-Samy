import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSectionFields } from "./fields";
import { toImageAsset, type MediaRow } from "./media";
import type { Locale } from "./types";
import type { ImageAsset } from "@/lib/types/content";

/**
 * Reads the single `portrait_media_id` image field shared by the "Why Dr.
 * Doaa" (Home) and "Doctor's Message" (About) sections — both render the
 * same WhyDoctorPortrait component. Mirrors getHeroContent's portrait
 * resolution in lib/cms/hero.ts.
 */
export async function getPortraitImage(
  pageSlug: string,
  sectionKey: string,
  locale: Locale,
  fallback: ImageAsset,
): Promise<ImageAsset> {
  if (!isSupabaseConfigured) return fallback;

  const fields = await getSectionFields(pageSlug, sectionKey, locale);
  if (!fields) return fallback;

  const portraitMediaId = fields.portrait_media_id;
  if (typeof portraitMediaId === "string" && portraitMediaId) {
    const supabase = await createClient();
    const { data: media } = await supabase
      .from("media")
      .select("id, bucket, storage_path, alt_text, ar_alt_text")
      .eq("id", portraitMediaId)
      .maybeSingle<NonNullable<MediaRow>>();
    if (media) return toImageAsset(media, locale, fallback.alt);
  }

  return fallback;
}
