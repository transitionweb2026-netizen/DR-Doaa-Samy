import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CONTACT, SITE, SOCIAL_LINKS as LOCAL_SOCIAL_LINKS, NAV_ITEMS as LOCAL_NAV_ITEMS } from "@/lib/constants/site";
import type { Locale } from "./types";

export type SiteSettingsContent = {
  siteName: string;
  roleTitle: string;
  tagline: string;
  phoneDisplay: string;
  phoneHref: string;
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

  return {
    siteName: pick(data.site_name, data.ar_site_name, fallback.siteName),
    roleTitle: pick(data.role_title, data.ar_role_title, fallback.roleTitle),
    tagline: pick(data.tagline, data.ar_tagline, fallback.tagline),
    phoneDisplay: data.phone_display || fallback.phoneDisplay,
    phoneHref: data.phone_href || fallback.phoneHref,
    whatsappNumber: data.whatsapp_number || fallback.whatsappNumber,
    email: data.email || fallback.email,
    addressLine: pick(data.address, data.ar_address, fallback.addressLine),
    footerBlurb: pick(data.footer_blurb, data.ar_footer_blurb, fallback.footerBlurb),
    copyrightText: pick(data.copyright_text, data.ar_copyright_text, fallback.copyrightText),
  };
}

export type NavItemContent = { label: string; href: string };

export async function getNavItems(location: "header" | "footer", locale: Locale): Promise<NavItemContent[]> {
  const fallback: NavItemContent[] = LOCAL_NAV_ITEMS.map((item) => ({ label: item.label, href: item.href }));
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
    href: row.href,
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
