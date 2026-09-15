"use client";

import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { scaleIn } from "@/components/motion/variants";
import { formatDate } from "@/lib/utils/formatDate";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { getUiStrings } from "@/lib/i18n/ui";
import type { Article } from "@/lib/types/content";

/** Large, dominant, editorial — the primary article, not a generic blog card. */
export function FeaturedArticleSection({ article, onOpen }: { article: Article; onOpen: () => void }) {
  const locale = useLocale();
  const t = getUiStrings(locale);
  return (
    <section aria-labelledby="featured-article-heading" className="relative py-20 sm:py-28">
      <Container>
        <RevealOnScroll variants={scaleIn}>
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            className="group glass-surface relative grid w-full grid-cols-1 overflow-hidden rounded-[32px] text-left lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto">
              <MediaFrame
                image={article.image}
                tone="rose"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,10,9,0)_45%,rgba(18,10,9,0.55)_100%)] lg:bg-[linear-gradient(90deg,transparent_55%,rgba(18,10,9,0.4)_100%)]"
              />
            </div>

            <div className="flex flex-col justify-center gap-4 p-8 sm:p-10 lg:p-12">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-glass-border bg-glass-bg px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">
                {locale === "ar" ? "مقال مميز" : "Featured Article"}
              </span>
              {/* A <button> can't contain heading elements (not phrasing
                  content) — visually identical span, matching
                  ArticleCard/VideoCard's same pattern for interactive card
                  titles. aria-labelledby only needs a matching id, not
                  specifically a heading tag. */}
              <span
                id="featured-article-heading"
                className="text-balance font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-medium leading-[1.12] text-text-primary transition-colors duration-300 group-hover:text-peach-200"
              >
                {article.title}
              </span>
              <p className="text-balance font-body text-base leading-relaxed text-text-secondary">{article.excerpt}</p>

              <div className="flex flex-wrap items-center gap-4 font-body text-xs text-text-muted">
                <span className="rounded-full border border-glass-border bg-glass-bg px-3 py-1 uppercase tracking-[0.12em]">
                  {article.category}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} aria-hidden="true" />
                  {formatDate(article.date, locale)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} aria-hidden="true" />
                  {article.readingTime}
                </span>
              </div>

              <span className="mt-2 inline-flex w-fit items-center gap-2 font-body text-sm font-semibold text-peach-300">
                {t.readArticle}
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                />
              </span>
            </div>
          </button>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
