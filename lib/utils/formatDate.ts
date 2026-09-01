/**
 * Formats an ISO date string (e.g. "2026-05-14") as "May 14, 2026".
 * `new Date("2026-05-14")` parses as UTC midnight — pinning `timeZone: "UTC"`
 * here keeps the displayed calendar day identical no matter which timezone
 * the rendering server happens to run in.
 */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
