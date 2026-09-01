import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { slideInLeft, slideInRight, fadeUp, staggerContainer } from "@/components/motion/variants";
import { RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { doctorIntroContent } from "@/data/home/doctor-intro";
import { IntroVideoFrame } from "./IntroVideoFrame";

export function DoctorIntroSection() {
  return (
    <section aria-labelledby="intro-heading" className="relative py-20 sm:py-28">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <RevealOnScroll variants={slideInLeft} className="order-2 lg:order-1">
          <span className="mb-4 inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.25em] text-peach-300">
            <span className="h-px w-6 bg-peach-400/70" aria-hidden="true" />
            {doctorIntroContent.eyebrow}
          </span>
          <h2
            id="intro-heading"
            className="text-balance font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.12] text-text-primary"
          >
            {doctorIntroContent.heading}
          </h2>

          <div className="mt-6 flex flex-col gap-4">
            {doctorIntroContent.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-balance font-body text-base leading-relaxed text-text-secondary">
                {paragraph}
              </p>
            ))}
          </div>

          <RevealStagger variants={staggerContainer} className="mt-8 flex flex-col gap-3">
            {doctorIntroContent.highlights.map((highlight) => (
              <RevealItem key={highlight} variants={fadeUp} className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-peach-500/15 text-peach-300">
                  <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span className="font-body text-sm text-text-secondary">{highlight}</span>
              </RevealItem>
            ))}
          </RevealStagger>
        </RevealOnScroll>

        <RevealOnScroll variants={slideInRight} className="order-1 lg:order-2">
          <IntroVideoFrame poster={doctorIntroContent.video} durationLabel={doctorIntroContent.video.durationLabel} />
        </RevealOnScroll>
      </Container>
    </section>
  );
}
