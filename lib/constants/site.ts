/**
 * Central site configuration — this is only the local fallback used when
 * Supabase isn't configured or site_settings has no row yet; the live
 * source of truth is the admin's Site Settings page (site_settings table).
 */

export const SITE = {
  name: "Dr. Doaa Samy",
  role: "Dermatologist",
  tagline: "Dermatology & Aesthetic Medicine",
  url: "https://www.drdoaasamy.com",
  locale: "en" as const,
} as const;

export const CONTACT = {
  phoneDisplay: "01116002783",
  phoneHref: "tel:+201116002783",
  whatsappNumber: "201116002783", // digits only, no +
  email: "doaasamy861@gmail.com",
  addressLine:
    "Shubra El-Kheima, past Orabi Bridge\nCity Mall Towers, Towers 3 & 4, 3rd Floor\nTel: 01116002783 / 01206763327 / 0244086840",
} as const;

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${CONTACT.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/dr.doaa.samy344/", icon: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/dr.doaa.samy344/", icon: "facebook" },
  { label: "TikTok", href: "https://tiktok.com/", icon: "tiktok" },
  { label: "YouTube", href: "https://youtube.com/", icon: "youtube" },
] as const;

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Dr. Doaa", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Patients & Reviews", href: "/patients-reviews" },
  { label: "Videos", href: "/videos" },
  { label: "Articles", href: "/articles" },
  { label: "Contact", href: "/contact" },
];

/**
 * Routes that actually exist. Prefetching a Link to a route that isn't
 * built yet just 404s in the background — update this list as each new
 * page ships so its links start prefetching automatically.
 */
const BUILT_ROUTES = new Set([
  "/",
  "/about",
  "/services",
  "/patients-reviews",
  "/videos",
  "/articles",
  "/contact",
  "/ar",
  "/ar/about",
  "/ar/services",
  "/ar/patients-reviews",
  "/ar/videos",
  "/ar/articles",
  "/ar/contact",
]);
// Dynamic routes (e.g. /articles/[slug]) can't be listed exactly — any href
// under one of these prefixes is treated as built.
const BUILT_ROUTE_PREFIXES = ["/articles/", "/ar/articles/"];

export function isRouteBuilt(href: string) {
  return BUILT_ROUTES.has(href) || BUILT_ROUTE_PREFIXES.some((prefix) => href.startsWith(prefix));
}
