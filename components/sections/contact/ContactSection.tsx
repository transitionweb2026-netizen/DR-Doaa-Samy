import { Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { slideInLeft, slideInRight } from "@/components/motion/variants";
import { WhatsappGlyph } from "@/components/ui/SocialIcon";
import { ContactForm } from "./ContactForm";
import { CONTACT, whatsappUrl } from "@/lib/constants/site";

/**
 * Three primary actions, visually distinct on purpose: WhatsApp and Phone
 * sit together as direct alternatives in the info panel; Submit lives
 * inside the form as the primary CTA — so the three are never confused for
 * one another.
 */
export function ContactSection() {
  return (
    <section aria-labelledby="contact-heading" className="relative py-20 sm:py-28">
      <Container className="grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <RevealOnScroll variants={slideInLeft} className="flex flex-col gap-8">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.25em] text-peach-300">
              <span className="h-px w-6 bg-peach-400/70" aria-hidden="true" />
              Get In Touch
            </span>
            <h2
              id="contact-heading"
              className="text-balance font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.12] text-text-primary"
            >
              Let&rsquo;s talk about your skin.
            </h2>
            <p className="mt-5 max-w-md text-balance font-body text-base leading-relaxed text-text-secondary">
              Reach out directly, or send a message and we&rsquo;ll get back to you — whichever feels easiest.
            </p>
          </div>

          <GlassCard variant="soft" className="flex flex-col gap-4 p-6 sm:p-7">
            <a
              href={whatsappUrl("Hi, I'd like to ask about booking a consultation with Dr. Doaa Samy.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-2xl border border-glass-border bg-glass-bg px-5 py-4 transition-colors hover:bg-glass-bg-strong"
            >
              <span>
                <span className="block font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Direct &amp; Fast
                </span>
                <span className="mt-0.5 block font-body text-sm font-semibold text-text-primary">
                  Chat on WhatsApp
                </span>
              </span>
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                <WhatsappGlyph size={18} />
              </span>
            </a>

            <a
              href={CONTACT.phoneHref}
              className="flex items-center justify-between gap-3 rounded-2xl border border-glass-border bg-glass-bg px-5 py-4 transition-colors hover:bg-glass-bg-strong"
            >
              <span>
                <span className="block font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Call the Clinic
                </span>
                <span className="mt-0.5 block font-body text-sm font-semibold text-text-primary">
                  {CONTACT.phoneDisplay}
                </span>
              </span>
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-peach-400),var(--color-rose-500))] text-text-inverse">
                <Phone size={18} aria-hidden="true" />
              </span>
            </a>

            <div className="h-px w-full bg-glass-border" aria-hidden="true" />

            <div className="flex flex-col gap-1 px-1">
              <a href={`mailto:${CONTACT.email}`} className="font-body text-sm text-text-secondary transition-colors hover:text-peach-300">
                {CONTACT.email}
              </a>
              <p className="font-body text-sm text-text-secondary">{CONTACT.addressLine}</p>
            </div>
          </GlassCard>
        </RevealOnScroll>

        <RevealOnScroll variants={slideInRight}>
          <ContactForm />
        </RevealOnScroll>
      </Container>
    </section>
  );
}
