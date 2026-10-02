import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants/site";
import { getArticleCatalogue } from "@/lib/cms/articles";
import { articleCatalogue } from "@/data/articles/catalogue";
import { articleCatalogueAr } from "@/data/ar/articles/catalogue";

// Bare paths are the Arabic (default) tree; /en/* is the English mirror —
// same convention as lib/i18n/paths.ts's localizedHref.
const STATIC_PATHS = ["", "/about", "/services", "/patients-reviews", "/videos", "/articles", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    const ar = `${base}${path}`;
    const en = `${base}/en${path}`;
    entries.push({ url: ar, alternates: { languages: { ar, en } } });
    entries.push({ url: en, alternates: { languages: { ar, en } } });
  }

  const [articlesAr, articlesEn] = await Promise.all([
    getArticleCatalogue("ar", articleCatalogueAr.filter((a) => a.published)),
    getArticleCatalogue("en", articleCatalogue.filter((a) => a.published)),
  ]);

  // Articles are seeded/authored in matching EN/AR pairs with identical
  // slugs (see scripts/seed.ts) — safe to cross-link by slug here too.
  // Slugs aren't guaranteed URL-safe (some contain spaces/"&") — the
  // article page itself already expects this (it decodeURIComponent()s
  // the route param), so percent-encode here too. Without it, an
  // unescaped "&" also breaks the sitemap's own XML syntax.
  for (const article of articlesAr) {
    const slug = encodeURIComponent(article.slug);
    const ar = `${base}/articles/${slug}`;
    const en = `${base}/en/articles/${slug}`;
    entries.push({ url: ar, lastModified: article.date, alternates: { languages: { ar, en } } });
  }
  for (const article of articlesEn) {
    const slug = encodeURIComponent(article.slug);
    const ar = `${base}/articles/${slug}`;
    const en = `${base}/en/articles/${slug}`;
    entries.push({ url: en, lastModified: article.date, alternates: { languages: { ar, en } } });
  }

  return entries;
}
