"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/cms/types";

export type SeoMetaInput = {
  seoTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageId: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImageId: string | null;
  keywords: string[];
  jsonLd: string | null; // raw JSON text from the textarea; parsed here, saved as jsonb
};

export async function saveSeoMeta(pageId: string, locale: Locale, input: SeoMetaInput) {
  let jsonLd: unknown = null;
  if (input.jsonLd && input.jsonLd.trim()) {
    try {
      jsonLd = JSON.parse(input.jsonLd);
    } catch {
      return { ok: false as const, error: "JSON-LD isn't valid JSON — fix the syntax or leave it empty." };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.from("seo_meta").upsert(
    {
      page_id: pageId,
      locale,
      seo_title: input.seoTitle,
      meta_description: input.metaDescription,
      canonical_url: input.canonicalUrl,
      robots_index: input.robotsIndex,
      robots_follow: input.robotsFollow,
      og_title: input.ogTitle,
      og_description: input.ogDescription,
      og_image_id: input.ogImageId,
      twitter_title: input.twitterTitle,
      twitter_description: input.twitterDescription,
      twitter_image_id: input.twitterImageId,
      keywords: input.keywords,
      json_ld: jsonLd,
    },
    { onConflict: "page_id,locale" },
  );
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/", "layout");
  return { ok: true as const };
}
