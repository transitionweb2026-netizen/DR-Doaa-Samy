import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { FeaturedArticleSection } from "@/components/sections/articles/FeaturedArticleSection";
import { RelatedArticlesSection } from "@/components/sections/articles/RelatedArticlesSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { articlesHeroContentAr } from "@/data/ar/articles/hero";
import { articleCatalogueAr } from "@/data/ar/articles/catalogue";
import { articlesFinalCtaContentAr } from "@/data/ar/articles/final-cta";
import { getHeroContent } from "@/lib/cms/hero";
import { getFinalCtaContent } from "@/lib/cms/finalCta";
import { getArticleCatalogue } from "@/lib/cms/articles";

export const metadata: Metadata = {
  title: "المقالات",
  description: "مقالات عن طب الجلدية والعناية بالبشرة من د. دعاء سامي — إرشادات عملية وبلغة مبسّطة عن البشرة والشعر والعلاجات التجميلية.",
  alternates: {
    canonical: "/ar/articles",
    languages: { en: "/articles", ar: "/ar/articles" },
  },
  openGraph: {
    title: "المقالات | د. دعاء سامي",
    description: "مقالات عملية وبلغة مبسّطة عن الجلدية والعناية بالبشرة.",
    url: "/ar/articles",
  },
};

const PAGE = "articles";
const locale = "ar" as const;

export default async function ArticlesPageAr() {
  const [hero, published, finalCta] = await Promise.all([
    getHeroContent(PAGE, locale, articlesHeroContentAr),
    getArticleCatalogue(locale, articleCatalogueAr.filter((article) => article.published)),
    getFinalCtaContent(PAGE, locale, articlesFinalCtaContentAr),
  ]);

  const featured = published.find((article) => article.featured) ?? published[0];
  const related = published.filter((article) => article.id !== featured.id).slice(0, 6);

  return (
    <>
      <HeroSection content={hero} id="articles-hero" ariaLabel="المقالات" />

      <FeaturedArticleSection article={featured} />

      <RelatedArticlesSection articles={related} eyebrow="المزيد للقراءة" heading="مقالات ذات صلة" />

      <FinalCTASection content={finalCta} locale="ar" />
    </>
  );
}
