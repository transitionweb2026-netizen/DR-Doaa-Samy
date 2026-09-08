import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSectionFields } from "./fields";
import { toImageAsset, type MediaRow } from "./media";
import { localizedHref } from "@/lib/i18n/paths";
import type { Locale } from "./types";
import type { HeroContent } from "@/lib/types/content";

/**
 * Reads a page's Hero content from the CMS, merged over the given local
 * fallback (so any field the admin hasn't set yet keeps its current
 * shipped copy — nothing ever blanks out).
 */
export async function getHeroContent(pageSlug: string, locale: Locale, fallback: HeroContent): Promise<HeroContent> {
  if (!isSupabaseConfigured) return fallback;

  const fields = await getSectionFields(pageSlug, "hero", locale);
  if (!fields) return fallback;

  let portrait = fallback.portrait;
  const portraitMediaId = fields.portrait_media_id;
  if (typeof portraitMediaId === "string" && portraitMediaId) {
    const supabase = await createClient();
    const { data: media } = await supabase
      .from("media")
      .select("id, bucket, storage_path, alt_text, ar_alt_text")
      .eq("id", portraitMediaId)
      .maybeSingle<NonNullable<MediaRow>>();
    if (media) portrait = toImageAsset(media, locale, fallback.portrait.alt);
  }

  return {
    eyebrow: asString(fields.eyebrow, fallback.eyebrow),
    name: asString(fields.name, fallback.name),
    role: asString(fields.role, fallback.role),
    headline: asString(fields.headline, fallback.headline),
    description: asString(fields.description, fallback.description),
    primaryCta: {
      label: asString(fields.primary_cta_label, fallback.primaryCta.label),
      // CMS URL fields are stored once (untranslated), same as nav_items —
      // /ar is applied at read time so the CMS-authored href doesn't
      // silently drop an Arabic visitor back into the English tree.
      href: localizedHref(locale, asString(fields.primary_cta_href, fallback.primaryCta.href)),
    },
    secondaryCta: {
      label: asString(fields.secondary_cta_label, fallback.secondaryCta.label),
      href: localizedHref(locale, asString(fields.secondary_cta_href, fallback.secondaryCta.href)),
    },
    portrait,
  };
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}
