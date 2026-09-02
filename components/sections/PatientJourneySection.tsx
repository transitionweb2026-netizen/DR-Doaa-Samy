import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { staggerContainer, cardReveal } from "@/components/motion/variants";
import { journeySteps } from "@/data/home/journey";
import { JourneyProgressLine } from "./JourneyProgressLine";
import type { JourneyStep } from "@/lib/types/content";

// The `lg:grid-cols-5` layout below assumes 5 steps, matching the design;
// a different count from the CMS will still render correctly but wrap.
export function PatientJourneySection({
  steps = journeySteps,
  eyebrow = "The Process",
  heading = "Your Journey With Dr. Doaa",
  headingId = "journey-heading",
  description = "A considered, step-by-step path from first consultation to lasting results.",
}: {
  steps?: JourneyStep[];
  eyebrow?: string;
  heading?: string;
  headingId?: string;
  description?: string;
}) {
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

        <div className="relative mt-16">
          <JourneyProgressLine />

          <RevealStagger
            variants={staggerContainer}
            className="relative grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-6"
          >
            {steps.map((step) => (
              <RevealItem
                key={step.id}
                variants={cardReveal}
                className="relative flex items-start gap-5 pl-0 lg:flex-col lg:items-center lg:gap-4 lg:text-center"
              >
                <span
                  className="glass-surface relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full font-display text-lg font-medium text-peach-200 shadow-glow-peach"
                  aria-hidden="true"
                >
                  {step.index}
                </span>
                <div className="pt-1 lg:pt-0">
                  <h3 className="font-body text-base font-semibold text-text-primary">{step.title}</h3>
                  <p className="mt-1.5 max-w-[16rem] font-body text-sm leading-relaxed text-text-secondary lg:mx-auto">
                    {step.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </Container>
    </section>
  );
}
