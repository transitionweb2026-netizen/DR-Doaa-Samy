import { Award, GraduationCap, Stethoscope, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { staggerContainer, cardReveal } from "@/components/motion/variants";
import { credentials } from "@/data/about/experience";
import type { CredentialCategory } from "@/lib/types/content";

const CATEGORY_ICON: Record<CredentialCategory, LucideIcon> = {
  Education: GraduationCap,
  Certification: Award,
  Experience: Stethoscope,
};

export function ExperienceSection() {
  return (
    <section aria-labelledby="experience-heading" className="relative py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Credentials"
          heading={<span id="experience-heading">Experience & Certifications</span>}
          description="A continuing path of clinical training and hands-on practice — the foundation every treatment plan is built on."
        />

        <RevealStagger
          variants={staggerContainer}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {credentials.map((credential) => {
            const Icon = CATEGORY_ICON[credential.category];
            return (
              <RevealItem key={credential.id} variants={cardReveal}>
                <GlassCard variant="soft" className="flex h-full flex-col p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span
                      className="glass-surface inline-flex h-12 w-12 items-center justify-center rounded-full text-peach-300 shadow-glow-peach"
                      aria-hidden="true"
                    >
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <span className="font-body text-xs font-medium uppercase tracking-[0.15em] text-text-muted">
                      {credential.period}
                    </span>
                  </div>

                  <span className="mt-5 w-fit rounded-full border border-glass-border bg-glass-bg px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-peach-300">
                    {credential.category}
                  </span>

                  <h3 className="mt-3 font-display text-lg font-medium text-text-primary sm:text-xl">
                    {credential.title}
                  </h3>
                  <p className="mt-1 font-body text-sm font-medium text-text-secondary">{credential.institution}</p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-text-muted">{credential.description}</p>
                </GlassCard>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </Container>
    </section>
  );
}
