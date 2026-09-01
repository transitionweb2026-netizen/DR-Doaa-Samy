import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { staggerContainer, cardReveal } from "@/components/motion/variants";
import { journeySteps } from "@/data/home/journey";
import { JourneyProgressLine } from "./JourneyProgressLine";

export function PatientJourneySection() {
  return (
    <section aria-labelledby="journey-heading" className="relative py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="The Process"
          heading={<span id="journey-heading">Your Journey With Dr. Doaa</span>}
          description="A considered, step-by-step path from first consultation to lasting results."
          align="center"
          className="mx-auto"
        />

        <div className="relative mt-16">
          <JourneyProgressLine />

          <RevealStagger
            variants={staggerContainer}
            className="relative grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-6"
          >
            {journeySteps.map((step) => (
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
