import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { contactHeroContentAr } from "@/data/ar/contact/hero";
import { contactSectionCopyAr } from "@/data/ar/sectionCopy";
import { getHeroContent } from "@/lib/cms/hero";
import { getSectionCopy } from "@/lib/cms/sectionCopy";
import { getSiteSettings } from "@/lib/cms/siteSettings";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "احجزي استشارة مع د. دعاء سامي — تواصلي عبر الهاتف أو واتساب أو نموذج التواصل للبدء.",
  alternates: {
    canonical: "/ar/contact",
    languages: { en: "/contact", ar: "/ar/contact" },
  },
  openGraph: {
    title: "تواصل معنا | د. دعاء سامي",
    description: "احجزي استشارة — تواصلي عبر الهاتف أو واتساب أو نموذج التواصل.",
    url: "/ar/contact",
  },
};

const PAGE = "contact";
const locale = "ar" as const;

// No Final CTA here by design — the whole page already is the call to
// action; repeating it at the bottom would be redundant.
export default async function ContactPageAr() {
  const [hero, formCopy, settings] = await Promise.all([
    getHeroContent(PAGE, locale, contactHeroContentAr),
    getSectionCopy(PAGE, "form", locale, contactSectionCopyAr.form),
    getSiteSettings(locale),
  ]);
  const whatsappHref = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    "مرحباً، أود الاستفسار عن حجز استشارة مع الدكتورة دعاء سامي.",
  )}`;

  return (
    <>
      <HeroSection content={hero} id="contact-hero" ariaLabel="تواصل معنا" />
      <ContactSection
        {...formCopy}
        whatsappHref={whatsappHref}
        phoneDisplay={settings.phoneDisplay}
        phoneHref={settings.phoneHref}
        email={settings.email}
        addressLine={settings.addressLine}
        locale={locale}
      />
    </>
  );
}
