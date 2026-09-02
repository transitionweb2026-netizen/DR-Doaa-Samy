import { Container } from "@/components/ui/Container";
import { RevealOnScroll, RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { slideInRight, staggerContainer, fadeUp } from "@/components/motion/variants";
import { whyDoctorPoints } from "@/data/home/why-doctor";
import { WhyDoctorPortrait } from "./WhyDoctorPortrait";
import type { WhyPoint } from "@/lib/types/content";

export function WhyDoctorSection({
  points = whyDoctorPoints,
  eyebrow = "The Difference",
  heading = "Why Dr. Doaa",
}: {
  points?: WhyPoint[];
  eyebrow?: string;
  heading?: string;
}) {
  return (
    <section aria-labelledby="why-heading" className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_85%_50%,rgba(184,105,97,0.18),transparent_65%)]"
      />
      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <span className="mb-4 inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.25em] text-peach-300">
            <span className="h-px w-6 bg-peach-400/70" aria-hidden="true" />
            {eyebrow}
          </span>
          <h2
            id="why-heading"
            className="text-balance font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.12] text-text-primary"
          >
            {heading}
          </h2>

          <RevealStagger variants={staggerContainer} className="mt-10 flex flex-col gap-6">
            {points.map((point, i) => (
              <RevealItem
                key={point.id}
                variants={fadeUp}
                className="flex gap-4 border-b border-glass-border pb-6 last:border-b-0"
              >
                <span className="font-display text-sm font-medium text-peach-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-body text-base font-semibold text-text-primary">{point.title}</h3>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-text-secondary">
                    {point.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>

        <RevealOnScroll variants={slideInRight}>
          <WhyDoctorPortrait />
        </RevealOnScroll>
      </Container>
    </section>
  );
}
