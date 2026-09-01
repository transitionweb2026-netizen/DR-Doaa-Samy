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
import type { CaseItem } from "@/lib/types/content";

/**
 * A 3-case preview, same visual language as Home's Cases section. Its
 * detail modal uses the light blush variant, per the About page's modal
 * system.
 */
export function AboutFeaturedCasesSection() {
  const [activeCase, setActiveCase] = useState<CaseItem | null>(null);

  return (
    <section aria-labelledby="about-cases-heading" className="relative py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Featured Cases"
          heading={<span id="about-cases-heading">A Preview of Real Results</span>}
          description="A small selection of treatment journeys. Drag the divider to compare — tap to expand each case."
        />

        <RevealStagger
          variants={staggerContainer}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {aboutFeaturedCases.map((item) => (
            <RevealItem key={item.id} variants={cardReveal}>
              <CaseCard item={item} onOpen={() => setActiveCase(item)} />
            </RevealItem>
          ))}
        </RevealStagger>

        <div className="mt-12 flex justify-center">
          <Button href="/patients-reviews" variant="glass" size="lg">
            View All Cases
          </Button>
        </div>
      </Container>

      <CaseModal item={activeCase} onClose={() => setActiveCase(null)} tone="blush" />
    </section>
  );
}
