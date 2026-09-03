"use client";

import { createContext, useContext } from "react";

export type UiLocale = "en" | "ar";

const LocaleContext = createContext<UiLocale>("en");

/**
 * Mounted once per root layout ((marketing) → "en", app/ar → "ar") so any
 * client component anywhere in that tree — including ones deep inside
 * modals/cards with no direct prop path from the page — can read the
 * current language via `useLocale()` without prop-drilling.
 */
export function LocaleProvider({ locale, children }: { locale: UiLocale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): UiLocale {
  return useContext(LocaleContext);
}

/**
 * Prefixes an English-tree path (e.g. "/contact", "/articles/foo", "/")
 * with /ar when the current locale is Arabic — the single source of truth
 * every hardcoded internal href in shared components should route through,
 * so a link inside a modal/card never silently drops the visitor back into
 * the English tree.
 */
export function localizedHref(locale: UiLocale, path: string): string {
  if (locale === "en") return path;
  if (path === "/") return "/ar";
  if (path.startsWith("/ar")) return path; // already localized
  return `/ar${path}`;
}
