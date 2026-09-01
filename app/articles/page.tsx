import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { FeaturedArticleSection } from "@/components/sections/articles/FeaturedArticleSection";
import { RelatedArticlesSection } from "@/components/sections/articles/RelatedArticlesSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { articlesHeroContent } from "@/data/articles/hero";
import { articleCatalogue } from "@/data/articles/catalogue";
import { articlesFinalCtaContent } from "@/data/articles/final-cta";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Dermatology and skincare articles from Dr. Doaa Samy — practical, plain-language guidance on skin, hair, and aesthetic treatments.",
  alternates: {
    canonical: "/articles",
  },
  openGraph: {
    title: "Articles | Dr. Doaa Samy",
    description: "Practical, plain-language dermatology and skincare articles.",
    url: "/articles",
  },
};

export default function ArticlesPage() {
  const published = articleCatalogue.filter((article) => article.published);
  const featured = published.find((article) => article.featured) ?? published[0];
  const related = published.filter((article) => article.id !== featured.id).slice(0, 6);

  return (
    <>
      <HeroSection content={articlesHeroContent} id="articles-hero" ariaLabel="Articles" />

      <FeaturedArticleSection article={featured} />

      <RelatedArticlesSection articles={related} />

      <FinalCTASection content={articlesFinalCtaContent} />
    </>
  );
}
