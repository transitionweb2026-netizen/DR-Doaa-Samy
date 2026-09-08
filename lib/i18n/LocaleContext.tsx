"use client";

import { createContext, useContext } from "react";
import { localizedHref, type UiLocale } from "./paths";

// Re-exported so every existing `import { useLocale, localizedHref } from
// "@/lib/i18n/LocaleContext"` across the component tree keeps working
// unchanged — the actual implementation lives in paths.ts (no "use client",
// so lib/cms/* server code can use it too) and this file owns the Context.
export type { UiLocale };
export { localizedHref };

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
