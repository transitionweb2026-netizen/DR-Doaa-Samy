"use client";

import { Calendar, Clock } from "lucide-react";
import { ModalShell } from "./ModalShell";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { formatDate } from "@/lib/utils/formatDate";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Article } from "@/lib/types/content";

const DISCLAIMER = {
  en: "This article is general educational content and isn't personalized medical advice. For guidance specific to your skin, book a consultation.",
  ar: "هذا المقال محتوى تعليمي عام وليس استشارة طبية شخصية. للحصول على إرشاد يناسب بشرتك، يرجى حجز استشارة.",
};

/**
 * Full article content in a pop-up, matching the standalone /articles/[slug]
 * page's layout and copy verbatim — same title/meta row, cover image, body
 * paragraphs, and disclaimer — so reading in place is identical to reading
 * on the dedicated page (which still exists for direct links and SEO).
 */
export function ArticleModal({ article, onClose }: { article: Article | null; onClose: () => void }) {
  const titleId = "article-modal-title";
  const locale = useLocale();

  return (
    <ModalShell isOpen={Boolean(article)} onClose={onClose} titleId={titleId} tone="blush">
      {article ? (
        <div className="flex flex-col gap-6">
          <MediaFrame image={article.image} tone="peach" priority className="aspect-[16/9] w-full rounded-[20px]" />

          <div>
            <span className="mb-3 flex w-fit items-center rounded-full border border-glass-border bg-glass-bg px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">
              {article.category}
            </span>
            <h2
              id={titleId}
              className="text-balance font-display text-[clamp(1.5rem,3.4vw,2.25rem)] font-medium leading-[1.15] text-text-primary"
            >
              {article.title}
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-5 font-body text-sm text-text-muted">
              <span>{article.author}</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} aria-hidden="true" />
                {formatDate(article.date, locale)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} aria-hidden="true" />
                {article.readingTime}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {article.content.map((paragraph, i) => (
              <p key={i} className="text-balance font-body text-base leading-relaxed text-text-secondary">
                {paragraph}
              </p>
            ))}
          </div>

          <p className="rounded-2xl border border-glass-border bg-glass-bg px-5 py-4 font-body text-xs leading-relaxed text-text-muted">
            {DISCLAIMER[locale]}
          </p>
        </div>
      ) : null}
    </ModalShell>
  );
}
