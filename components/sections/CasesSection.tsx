"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { staggerContainer, cardReveal } from "@/components/motion/variants";
import { CaseCard } from "@/components/cards/CaseCard";
import { CaseModal } from "@/components/modals/CaseModal";
import { casesContent } from "@/data/home/cases";
import { useLocale, localizedHref } from "@/lib/i18n/LocaleContext";
import { getUiStrings } from "@/lib/i18n/ui";
import type { CaseItem } from "@/lib/types/content";

export function CasesSection({
  cases = casesContent,
  eyebrow = "Real Results",
  heading = "Cases & Transformations",
  headingId = "cases-heading",
  description = "A curated look at treatment outcomes. Drag the divider to compare — tap to expand each case.",
  tone = "dark",
  showCta = true,
}: {
  cases?: CaseItem[];
  eyebrow?: string;
  heading?: string;
  headingId?: string;
  description?: string;
  /** "blush" opens cases in the light glass modal (Patients & Stories, Services); "dark" (default) matches Home's teaser. */
  tone?: "dark" | "blush";
  /** Hide the "View All Cases" link when already on its destination page. */
  showCta?: boolean;
}) {
  const [activeCase, setActiveCase] = useState<CaseItem | null>(null);
  const locale = useLocale();
  const t = getUiStrings(locale);

  return (
    <section aria-labelledby={headingId} className="relative py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          heading={<span id={headingId}>{heading}</span>}
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

        {showCta ? (
          <div className="mt-14 flex justify-center">
            <Button href={localizedHref(locale, "/patients-reviews")} variant="glass" size="lg">
              {t.viewAllCases}
            </Button>
          </div>
        ) : null}
      </Container>

      <CaseModal item={activeCase} onClose={() => setActiveCase(null)} tone={tone} />
    </section>
  );
}
