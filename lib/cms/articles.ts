import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { toImageAsset, type MediaRow } from "./media";
import type { Locale } from "./types";
import type { Article } from "@/lib/types/content";

function mapArticle(row: Record<string, unknown>, locale: Locale): Article {
  const r = row as {
    id: string;
    slug: string;
    title: string;
    ar_title: string;
    excerpt: string;
    ar_excerpt: string;
    content: string[];
    ar_content: string[];
    image: MediaRow;
    category: string;
    ar_category: string;
    published_date: string;
    reading_time: string;
    ar_reading_time: string;
    author: string;
    ar_author: string;
    is_published: boolean;
    is_featured: boolean;
  };
  return {
    id: r.id,
    slug: r.slug,
    title: locale === "ar" ? r.ar_title || r.title : r.title,
    excerpt: locale === "ar" ? r.ar_excerpt || r.excerpt : r.excerpt,
    content: locale === "ar" && r.ar_content?.length ? r.ar_content : r.content,
    image: toImageAsset(r.image, locale, r.title),
    category: locale === "ar" ? r.ar_category || r.category : r.category,
    date: r.published_date,
    readingTime: locale === "ar" ? r.ar_reading_time || r.reading_time : r.reading_time,
    author: locale === "ar" ? r.ar_author || r.author : r.author,
    seoTitle: locale === "ar" ? r.ar_title || r.title : r.title,
    seoDescription: locale === "ar" ? r.ar_excerpt || r.excerpt : r.excerpt,
    published: r.is_published,
    featured: r.is_featured,
  };
}

const SELECT = "*, image:media!articles_image_id_fkey(id, bucket, storage_path, alt_text, ar_alt_text)";

/** Full published catalogue, ordered newest first. Used with a local fallback by the caller. */
export async function getArticleCatalogue(locale: Locale, fallback: Article[]): Promise<Article[]> {
  if (!isSupabaseConfigured) return fallback;
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(SELECT)
    .eq("is_published", true)
    .order("published_date", { ascending: false });
  if (!data || data.length === 0) return fallback;
  return data.map((row) => mapArticle(row, locale));
}

export async function getArticleBySlug(slug: string, locale: Locale): Promise<Article | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!data) return null;
  return mapArticle(data, locale);
}
