"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/cms/types";

export type FieldValueInput = { fieldId: string; locale: Locale; value: unknown };

/**
 * Bulk-saves every field value on a section's editor form in one request.
 * `value: null` clears that locale back to "inherit from English" instead
 * of deleting the row (an empty string is a real value; null is "unset").
 */
export async function saveSectionFields(values: FieldValueInput[]) {
  if (values.length === 0) return { ok: true };

  const supabase = await createClient();
  const rows = values.map((v) => ({ field_id: v.fieldId, locale: v.locale, value: v.value }));

  const { error } = await supabase.from("field_values").upsert(rows, { onConflict: "field_id,locale" });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function toggleSectionEnabled(sectionId: string, isEnabled: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("sections").update({ is_enabled: isEnabled }).eq("id", sectionId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function togglePagePublished(pageId: string, isPublished: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("pages").update({ is_published: isPublished }).eq("id", pageId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}
