import { getSectionFields } from "./fields";
import type { Locale } from "./types";
import type { AboutMessageContent } from "@/lib/types/content";

export async function getAboutMessageContent(
  pageSlug: string,
  locale: Locale,
  fallback: AboutMessageContent,
): Promise<AboutMessageContent> {
  const fields = await getSectionFields(pageSlug, "message", locale);
  if (!fields) return fallback;

  return {
    eyebrow: asString(fields.eyebrow, fallback.eyebrow),
    quote: asString(fields.quote, fallback.quote),
    paragraphs: asStringArray(fields.paragraphs, fallback.paragraphs),
    signatureName: asString(fields.signature_name, fallback.signatureName),
    signatureTitle: asString(fields.signature_title, fallback.signatureTitle),
  };
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value) && value.length > 0 ? (value as string[]) : fallback;
}
