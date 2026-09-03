/**
 * Formats an ISO date string (e.g. "2026-05-14") as "May 14, 2026" (or the
 * Arabic equivalent, always on the Gregorian calendar — "ar" alone can
 * default to Hijri in some ICU builds, which would silently show the wrong
 * date). `new Date("2026-05-14")` parses as UTC midnight — pinning
 * `timeZone: "UTC"` keeps the displayed calendar day identical no matter
 * which timezone the rendering server happens to run in.
 */
export function formatDate(iso: string, locale: "en" | "ar" = "en") {
  return new Date(iso).toLocaleDateString(locale === "ar" ? "ar-EG-u-ca-gregory" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
