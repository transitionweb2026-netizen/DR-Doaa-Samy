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
  url: "https://www.drdoaasamy.com/ar",
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
  { label: "تيك توك", href: "https://tiktok.com/", icon: "tiktok" },
] as const;

export const NAV_ITEMS_AR: NavItem[] = [
  { label: "الرئيسية", href: "/ar" },
  { label: "عن د. دعاء", href: "/ar/about" },
  { label: "الخدمات", href: "/ar/services" },
  { label: "المرضى والتقييمات", href: "/ar/patients-reviews" },
  { label: "الفيديوهات", href: "/ar/videos" },
  { label: "المقالات", href: "/ar/articles" },
  { label: "تواصل معنا", href: "/ar/contact" },
];

export const FOOTER_BLURB_AR = "رعاية جلدية وتجميلية شخصية — دقيقة وحديثة وواثقة بهدوء.";
