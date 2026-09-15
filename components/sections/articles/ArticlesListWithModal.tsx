"use client";

import { useState } from "react";
import { FeaturedArticleSection } from "./FeaturedArticleSection";
import { RelatedArticlesSection } from "./RelatedArticlesSection";
import { ArticleModal } from "@/components/modals/ArticleModal";
import type { Article } from "@/lib/types/content";

/**
 * Shares one "which article is open" state between the Featured Article
 * card and the Related Articles grid, wherever both (or just the grid)
 * appear — so every "Read More"/"Read Article" click opens the full text
 * in place instead of navigating to the standalone /articles/[slug] page
 * (which still exists for direct links and SEO, just isn't the click
 * target from a listing anymore).
 */
export function ArticlesListWithModal({
  featured,
  related,
  eyebrow,
  heading,
  headingId,
}: {
  featured?: Article;
  related: Article[];
  eyebrow?: string;
  heading?: string;
  headingId?: string;
}) {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  return (
    <>
      {featured ? <FeaturedArticleSection article={featured} onOpen={() => setActiveArticle(featured)} /> : null}

      <RelatedArticlesSection
        articles={related}
        onOpenArticle={setActiveArticle}
        eyebrow={eyebrow}
        heading={heading}
        headingId={headingId}
      />

      <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
    </>
  );
}
