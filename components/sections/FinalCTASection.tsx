import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { blurReveal } from "@/components/motion/variants";
import { FloatingShape } from "@/components/motion/FloatingShape";
import { finalCtaContent } from "@/data/home/final-cta";
import { whatsappUrl } from "@/lib/constants/site";
import { localizedHref, type UiLocale } from "@/lib/i18n/paths";
import type { FinalCtaContent } from "@/lib/types/content";

export function FinalCTASection({
  content = finalCtaContent,
  locale = "en",
}: {
  content?: FinalCtaContent;
  locale?: UiLocale;
}) {
  return (
    <section aria-labelledby="final-cta-heading" className="relative py-20 sm:py-28">
      <Container>
        <RevealOnScroll variants={blurReveal}>
          <GlassCard
            variant="accent"
            className="relative overflow-hidden px-6 py-16 text-center sm:px-12 sm:py-20"
          >
            <FloatingShape tone="peach" speed="slower" className="left-[-6%] top-[-10%] h-64 w-64" />
            <FloatingShape tone="rose" speed="slow" className="bottom-[-14%] right-[-6%] h-72 w-72" />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-[radial-gradient(circle,rgba(241,183,177,0.35),transparent_70%)] blur-3xl"
            />

            <div className="relative mx-auto max-w-2xl">
              <span className="mb-5 inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.25em] text-peach-200">
                <span className="h-px w-6 bg-peach-300/80" aria-hidden="true" />
                {content.eyebrow}
              </span>
              <h2
                id="final-cta-heading"
                className="text-balance font-display text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.1] text-text-primary"
              >
                {content.heading}
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-balance font-body text-base leading-relaxed text-text-secondary">
                {content.description}
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Button
                  href={whatsappUrl("Hi, I'd like to book a consultation with Dr. Doaa Samy.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="lg"
                >
                  {content.whatsappLabel}
                </Button>
                <Button href={localizedHref(locale, "/contact")} variant="glass" size="lg">
                  {content.contactLabel}
                </Button>
              </div>
            </div>
          </GlassCard>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
