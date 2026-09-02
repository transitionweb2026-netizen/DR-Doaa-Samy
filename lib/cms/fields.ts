import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Locale } from "./types";

/**
 * Reads every field value for one page section, keyed by field `key`.
 * Falls back English→field-missing-in-Arabic automatically (an untranslated
 * Arabic field silently shows the English copy rather than going blank),
 * and returns `null` entirely when Supabase isn't configured or the
 * section has no rows yet — callers merge that with their local-data
 * default via `withFieldFallback`.
 */
export async function getSectionFields(
  pageSlug: string,
  sectionKey: string,
  locale: Locale,
): Promise<Record<string, unknown> | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .select(
      `key, is_enabled,
       fields:fields ( key,
         field_values:field_values ( locale, value )
       ),
       page:pages!inner ( slug )`,
    )
    .eq("page.slug", pageSlug)
    .eq("key", sectionKey)
    .maybeSingle();

  if (error || !data || !data.is_enabled) return null;

  const result: Record<string, unknown> = {};
  for (const field of data.fields ?? []) {
    const values = field.field_values ?? [];
    const localized = values.find((v) => v.locale === locale && v.value !== null);
    const english = values.find((v) => v.locale === "en" && v.value !== null);
    const chosen = localized ?? english;
    if (chosen) result[field.key] = chosen.value;
  }
  return result;
}

/**
 * Merges a CMS field record over a local-data default of the same shape.
 * Any key CMS didn't return (not yet configured, field not created, or the
 * whole section missing) keeps its default value — so a partially-filled
 * CMS section never blanks out fields the admin hasn't touched yet.
 */
export function withFieldFallback<T extends Record<string, unknown>>(
  cmsFields: Record<string, unknown> | null,
  fallback: T,
): T {
  if (!cmsFields) return fallback;
  const merged = { ...fallback };
  for (const key of Object.keys(fallback)) {
    if (key in cmsFields && cmsFields[key] !== undefined && cmsFields[key] !== null) {
      (merged as Record<string, unknown>)[key] = cmsFields[key];
    }
  }
  return merged;
}
