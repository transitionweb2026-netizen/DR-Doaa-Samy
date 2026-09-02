import { getSectionFields, withFieldFallback } from "./fields";
import type { Locale } from "./types";

/**
 * The small eyebrow/heading/description bundle that sits above almost every
 * repeatable-collection section (Cases, Reviews, FAQ, ...) — kept separate
 * from the collection itself since the two are independently editable.
 */
export type SectionCopy = { eyebrow?: string; heading?: string; description?: string };

export async function getSectionCopy(
  pageSlug: string,
  sectionKey: string,
  locale: Locale,
  fallback: SectionCopy,
): Promise<SectionCopy> {
  const fields = await getSectionFields(pageSlug, sectionKey, locale);
  return withFieldFallback(fields, fallback as Record<string, unknown>) as SectionCopy;
}
