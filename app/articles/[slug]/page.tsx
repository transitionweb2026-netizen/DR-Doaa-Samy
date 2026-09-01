import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { fadeUp, imageReveal } from "@/components/motion/variants";
import { RelatedArticlesSection } from "@/components/sections/articles/RelatedArticlesSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { articleCatalogue } from "@/data/articles/catalogue";
import { articlesFinalCtaContent } from "@/data/articles/final-cta";
import { formatDate } from "@/lib/utils/formatDate";

type ArticlePageParams = { slug: string };

export function generateStaticParams() {
  return articleCatalogue.filter((article) => article.published).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ArticlePageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articleCatalogue.find((a) => a.slug === slug && a.published);
  if (!article) return {};

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      type: "article",
      title: article.seoTitle,
      description: article.seoDescription,
      url: `/articles/${article.slug}`,
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<ArticlePageParams> }) {
  const { slug } = await params;
  const article = articleCatalogue.find((a) => a.slug === slug && a.published);
  if (!article) notFound();

  const related = articleCatalogue
    .filter((a) => a.published && a.id !== article.id)
    .slice(0, 3);

  return (
    <>
      <article className="relative pb-8 pt-32 sm:pt-40">
        <Container className="max-w-3xl">
          <RevealOnScroll variants={fadeUp}>
            <Link
              href="/articles"
              className="mb-8 flex w-fit items-center gap-2 font-body text-sm text-text-muted transition-colors hover:text-peach-300"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Back to Articles
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
                {formatDate(article.date)}
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
            This article is general educational content and isn&rsquo;t personalized medical advice. For guidance
            specific to your skin, book a consultation.
          </p>
        </Container>
      </article>

      {related.length ? (
        <RelatedArticlesSection
          articles={related}
          eyebrow="Continue Reading"
          heading="More Articles"
          headingId="more-articles-heading"
        />
      ) : null}

      <FinalCTASection content={articlesFinalCtaContent} />
    </>
  );
}
