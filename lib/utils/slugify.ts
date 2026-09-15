/**
 * Normalizes free-typed text into a URL-safe slug: lowercase, hyphenated,
 * no spaces or punctuation. Used on the admin's slug-type fields so a typo
 * (or pasting a title instead of a slug) can't silently save a value that
 * breaks the page it's meant to route to — a percent-encoded space in a
 * dynamic route segment doesn't match a plain-text stored slug.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
