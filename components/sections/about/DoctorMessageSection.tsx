import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { slideInLeft, slideInRight } from "@/components/motion/variants";
import { WhyDoctorPortrait } from "@/components/sections/WhyDoctorPortrait";
import { aboutMessageContent } from "@/data/about/message";
import type { AboutMessageContent } from "@/lib/types/content";

/**
 * Editorial split section — reuses the exact "playing card" portrait
 * treatment from Home's Why Dr. Doaa section (same DNA, as required), paired
 * with a personal pull-quote statement rather than a bullet list of points.
 */
export function DoctorMessageSection({ content = aboutMessageContent }: { content?: AboutMessageContent }) {
  return (
    <section aria-labelledby="message-heading" className="relative overflow-hidden py-20 sm:py-28">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <RevealOnScroll variants={slideInLeft}>
          <span className="mb-4 inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.25em] text-peach-300">
            <span className="h-px w-6 bg-peach-400/70" aria-hidden="true" />
            {content.eyebrow}
          </span>

          <div className="relative">
            <Quote
              aria-hidden="true"
              className="absolute -left-2 -top-6 h-14 w-14 text-peach-300/15 sm:-left-4 sm:h-16 sm:w-16"
              fill="currentColor"
              strokeWidth={0}
            />
            <h2
              id="message-heading"
              className="relative text-balance font-display text-[clamp(1.6rem,3.2vw,2.35rem)] font-normal italic leading-[1.28] text-text-primary"
            >
              {content.quote}
            </h2>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {content.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-balance font-body text-base leading-relaxed text-text-secondary">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <span className="h-px w-10 bg-peach-400/60" aria-hidden="true" />
            <div>
              <p className="font-display text-lg italic text-text-primary">{content.signatureName}</p>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-text-muted">
                {content.signatureTitle}
              </p>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll variants={slideInRight}>
          <WhyDoctorPortrait />
        </RevealOnScroll>
      </Container>
    </section>
  );
}
