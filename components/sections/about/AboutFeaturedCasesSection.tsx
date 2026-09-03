"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { staggerContainer, cardReveal } from "@/components/motion/variants";
import { CaseCard } from "@/components/cards/CaseCard";
import { CaseModal } from "@/components/modals/CaseModal";
import { aboutFeaturedCases } from "@/data/about/cases";
import { useLocale, localizedHref } from "@/lib/i18n/LocaleContext";
import { getUiStrings } from "@/lib/i18n/ui";
import type { CaseItem } from "@/lib/types/content";

/**
 * A 3-case preview, same visual language as Home's Cases section. Its
 * detail modal uses the light blush variant, per the About page's modal
 * system.
 */
export function AboutFeaturedCasesSection({
  cases = aboutFeaturedCases,
  eyebrow = "Featured Cases",
  heading = "A Preview of Real Results",
  description = "A small selection of treatment journeys. Drag the divider to compare — tap to expand each case.",
}: {
  cases?: CaseItem[];
  eyebrow?: string;
  heading?: string;
  description?: string;
}) {
  const [activeCase, setActiveCase] = useState<CaseItem | null>(null);
  const locale = useLocale();
  const t = getUiStrings(locale);

  return (
    <section aria-labelledby="about-cases-heading" className="relative py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          heading={<span id="about-cases-heading">{heading}</span>}
          description={description}
        />

        <RevealStagger
          variants={staggerContainer}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cases.map((item) => (
            <RevealItem key={item.id} variants={cardReveal}>
              <CaseCard item={item} onOpen={() => setActiveCase(item)} />
            </RevealItem>
          ))}
        </RevealStagger>

        <div className="mt-12 flex justify-center">
          <Button href={localizedHref(locale, "/patients-reviews")} variant="glass" size="lg">
            {t.viewAllCases}
          </Button>
        </div>
      </Container>

      <CaseModal item={activeCase} onClose={() => setActiveCase(null)} tone="blush" />
    </section>
  );
}
