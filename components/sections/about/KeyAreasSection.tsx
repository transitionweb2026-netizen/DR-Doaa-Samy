"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { staggerContainer, cardReveal } from "@/components/motion/variants";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { ServiceModal } from "@/components/modals/ServiceModal";
import { keyTreatmentAreas } from "@/data/about/treatments";
import type { ServiceItem } from "@/lib/types/content";

/**
 * A concise overview of Dr. Doaa's key treatment areas — a plain, even
 * grid (rather than Home's bento) so the section reads distinctly even
 * though it reuses the exact same card component. Its detail modal uses
 * the light blush variant, per the About page's modal system.
 */
export function KeyAreasSection({
  services = keyTreatmentAreas,
  eyebrow = "Key Areas",
  heading = "Important Treatments",
  description = "A concise look at the areas Dr. Doaa focuses on most — the full catalogue lives on the Services page.",
}: {
  services?: ServiceItem[];
  eyebrow?: string;
  heading?: string;
  description?: string;
}) {
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);

  return (
    <section aria-labelledby="key-areas-heading" className="relative py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          heading={<span id="key-areas-heading">{heading}</span>}
          description={description}
        />

        <RevealStagger
          variants={staggerContainer}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
        >
          {services.map((service) => (
            <RevealItem key={service.id} variants={cardReveal} className="aspect-[3/4]">
              <ServiceCard service={service} onOpen={() => setActiveService(service)} />
            </RevealItem>
          ))}
        </RevealStagger>

        <div className="mt-12 flex justify-center">
          <Button href="/services" variant="glass" size="lg">
            Explore All Services
          </Button>
        </div>
      </Container>

      <ServiceModal service={activeService} onClose={() => setActiveService(null)} tone="blush" />
    </section>
  );
}
