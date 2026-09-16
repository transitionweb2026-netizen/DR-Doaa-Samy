import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  CONTACT,
  CONTACT_PHONES,
  SITE,
  SOCIAL_LINKS as LOCAL_SOCIAL_LINKS,
  NAV_ITEMS as LOCAL_NAV_ITEMS,
  parsePhones,
} from "@/lib/constants/site";
import { NAV_ITEMS_AR } from "@/lib/constants/site.ar";
import { localizedHref } from "@/lib/i18n/paths";
import type { Locale } from "./types";

export type PhoneNumber = { display: string; href: string };

export type SiteSettingsContent = {
  siteName: string;
  roleTitle: string;
  tagline: string;
  /** The first entry of `phones` — for simple single-action UI (floating
   *  button, hero panel, header) that only ever dials one number. */
  phoneDisplay: string;
  phoneHref: string;
  /** Every clinic phone number, in order — for the Contact page and footer,
   *  which list each one as its own row. */
  phones: PhoneNumber[];
  whatsappNumber: string;
  email: string;
  addressLine: string;
  footerBlurb: string;
  copyrightText: string;
};

const FALLBACK_FOOTER_BLURB =
  "Personalized dermatology and aesthetic medicine — precise, modern, and quietly confident.";

function localFallback(): SiteSettingsContent {
  return {
    siteName: SITE.name,
    roleTitle: SITE.role,
    tagline: SITE.tagline,
    phoneDisplay: CONTACT.phoneDisplay,
    phoneHref: CONTACT.phoneHref,
    phones: CONTACT_PHONES,
    whatsappNumber: CONTACT.whatsappNumber,
    email: CONTACT.email,
    addressLine: CONTACT.addressLine,
    footerBlurb: FALLBACK_FOOTER_BLURB,
    copyrightText: `© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.`,
  };
}

export async function getSiteSettings(locale: Locale): Promise<SiteSettingsContent> {
  const fallback = localFallback();
  if (!isSupabaseConfigured) return fallback;

  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").maybeSingle();
  if (!data) return fallback;

  const pick = (en: unknown, ar: unknown, fb: string) => {
    const enVal = typeof en === "string" && en ? en : fb;
    return locale === "ar" && typeof ar === "string" && ar ? ar : enVal;
  };

  // site_settings.phone_display/phone_href are plain text columns, so
  // multiple numbers are stored comma-joined in the same two fields the
  // admin already edits — parsed back out here into individual entries.
  const rawPhoneDisplay = data.phone_display || CONTACT_PHONES.map((p) => p.display).join(",");
  const rawPhoneHref = data.phone_href || CONTACT_PHONES.map((p) => p.href).join(",");
  const phones = parsePhones(rawPhoneDisplay, rawPhoneHref);

  return {
    siteName: pick(data.site_name, data.ar_site_name, fallback.siteName),
    roleTitle: pick(data.role_title, data.ar_role_title, fallback.roleTitle),
    tagline: pick(data.tagline, data.ar_tagline, fallback.tagline),
    phoneDisplay: phones[0]?.display ?? fallback.phoneDisplay,
    phoneHref: phones[0]?.href ?? fallback.phoneHref,
    phones: phones.length > 0 ? phones : fallback.phones,
    whatsappNumber: data.whatsapp_number || fallback.whatsappNumber,
    email: data.email || fallback.email,
    addressLine: pick(data.address, data.ar_address, fallback.addressLine),
    footerBlurb: pick(data.footer_blurb, data.ar_footer_blurb, fallback.footerBlurb),
    copyrightText: pick(data.copyright_text, data.ar_copyright_text, fallback.copyrightText),
  };
}

export type NavItemContent = { label: string; href: string };

export async function getNavItems(location: "header" | "footer", locale: Locale): Promise<NavItemContent[]> {
  // nav_items.href is stored once (English path, e.g. "/about") — same as
  // every other CMS URL field — with the /ar prefix applied here at read
  // time, not stored per locale. Without this, an Arabic label would link
  // straight back into the English tree.
  const localSource = locale === "ar" ? NAV_ITEMS_AR : LOCAL_NAV_ITEMS;
  const fallback: NavItemContent[] = localSource.map((item) => ({ label: item.label, href: item.href }));
  if (!isSupabaseConfigured) return fallback;

  const supabase = await createClient();
  const { data } = await supabase
    .from("nav_items")
    .select("*")
    .eq("location", location)
    .eq("is_enabled", true)
    .order("sort_order", { ascending: true });
  if (!data || data.length === 0) return fallback;

  return data.map((row) => ({
    label: locale === "ar" && row.ar_label ? row.ar_label : row.label,
    href: localizedHref(locale, row.href),
  }));
}

export type SocialLinkContent = { label: string; href: string; icon: string };

export async function getSocialLinks(): Promise<SocialLinkContent[]> {
  const fallback: SocialLinkContent[] = LOCAL_SOCIAL_LINKS.map((s) => ({ label: s.label, href: s.href, icon: s.icon }));
  if (!isSupabaseConfigured) return fallback;

  const supabase = await createClient();
  const { data } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_enabled", true)
    .order("sort_order", { ascending: true });
  if (!data || data.length === 0) return fallback;

  return data.map((row) => ({ label: row.label, href: row.href, icon: row.icon_key }));
}
