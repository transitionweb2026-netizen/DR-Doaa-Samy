import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSectionFields } from "./fields";
import { toImageAsset, type MediaRow } from "./media";
import type { Locale } from "./types";
import type { DoctorIntroContent } from "@/lib/types/content";

export async function getDoctorIntroContent(
  pageSlug: string,
  locale: Locale,
  fallback: DoctorIntroContent,
): Promise<DoctorIntroContent> {
  if (!isSupabaseConfigured) return fallback;

  const fields = await getSectionFields(pageSlug, "doctor_intro", locale);
  if (!fields) return fallback;

  let video = fallback.video;
  const videoMediaId = fields.video_media_id;
  if (typeof videoMediaId === "string" && videoMediaId) {
    const supabase = await createClient();
    const { data: media } = await supabase
      .from("media")
      .select("id, bucket, storage_path, alt_text, ar_alt_text")
      .eq("id", videoMediaId)
      .maybeSingle<NonNullable<MediaRow>>();
    if (media) {
      video = { ...toImageAsset(media, locale, fallback.video.alt), durationLabel: fallback.video.durationLabel };
    }
  }
  if (typeof fields.video_duration_label === "string") {
    video = { ...video, durationLabel: fields.video_duration_label };
  }
  if (typeof fields.video_url === "string" && fields.video_url) {
    video = { ...video, videoUrl: fields.video_url };
  }

  return {
    eyebrow: asString(fields.eyebrow, fallback.eyebrow),
    heading: asString(fields.heading, fallback.heading),
    paragraphs: asStringArray(fields.paragraphs, fallback.paragraphs),
    highlights: asStringArray(fields.highlights, fallback.highlights),
    video,
  };
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value) && value.length > 0 ? (value as string[]) : fallback;
}
