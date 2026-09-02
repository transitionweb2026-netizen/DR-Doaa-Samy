import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { toImageAsset, type MediaRow } from "./media";
import type { Locale } from "./types";

/**
 * Reads a page's CMS-managed SEO fields and merges them over the metadata
 * object already hardcoded in that page's `export const metadata` (the
 * fallback keeps every field the admin hasn't set yet, and this remains a
 * no-op entirely until Supabase is configured).
 */
export async function getSeoMetadata(pageSlug: string, locale: Locale, fallback: Metadata): Promise<Metadata> {
  if (!isSupabaseConfigured) return fallback;

  const supabase = await createClient();
  const { data } = await supabase
    .from("seo_meta")
    .select(
      `*, og_image:media!seo_meta_og_image_id_fkey(id, bucket, storage_path, alt_text, ar_alt_text),
       page:pages!inner(slug)`,
    )
    .eq("page.slug", pageSlug)
    .eq("locale", locale)
    .maybeSingle();

  if (!data) return fallback;

  const title = data.seo_title || (typeof fallback.title === "string" ? fallback.title : undefined);
  const description = data.meta_description || fallback.description;
  const ogImage = data.og_image ? toImageAsset(data.og_image as MediaRow, locale, title ?? "") : undefined;

  return {
    ...fallback,
    title: title ?? fallback.title,
    description: description ?? fallback.description,
    alternates: {
      ...fallback.alternates,
      canonical: data.canonical_url || fallback.alternates?.canonical,
    },
    robots: {
      index: data.robots_index ?? true,
      follow: data.robots_follow ?? true,
    },
    keywords: Array.isArray(data.keywords) && data.keywords.length > 0 ? data.keywords : fallback.keywords,
    openGraph: {
      ...fallback.openGraph,
      title: data.og_title || title || fallback.openGraph?.title,
      description: data.og_description || description || fallback.openGraph?.description,
      images: ogImage?.src ? [{ url: ogImage.src }] : undefined,
    },
    twitter: {
      ...fallback.twitter,
      title: data.twitter_title || title || fallback.twitter?.title,
      description: data.twitter_description || description || fallback.twitter?.description,
    },
  };
}
