"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { staggerContainer, cardReveal } from "@/components/motion/variants";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { reviewsContent } from "@/data/home/reviews";
import { useLocale, localizedHref } from "@/lib/i18n/LocaleContext";
import { getUiStrings } from "@/lib/i18n/ui";
import type { ReviewItem } from "@/lib/types/content";

export function ReviewsSection({
  reviews = reviewsContent,
  eyebrow = "Patient Voices",
  heading = "Patient Reviews",
  headingId = "reviews-heading",
  description = "What patients share after their consultation and treatment experience.",
  showCta = true,
}: {
  reviews?: ReviewItem[];
  eyebrow?: string;
  heading?: string;
  headingId?: string;
  description?: string;
  /** Hide the "View All Reviews" link when already on its destination page. */
  showCta?: boolean;
}) {
  const locale = useLocale();
  const t = getUiStrings(locale);
  return (
    <section aria-labelledby={headingId} className="relative py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          heading={<span id={headingId}>{heading}</span>}
          description={description}
          align="center"
          className="mx-auto"
        />

        <RevealStagger
          variants={staggerContainer}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {reviews.map((review, i) => (
            <RevealItem key={review.id} variants={cardReveal}>
              <ReviewCard review={review} offset={i % 3 === 1} />
            </RevealItem>
          ))}
        </RevealStagger>

        {showCta ? (
          <div className="mt-14 flex justify-center">
            <Button href={localizedHref(locale, "/patients-reviews")} variant="glass" size="lg">
              {t.viewAllReviews}
            </Button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
