"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { staggerContainer, cardReveal } from "@/components/motion/variants";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { ServiceModal } from "@/components/modals/ServiceModal";
import { featuredServices } from "@/data/home/services";
import { cn } from "@/lib/utils/cn";
import type { ServiceItem } from "@/lib/types/content";

// Bento placement for each card position — the first service leads as a
// larger, more editorial tile; the remaining four sit in a tighter 2x2
// rhythm beside it. Collapses to a simple stack below `sm`.
const BENTO_SPAN = [
  "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-1",
];

export function FeaturedServicesSection({
  services = featuredServices,
  eyebrow = "What We Offer",
  heading = "Featured Services",
  headingId = "services-heading",
  description = "A glimpse of our most requested treatments — the full catalogue lives on the Services page.",
}: {
  services?: ServiceItem[];
  eyebrow?: string;
  heading?: string;
  headingId?: string;
  description?: string;
}) {
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);

  return (
    <section aria-labelledby={headingId} className="relative py-20 sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={eyebrow}
            heading={<span id={headingId}>{heading}</span>}
            description={description}
          />
        </div>

        <RevealStagger
          variants={staggerContainer}
          // Row height must be ≥ ServiceCard's own min-h-[240px], or a
          // non-featured card overflows its grid row and visually bleeds
          // into (overlaps) the row below, swallowing the gap entirely.
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[250px]"
        >
          {services.map((service, index) => (
            <RevealItem key={service.id} variants={cardReveal} className={cn(BENTO_SPAN[index])}>
              <ServiceCard
                service={service}
                featured={index === 0}
                onOpen={() => setActiveService(service)}
              />
            </RevealItem>
          ))}
        </RevealStagger>

        <div className="mt-12 flex justify-center">
          <Button href="/services" variant="glass" size="lg">
            Explore All Services
          </Button>
        </div>
      </Container>

      <ServiceModal service={activeService} onClose={() => setActiveService(null)} />
    </section>
  );
}
