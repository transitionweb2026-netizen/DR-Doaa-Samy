import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { contactHeroContent } from "@/data/contact/hero";

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

// No Final CTA here by design — the whole page already is the call to
// action; repeating it at the bottom would be redundant.
export default function ContactPage() {
  return (
    <>
      <HeroSection content={contactHeroContent} id="contact-hero" ariaLabel="Contact" />
      <ContactSection />
    </>
  );
}
