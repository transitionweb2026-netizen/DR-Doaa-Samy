import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { staggerContainer, cardReveal } from "@/components/motion/variants";
import { ArticleCard } from "@/components/cards/ArticleCard";
import type { Article } from "@/lib/types/content";

export function RelatedArticlesSection({
  articles,
  onOpenArticle,
  eyebrow = "More to Read",
  heading = "Related Articles",
  headingId = "related-articles-heading",
}: {
  articles: Article[];
  onOpenArticle: (article: Article) => void;
  eyebrow?: string;
  heading?: string;
  headingId?: string;
}) {
  return (
    <section aria-labelledby={headingId} className="relative py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow={eyebrow} heading={<span id={headingId}>{heading}</span>} />

        <RevealStagger
          variants={staggerContainer}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {articles.map((article) => (
            <RevealItem key={article.id} variants={cardReveal}>
              <ArticleCard article={article} onOpen={() => onOpenArticle(article)} />
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </section>
  );
}
