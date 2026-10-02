import { SITE, CONTACT, CONTACT_PHONES, SOCIAL_LINKS } from "@/lib/constants/site";
import { SITE_AR, CONTACT_AR } from "@/lib/constants/site.ar";
import type { UiLocale } from "@/lib/i18n/paths";

/**
 * JSON-LD for the practice, rendered once in each root layout (this is
 * one named physician's own practice, not a multi-practitioner clinic —
 * `Physician` is schema.org's specific type for that, a MedicalBusiness
 * subtype Google's own doctor rich-result guidance points to). Built only
 * from facts already published elsewhere on the site (lib/constants/site*)
 * — no ratings, hours, or credentials beyond what's actually shown.
 */
export function StructuredData({ locale }: { locale: UiLocale }) {
  const isAr = locale === "ar";
  const site = isAr ? SITE_AR : SITE;
  const contact = isAr ? CONTACT_AR : CONTACT;
  const url = isAr ? SITE.url : `${SITE.url}/en`;

  const physician = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${SITE.url}/#physician`,
    name: site.name,
    url,
    image: `${SITE.url}/opengraph-image.png`,
    telephone: CONTACT_PHONES.map((p) => p.href.replace("tel:", "")),
    email: `mailto:${CONTACT.email}`,
    medicalSpecialty: "Dermatology",
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.addressLine.replace("\n", ", "),
      addressLocality: isAr ? "شبرا الخيمة" : "Shubra El-Kheima",
      addressCountry: "EG",
    },
    sameAs: SOCIAL_LINKS.map((s) => s.href),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: site.name,
    url,
    inLanguage: locale,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(physician) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
