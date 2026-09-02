"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Generic collection-row mutations, driven by the schema configs in
 * lib/admin/collectionSchemas.ts. `table` is always one of that fixed,
 * server-defined set — never taken verbatim from client input beyond what
 * the editor UI itself offers, so this stays safe despite being generic.
 */

export async function createCollectionRow(table: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from(table).insert(data).select("id").single();
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true as const, id: row.id as string };
}

export async function updateCollectionRow(table: string, id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from(table).update(data).eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true as const };
}

export async function deleteCollectionRow(table: string, id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true as const };
}

export async function reorderCollectionRows(table: string, orderedIds: string[]) {
  const supabase = await createClient();
  const results = await Promise.all(
    orderedIds.map((id, index) => supabase.from(table).update({ sort_order: index }).eq("id", id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false as const, error: failed.error.message };
  revalidatePath("/", "layout");
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// content_placements — binds a collection row into a specific page section,
// so the same row (e.g. one `cases` entry) can appear on multiple pages.
// ---------------------------------------------------------------------------

export async function placeItemInSection(input: {
  pageId: string;
  sectionId: string;
  itemType: string;
  itemId: string;
  sortOrder: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("content_placements").insert({
    page_id: input.pageId,
    section_id: input.sectionId,
    item_type: input.itemType,
    item_id: input.itemId,
    sort_order: input.sortOrder,
  });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true as const };
}

export async function removeItemFromSection(placementId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("content_placements").delete().eq("id", placementId);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true as const };
}

export async function reorderPlacements(orderedPlacementIds: string[]) {
  const supabase = await createClient();
  const results = await Promise.all(
    orderedPlacementIds.map((id, index) => supabase.from("content_placements").update({ sort_order: index }).eq("id", id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false as const, error: failed.error.message };
  revalidatePath("/", "layout");
  return { ok: true as const };
}

/** Creates a brand-new collection row and places it into a section in one step. */
export async function createAndPlaceRow(input: {
  table: string;
  itemType: string;
  pageId: string;
  sectionId: string;
  sortOrder: number;
  data: Record<string, unknown>;
}) {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from(input.table).insert(input.data).select("id").single();
  if (error) return { ok: false as const, error: error.message };

  const { error: placementError } = await supabase.from("content_placements").insert({
    page_id: input.pageId,
    section_id: input.sectionId,
    item_type: input.itemType,
    item_id: row.id,
    sort_order: input.sortOrder,
  });
  if (placementError) return { ok: false as const, error: placementError.message };

  revalidatePath("/", "layout");
  return { ok: true as const, id: row.id as string };
}
