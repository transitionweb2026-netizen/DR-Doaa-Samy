import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSectionFields } from "./fields";
import { toImageAsset, type MediaRow } from "./media";
import type { Locale } from "./types";
import type { ImageAsset } from "@/lib/types/content";

export type AboutIntroVideoContent = {
  eyebrow: string;
  heading: string;
  video: ImageAsset & { durationLabel?: string; videoUrl?: string };
};

export async function getAboutIntroVideoContent(
  pageSlug: string,
  locale: Locale,
  fallback: AboutIntroVideoContent,
): Promise<AboutIntroVideoContent> {
  if (!isSupabaseConfigured) return fallback;

  const fields = await getSectionFields(pageSlug, "intro_video", locale);
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
    if (media) video = { ...toImageAsset(media, locale, fallback.video.alt), durationLabel: fallback.video.durationLabel };
  }
  if (typeof fields.video_duration_label === "string" && fields.video_duration_label) {
    video = { ...video, durationLabel: fields.video_duration_label };
  }
  if (typeof fields.video_url === "string" && fields.video_url) {
    video = { ...video, videoUrl: fields.video_url };
  }

  return {
    eyebrow: asString(fields.eyebrow, fallback.eyebrow),
    heading: asString(fields.heading, fallback.heading),
    video,
  };
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}
