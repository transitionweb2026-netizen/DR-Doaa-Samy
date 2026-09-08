/**
 * Locale-aware path helpers — deliberately NOT "use client" (unlike
 * LocaleContext.tsx, which re-exports these for existing component
 * imports) so server-side CMS readers (lib/cms/*) can use them too. CMS
 * URL fields (hero CTAs, nav_items.href, booking-prompt links, ...) are
 * stored once, untranslated, exactly like the rest of the schema's
 * "shared structural columns" — the /ar prefix is applied at read time,
 * not stored per locale.
 */
export type UiLocale = "en" | "ar";

/**
 * Prefixes an English-tree path with /ar when the locale is Arabic.
 * Passes through anything that isn't an internal absolute path (hash
 * anchors like "#contact-heading", "mailto:", "tel:", external URLs) —
 * those have no /ar equivalent and must never be rewritten.
 */
export function localizedHref(locale: UiLocale, rawPath: string): string {
  // CMS-authored URL fields have occasionally picked up stray leading/
  // trailing whitespace (e.g. a copy-pasted "/contact ") — harmless-looking
  // in an admin text field, but a browser percent-encodes that space, and
  // no route matches "/contact%20". Trimmed once here, for every caller.
  const path = rawPath?.trim() ?? rawPath;
  if (locale === "en" || !path) return path;
  if (!path.startsWith("/")) return path;
  if (path === "/") return "/ar";
  if (path === "/ar" || path.startsWith("/ar/")) return path; // already localized
  return `/ar${path}`;
}
