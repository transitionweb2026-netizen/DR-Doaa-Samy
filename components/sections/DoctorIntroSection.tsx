import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { slideInLeft, slideInRight, fadeUp, staggerContainer } from "@/components/motion/variants";
import { RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { doctorIntroContent } from "@/data/home/doctor-intro";
import { IntroVideoFrame } from "./IntroVideoFrame";
import type { UiLocale } from "@/lib/i18n/LocaleContext";
import type { DoctorIntroContent } from "@/lib/types/content";

export function DoctorIntroSection({
  content = doctorIntroContent,
  locale = "en",
}: {
  content?: DoctorIntroContent;
  locale?: UiLocale;
}) {
  // RTL visually mirrors this split (text ends up on the right, video on
  // the left), so the two entrance directions swap too — each side still
  // slides in from its own outer edge, converging inward.
  const textVariant = locale === "ar" ? slideInRight : slideInLeft;
  const videoVariant = locale === "ar" ? slideInLeft : slideInRight;
  return (
    <section aria-labelledby="intro-heading" className="relative py-20 sm:py-28">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <RevealOnScroll variants={textVariant} className="order-2 lg:order-1">
          <span className="mb-4 inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.25em] text-peach-300">
            <span className="h-px w-6 bg-peach-400/70" aria-hidden="true" />
            {content.eyebrow}
          </span>
          <h2
            id="intro-heading"
            className="text-balance font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.12] text-text-primary"
          >
            {content.heading}
          </h2>

          <div className="mt-6 flex flex-col gap-4">
            {content.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-balance font-body text-base leading-relaxed text-text-secondary">
                {paragraph}
              </p>
            ))}
          </div>

          <RevealStagger variants={staggerContainer} className="mt-8 flex flex-col gap-3">
            {content.highlights.map((highlight) => (
              <RevealItem key={highlight} variants={fadeUp} className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-peach-500/15 text-peach-300">
                  <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span className="font-body text-sm text-text-secondary">{highlight}</span>
              </RevealItem>
            ))}
          </RevealStagger>
        </RevealOnScroll>

        <RevealOnScroll variants={videoVariant} className="order-1 lg:order-2">
          <IntroVideoFrame poster={content.video} durationLabel={content.video.durationLabel} />
        </RevealOnScroll>
      </Container>
    </section>
  );
}
