"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { useLocale, localizedHref } from "@/lib/i18n/LocaleContext";
import { getUiStrings } from "@/lib/i18n/ui";
import type { Article } from "@/lib/types/content";

export function ArticleCard({ article }: { article: Article }) {
  const locale = useLocale();
  const t = getUiStrings(locale);
  return (
    <Link
      href={localizedHref(locale, `/articles/${article.slug}`)}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-glass-border transition-transform duration-500 ease-out hover:-translate-y-1.5 focus-visible:-translate-y-1.5"
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
        <MediaFrame
          image={article.image}
          tone="peach"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.16)_50%,transparent_65%)] transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        <span className="absolute start-4 top-4 rounded-full border border-glass-border bg-glass-bg-strong px-3 py-1 font-body text-[11px] font-medium uppercase tracking-[0.12em] text-text-primary backdrop-blur-md">
          {article.category}
        </span>
      </div>

      <div className="glass-surface flex flex-1 flex-col gap-3 rounded-b-[24px] p-5">
        <h3 className="text-balance font-display text-lg font-medium leading-tight text-text-primary transition-colors duration-300 group-hover:text-peach-300">
          {article.title}
        </h3>
        <p className="line-clamp-2 flex-1 font-body text-sm leading-relaxed text-text-secondary">{article.excerpt}</p>
        <div className="mt-1 flex items-center justify-between border-t border-glass-border pt-4">
          <span className="flex items-center gap-1.5 font-body text-xs text-text-muted">
            <Clock size={13} aria-hidden="true" />
            {article.readingTime}
          </span>
          <span className="inline-flex items-center gap-1 font-body text-xs font-semibold text-peach-300">
            {t.readMore}
            <ArrowUpRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
