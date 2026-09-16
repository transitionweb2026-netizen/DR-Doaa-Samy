import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { contactHeroContent } from "@/data/contact/hero";
import { getHeroContent } from "@/lib/cms/hero";
import { getSectionCopy } from "@/lib/cms/sectionCopy";
import { getSiteSettings } from "@/lib/cms/siteSettings";
import { DEFAULT_LOCALE } from "@/lib/cms/types";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a consultation with Dr. Doaa Samy — reach out by phone, WhatsApp, or the contact form to get started.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Dr. Doaa Samy",
    description: "Book a consultation — reach out by phone, WhatsApp, or the contact form.",
    url: "/contact",
  },
};

const PAGE = "contact";
const locale = DEFAULT_LOCALE;

// No Final CTA here by design — the whole page already is the call to
// action; repeating it at the bottom would be redundant.
export default async function ContactPage() {
  const [hero, formCopy, settings] = await Promise.all([
    getHeroContent(PAGE, locale, contactHeroContent),
    getSectionCopy(PAGE, "form", locale, {
      eyebrow: "Get In Touch",
      heading: "Let’s talk about your skin.",
      description: "Reach out directly, or send a message and we’ll get back to you — whichever feels easiest.",
    }),
    getSiteSettings(locale),
  ]);
  const whatsappHref = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    "Hi, I'd like to ask about booking a consultation with Dr. Doaa Samy.",
  )}`;

  return (
    <>
      <HeroSection content={hero} id="contact-hero" ariaLabel="Contact" />
      <ContactSection
        {...formCopy}
        whatsappHref={whatsappHref}
        phones={settings.phones}
        email={settings.email}
        addressLine={settings.addressLine}
      />
    </>
  );
}
