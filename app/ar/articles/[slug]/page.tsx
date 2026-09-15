import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { fadeUp, imageReveal } from "@/components/motion/variants";
import { ArticlesListWithModal } from "@/components/sections/articles/ArticlesListWithModal";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { articleCatalogueAr } from "@/data/ar/articles/catalogue";
import { articlesFinalCtaContentAr } from "@/data/ar/articles/final-cta";
import { formatDate } from "@/lib/utils/formatDate";
import { getArticleBySlug, getArticleCatalogue } from "@/lib/cms/articles";
import { getFinalCtaContent } from "@/lib/cms/finalCta";

const locale = "ar" as const;

type ArticlePageParams = { slug: string };

export function generateStaticParams() {
  return articleCatalogueAr.filter((article) => article.published).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ArticlePageParams>;
}): Promise<Metadata> {
  // Next doesn't decode dynamic-segment params for us — a slug containing
  // characters that need percent-encoding (spaces, etc.) arrives still
  // encoded, and would never match a plain-text stored slug without this.
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const localFallback = articleCatalogueAr.find((a) => a.slug === slug && a.published) ?? null;
  const article = (await getArticleBySlug(slug, locale)) ?? localFallback;
  if (!article) return {};

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: {
      canonical: `/ar/articles/${article.slug}`,
      languages: { en: `/articles/${article.slug}`, ar: `/ar/articles/${article.slug}` },
    },
    openGraph: {
      type: "article",
      title: article.seoTitle,
      description: article.seoDescription,
      url: `/ar/articles/${article.slug}`,
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePageAr({ params }: { params: Promise<ArticlePageParams> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const localFallback = articleCatalogueAr.find((a) => a.slug === slug && a.published) ?? null;
  const article = (await getArticleBySlug(slug, locale)) ?? localFallback;
  if (!article) notFound();

  const [allPublished, finalCta] = await Promise.all([
    getArticleCatalogue(locale, articleCatalogueAr.filter((a) => a.published)),
    getFinalCtaContent("articles", locale, articlesFinalCtaContentAr),
  ]);
  const related = allPublished.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <>
      <article className="relative pb-8 pt-32 sm:pt-40">
        <Container className="max-w-3xl">
          <RevealOnScroll variants={fadeUp}>
            <Link
              href="/ar/articles"
              className="mb-8 flex w-fit items-center gap-2 font-body text-sm text-text-muted transition-colors hover:text-peach-300"
            >
              <ArrowRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
              العودة إلى المقالات
            </Link>

            <span className="mb-4 flex w-fit items-center rounded-full border border-glass-border bg-glass-bg px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">
              {article.category}
            </span>

            <h1 className="text-balance font-display text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.1] text-text-primary">
              {article.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-5 font-body text-sm text-text-muted">
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
          </RevealOnScroll>
        </Container>

        <RevealOnScroll variants={imageReveal} className="mt-10">
          <Container className="max-w-4xl">
            <MediaFrame image={article.image} tone="peach" priority className="aspect-[16/9] w-full rounded-[28px]" />
          </Container>
        </RevealOnScroll>

        <Container className="max-w-3xl">
          <RevealOnScroll variants={fadeUp} className="mt-10 flex flex-col gap-5">
            {article.content.map((paragraph, i) => (
              <p key={i} className="text-balance font-body text-base leading-relaxed text-text-secondary">
                {paragraph}
              </p>
            ))}
          </RevealOnScroll>

          <p className="mt-10 rounded-2xl border border-glass-border bg-glass-bg px-5 py-4 font-body text-xs leading-relaxed text-text-muted">
            هذا المقال محتوى تعليمي عام وليس استشارة طبية شخصية. للحصول على إرشاد يناسب بشرتك، يرجى حجز استشارة.
          </p>
        </Container>
      </article>

      {related.length ? (
        <ArticlesListWithModal
          related={related}
          eyebrow="تابعي القراءة"
          heading="مقالات أخرى"
          headingId="more-articles-heading"
        />
      ) : null}

      <FinalCTASection content={finalCta} locale="ar" />
    </>
  );
}
