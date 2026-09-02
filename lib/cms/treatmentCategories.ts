import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { toImageAsset, type MediaRow } from "./media";
import { getTreatmentsByCategory } from "./collections";
import type { Locale } from "./types";
import type { TreatmentCategory } from "@/lib/types/content";

/**
 * Full Services catalogue: every enabled category with its treatments
 * nested inline, matching the local data shape exactly. `id` is the
 * category's `key` column (not its UUID) — it doubles as the #hash anchor
 * CategoryCard/TreatmentCategorySection jump to, so it has to stay a
 * short, stable slug the same way the local data's `id: "hair"` does.
 */
export async function getTreatmentCategories(locale: Locale, fallback: TreatmentCategory[]): Promise<TreatmentCategory[]> {
  if (!isSupabaseConfigured) return fallback;

  const supabase = await createClient();
  const { data } = await supabase
    .from("treatment_categories")
    .select("*, image:media!treatment_categories_image_id_fkey(id, bucket, storage_path, alt_text, ar_alt_text)")
    .eq("is_enabled", true)
    .order("sort_order", { ascending: true });
  if (!data || data.length === 0) return fallback;

  const categories = await Promise.all(
    data.map(async (row): Promise<TreatmentCategory> => {
      const localMatch = fallback.find((f) => f.id === row.key);
      const treatments = await getTreatmentsByCategory(row.key, locale, localMatch?.treatments ?? []);
      return {
        id: row.key,
        title: locale === "ar" ? row.ar_title || row.title : row.title,
        cardLabel: locale === "ar" ? row.ar_card_label || row.card_label : row.card_label,
        description: locale === "ar" ? row.ar_description || row.description : row.description,
        image: toImageAsset(row.image as MediaRow, locale, row.title),
        treatments,
      };
    }),
  );
  return categories;
}
