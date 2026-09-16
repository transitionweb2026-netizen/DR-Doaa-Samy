import { MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { slideInLeft, slideInRight } from "@/components/motion/variants";
import { WhatsappGlyph } from "@/components/ui/SocialIcon";
import { AddressBlock } from "@/components/ui/AddressBlock";
import { ContactForm } from "./ContactForm";
import { CONTACT, CONTACT_PHONES, whatsappUrl } from "@/lib/constants/site";
import { getUiStrings } from "@/lib/i18n/ui";
import type { UiLocale } from "@/lib/i18n/LocaleContext";
import type { PhoneNumber } from "@/lib/cms/siteSettings";

/**
 * Three primary actions, visually distinct on purpose: WhatsApp and Phone
 * sit together as direct alternatives in the info panel; Submit lives
 * inside the form as the primary CTA — so the three are never confused for
 * one another.
 */
export function ContactSection({
  eyebrow = "Get In Touch",
  heading = "Let’s talk about your skin.",
  description = "Reach out directly, or send a message and we’ll get back to you — whichever feels easiest.",
  whatsappHref = whatsappUrl("Hi, I'd like to ask about booking a consultation with Dr. Doaa Samy."),
  phones = CONTACT_PHONES,
  email = CONTACT.email,
  addressLine = CONTACT.addressLine,
  locale = "en",
}: {
  eyebrow?: string;
  heading?: string;
  description?: string;
  whatsappHref?: string;
  phones?: PhoneNumber[];
  email?: string;
  addressLine?: string;
  locale?: UiLocale;
}) {
  const t = getUiStrings(locale);
  const infoVariant = locale === "ar" ? slideInRight : slideInLeft;
  const formVariant = locale === "ar" ? slideInLeft : slideInRight;
  return (
    <section aria-labelledby="contact-heading" className="relative py-20 sm:py-28">
      <Container className="grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <RevealOnScroll variants={infoVariant} className="flex flex-col gap-8">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.25em] text-peach-300">
              <span className="h-px w-6 bg-peach-400/70" aria-hidden="true" />
              {eyebrow}
            </span>
            <h2
              id="contact-heading"
              className="text-balance font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.12] text-text-primary"
            >
              {heading}
            </h2>
            <p className="mt-5 max-w-md text-balance font-body text-base leading-relaxed text-text-secondary">
              {description}
            </p>
          </div>

          <GlassCard variant="soft" className="flex flex-col gap-4 p-6 sm:p-7">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-2xl border border-glass-border bg-glass-bg px-5 py-4 transition-colors hover:bg-glass-bg-strong"
            >
              <span>
                <span className="block font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  {t.directFast}
                </span>
                <span className="mt-0.5 block font-body text-sm font-semibold text-text-primary">
                  {t.chatOnWhatsapp}
                </span>
              </span>
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                <WhatsappGlyph size={18} />
              </span>
            </a>

            <div className="rounded-2xl border border-glass-border bg-glass-bg px-5 py-4">
              <span className="block font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                {t.callTheClinic}
              </span>
              <div className="mt-2 flex flex-col gap-2">
                {phones.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="flex items-center gap-2.5 font-body text-sm font-semibold text-text-primary transition-colors hover:text-peach-300"
                  >
                    <Phone size={14} aria-hidden="true" className="shrink-0 text-peach-300" />
                    <span dir="ltr">{phone.display}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-glass-border" aria-hidden="true" />

            <div className="flex flex-col gap-2 px-1">
              <a href={`mailto:${email}`} className="font-body text-sm text-text-secondary transition-colors hover:text-peach-300">
                {email}
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-peach-300" />
                <AddressBlock value={addressLine} className="font-body text-sm leading-relaxed text-text-secondary" />
              </div>
            </div>
          </GlassCard>
        </RevealOnScroll>

        <RevealOnScroll variants={formVariant}>
          <ContactForm />
        </RevealOnScroll>
      </Container>
    </section>
  );
}
