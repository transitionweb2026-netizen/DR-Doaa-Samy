"use client";

import { createContext, useContext } from "react";
import { CONTACT, SOCIAL_LINKS, whatsappUrl } from "@/lib/constants/site";

export type SiteContactValue = {
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
  socialLinks: readonly { label: string; href: string; icon: string }[];
};

const FALLBACK: SiteContactValue = {
  phoneDisplay: CONTACT.phoneDisplay,
  phoneHref: CONTACT.phoneHref,
  whatsappHref: whatsappUrl("Hi, I'd like to book a consultation with Dr. Doaa Samy."),
  socialLinks: SOCIAL_LINKS,
};

const SiteContactContext = createContext<SiteContactValue>(FALLBACK);

/**
 * The CMS-resolved phone/WhatsApp/social values, already fetched once per
 * request in each root layout for SiteHeader/SiteFooter/FloatingContactButtons
 * — this just makes that same data reachable from client components nested
 * arbitrarily deep (like HeroContactPanel, which HeroSection renders on
 * every page) without threading it through every page.tsx as props.
 */
export function SiteContactProvider({ value, children }: { value: SiteContactValue; children: React.ReactNode }) {
  return <SiteContactContext.Provider value={value}>{children}</SiteContactContext.Provider>;
}

export function useSiteContact(): SiteContactValue {
  return useContext(SiteContactContext);
}
