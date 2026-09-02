import { getSectionFields, withFieldFallback } from "./fields";
import type { Locale } from "./types";
import type { FinalCtaContent } from "@/lib/types/content";

export async function getFinalCtaContent(
  pageSlug: string,
  locale: Locale,
  fallback: FinalCtaContent,
): Promise<FinalCtaContent> {
  const fields = await getSectionFields(pageSlug, "final_cta", locale);
  return withFieldFallback(fields, fallback as unknown as Record<string, unknown>) as unknown as FinalCtaContent;
}
