/**
 * Locale-aware path helpers — deliberately NOT "use client" (unlike
 * LocaleContext.tsx, which re-exports these for existing component
 * imports) so server-side CMS readers (lib/cms/*) can use them too. CMS
 * URL fields (hero CTAs, nav_items.href, booking-prompt links, ...) are
 * stored once, untranslated (Arabic-native, since Arabic is the default
 * locale served at the bare root), exactly like the rest of the schema's
 * "shared structural columns" — the /en prefix is applied at read time,
 * not stored per locale.
 */
export type UiLocale = "en" | "ar";

/**
 * Prefixes an Arabic-tree (native) path with /en when the locale is
 * English. Arabic is the default locale served at the bare domain root,
 * so every CMS-stored URL field is authored "Arabic-native" (bare), and
 * this adds /en only for the English mirror. Passes through anything
 * that isn't an internal absolute path (hash anchors like
 * "#contact-heading", "mailto:", "tel:", external URLs) — those have no
 * /en equivalent and must never be rewritten.
 */
export function localizedHref(locale: UiLocale, rawPath: string): string {
  // CMS-authored URL fields have occasionally picked up stray leading/
  // trailing whitespace (e.g. a copy-pasted "/contact ") — harmless-looking
  // in an admin text field, but a browser percent-encodes that space, and
  // no route matches "/contact%20". Trimmed once here, for every caller.
  const path = rawPath?.trim() ?? rawPath;
  if (locale === "ar" || !path) return path;
  if (!path.startsWith("/")) return path;
  if (path === "/") return "/en";
  if (path === "/en" || path.startsWith("/en/")) return path; // already localized
  return `/en${path}`;
}
