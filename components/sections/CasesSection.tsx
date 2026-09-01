"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { staggerContainer, cardReveal } from "@/components/motion/variants";
import { CaseCard } from "@/components/cards/CaseCard";
import { CaseModal } from "@/components/modals/CaseModal";
import { casesContent } from "@/data/home/cases";
import type { CaseItem } from "@/lib/types/content";

export function CasesSection({
  cases = casesContent,
  eyebrow = "Real Results",
  heading = "Cases & Transformations",
  headingId = "cases-heading",
  description = "A curated look at treatment outcomes. Drag the divider to compare — tap to expand each case.",
  tone = "dark",
}: {
  cases?: CaseItem[];
  eyebrow?: string;
  heading?: string;
  headingId?: string;
  description?: string;
  /** "blush" opens cases in the light glass modal (Patients & Stories, Services); "dark" (default) matches Home's teaser. */
  tone?: "dark" | "blush";
}) {
  const [activeCase, setActiveCase] = useState<CaseItem | null>(null);

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
      </Container>

      <CaseModal item={activeCase} onClose={() => setActiveCase(null)} tone={tone} />
    </section>
  );
}
