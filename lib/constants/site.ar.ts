/**
 * Arabic mirror of lib/constants/site.ts — same real-world values (phone,
 * WhatsApp number, email), translated brand copy and nav labels, hrefs
 * pointing at the /ar/* tree.
 */
import { CONTACT } from "./site";
import type { NavItem } from "./site";

export const SITE_AR = {
  name: "د. دعاء سامي",
  role: "استشارية الأمراض الجلدية",
  tagline: "الجلدية والطب التجميلي",
  url: "https://dr-doaasamy.com",
  locale: "ar" as const,
} as const;

export const CONTACT_AR = {
  ...CONTACT,
  addressLine: "شبرا الخيمة، بعد كوبري عرابي\nأبراج سيتي مول، البرجين 3 و4، الطابق الثالث",
} as const;

export function whatsappUrlAr(message?: string) {
  const base = `https://wa.me/${CONTACT.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const SOCIAL_LINKS_AR = [
  { label: "إنستغرام", href: "https://www.instagram.com/dr.doaa.samy344/", icon: "instagram" },
  { label: "فيسبوك", href: "https://www.facebook.com/dr.doaa.samy344/", icon: "facebook" },
  { label: "تيك توك", href: "https://www.tiktok.com/@dr.doaa.samy.clinic", icon: "tiktok" },
] as const;

// Bare, Arabic-native paths — same convention as NAV_ITEMS (site.ts):
// getNavItems() applies localizedHref() to these at read time, so they
// must NOT be pre-prefixed.
export const NAV_ITEMS_AR: NavItem[] = [
  { label: "الرئيسية", href: "/" },
  { label: "عن د. دعاء", href: "/about" },
  { label: "الخدمات", href: "/services" },
  { label: "المرضى والتقييمات", href: "/patients-reviews" },
  { label: "الفيديوهات", href: "/videos" },
  { label: "المقالات", href: "/articles" },
  { label: "تواصل معنا", href: "/contact" },
];

export const FOOTER_BLURB_AR = "رعاية جلدية وتجميلية شخصية — دقيقة وحديثة وواثقة بهدوء.";
