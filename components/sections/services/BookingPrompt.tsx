import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { fadeUp } from "@/components/motion/variants";

/** A single, restrained mid-page nudge toward booking — not repeated per section. */
export function BookingPrompt({
  title = "Not sure which treatment fits you?",
  description = "A short consultation is the easiest way to get a clear, personalized plan.",
  ctaLabel = "Book a Consultation",
  ctaHref = "/contact",
}: {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section aria-label="Book a consultation" className="relative py-4 sm:py-6">
      <Container>
        <RevealOnScroll variants={fadeUp}>
          <GlassCard
            variant="soft"
            className="flex flex-col items-center justify-between gap-5 px-6 py-7 text-center sm:flex-row sm:px-8 sm:text-left"
          >
            <div>
              <p className="font-display text-lg font-medium text-text-primary sm:text-xl">{title}</p>
              <p className="mt-1 font-body text-sm text-text-secondary">{description}</p>
            </div>
            <Button href={ctaHref} variant="primary" size="md" className="shrink-0">
              {ctaLabel}
            </Button>
          </GlassCard>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
