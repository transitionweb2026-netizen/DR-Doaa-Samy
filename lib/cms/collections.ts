import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { toImageAsset, type MediaRow } from "./media";
import type { Locale } from "./types";
import type {
  CaseItem,
  CredentialItem,
  FaqItem,
  JourneyStep,
  ReviewItem,
  ServiceItem,
  StatItem,
  Treatment,
  VideoItem,
  WhyPoint,
} from "@/lib/types/content";

type ItemType =
  | "services"
  | "treatments"
  | "cases"
  | "reviews"
  | "videos"
  | "faq_items"
  | "credentials"
  | "why_points"
  | "journey_steps"
  | "stats"
  | "articles";

/**
 * content_placements links a collection row to a page section by a
 * polymorphic (item_type, item_id) pair, which PostgREST can't join through
 * automatically — so this resolves the ordered id list first, then callers
 * fetch the actual rows from the target table and re-sort to match.
 */
async function getPlacements(pageSlug: string, sectionKey: string, itemType: ItemType) {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_placements")
    .select("item_id, is_featured, sort_order, section:sections!inner(key, is_enabled, page:pages!inner(slug))")
    .eq("item_type", itemType)
    .eq("section.key", sectionKey)
    .eq("section.page.slug", pageSlug)
    .order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return null;
  return data as unknown as { item_id: string; is_featured: boolean; sort_order: number }[];
}

/** Re-sorts `rows` (any shape with an `id`) to match the placement order. */
function orderByPlacement<T extends { id: string }>(rows: T[], placements: { item_id: string }[]): T[] {
  const byId = new Map(rows.map((r) => [r.id, r]));
  return placements.map((p) => byId.get(p.item_id)).filter((r): r is T => Boolean(r));
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------
export async function getStats(pageSlug: string, sectionKey: string, locale: Locale, fallback: StatItem[]) {
  const placements = await getPlacements(pageSlug, sectionKey, "stats");
  if (!placements) return fallback;
  const supabase = await createClient();
  const { data } = await supabase
    .from("stats")
    .select("*")
    .in(
      "id",
      placements.map((p) => p.item_id),
    );
  if (!data) return fallback;
  const mapped: StatItem[] = data.map((row) => ({
    id: row.id,
    value: row.value,
    suffix: locale === "ar" ? row.ar_suffix || row.suffix : row.suffix,
    label: locale === "ar" ? row.ar_label || row.label : row.label,
    emphasis: row.emphasis as StatItem["emphasis"],
  }));
  return orderByPlacement(mapped, placements);
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export async function getServices(pageSlug: string, sectionKey: string, locale: Locale, fallback: ServiceItem[]) {
  const placements = await getPlacements(pageSlug, sectionKey, "services");
  if (!placements) return fallback;
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*, image:media!services_image_id_fkey(id, bucket, storage_path, alt_text, ar_alt_text)")
    .in(
      "id",
      placements.map((p) => p.item_id),
    );
  if (!data) return fallback;
  const mapped: ServiceItem[] = data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: locale === "ar" ? row.ar_name || row.name : row.name,
    shortLabel: locale === "ar" ? row.ar_short_label || row.short_label : row.short_label,
    image: toImageAsset(row.image as MediaRow, locale, row.name),
    summary: locale === "ar" ? row.ar_summary || row.summary : row.summary,
    description: locale === "ar" ? row.ar_description || row.description : row.description,
    benefits: (locale === "ar" && row.ar_benefits?.length ? row.ar_benefits : row.benefits) ?? [],
    suitableFor: (locale === "ar" && row.ar_suitable_for?.length ? row.ar_suitable_for : row.suitable_for) ?? [],
    sessionInfo: locale === "ar" ? row.ar_session_info || row.session_info : row.session_info,
  }));
  return orderByPlacement(mapped, placements);
}

// ---------------------------------------------------------------------------
// Cases
// ---------------------------------------------------------------------------
export async function getCases(pageSlug: string, sectionKey: string, locale: Locale, fallback: CaseItem[]) {
  const placements = await getPlacements(pageSlug, sectionKey, "cases");
  if (!placements) return fallback;
  const supabase = await createClient();
  const { data } = await supabase
    .from("cases")
    .select(
      "*, before:media!cases_before_image_id_fkey(id, bucket, storage_path, alt_text, ar_alt_text), after:media!cases_after_image_id_fkey(id, bucket, storage_path, alt_text, ar_alt_text)",
    )
    .in(
      "id",
      placements.map((p) => p.item_id),
    );
  if (!data) return fallback;
  const mapped: CaseItem[] = data.map((row) => ({
    id: row.id,
    title: locale === "ar" ? row.ar_title || row.title : row.title,
    concern: locale === "ar" ? row.ar_concern || row.concern : row.concern,
    treatment: locale === "ar" ? row.ar_treatment || row.treatment : row.treatment,
    result: locale === "ar" ? row.ar_result || row.result : row.result,
    story: locale === "ar" ? row.ar_story || row.story : row.story,
    before: toImageAsset(row.before as MediaRow, locale, "Before treatment"),
    after: toImageAsset(row.after as MediaRow, locale, "After treatment"),
  }));
  return orderByPlacement(mapped, placements);
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------
export async function getReviews(pageSlug: string, sectionKey: string, locale: Locale, fallback: ReviewItem[]) {
  const placements = await getPlacements(pageSlug, sectionKey, "reviews");
  if (!placements) return fallback;
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .in(
      "id",
      placements.map((p) => p.item_id),
    );
  if (!data) return fallback;
  const mapped: ReviewItem[] = data.map((row) => ({
    id: row.id,
    name: locale === "ar" ? row.ar_name || row.name : row.name,
    initials: row.initials,
    rating: row.rating,
    quote: locale === "ar" ? row.ar_quote || row.quote : row.quote,
    treatment: (locale === "ar" ? row.ar_treatment || row.treatment : row.treatment) ?? undefined,
  }));
  return orderByPlacement(mapped, placements);
}

// ---------------------------------------------------------------------------
// Videos
// ---------------------------------------------------------------------------
export async function getVideos(pageSlug: string, sectionKey: string, locale: Locale, fallback: VideoItem[]) {
  const placements = await getPlacements(pageSlug, sectionKey, "videos");
  if (!placements) return fallback;
  const supabase = await createClient();
  const { data } = await supabase
    .from("videos")
    .select("*, thumbnail:media!videos_thumbnail_id_fkey(id, bucket, storage_path, alt_text, ar_alt_text)")
    .in(
      "id",
      placements.map((p) => p.item_id),
    );
  if (!data) return fallback;
  const mapped: VideoItem[] = data.map((row) => ({
    id: row.id,
    title: locale === "ar" ? row.ar_title || row.title : row.title,
    category: locale === "ar" ? row.ar_category || row.category : row.category,
    thumbnail: toImageAsset(row.thumbnail as MediaRow, locale, row.title),
    durationLabel: row.duration_label ?? undefined,
    description: (locale === "ar" ? row.ar_description || row.description : row.description) ?? undefined,
    videoUrl: row.video_url ?? undefined,
  }));
  return orderByPlacement(mapped, placements);
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
export async function getFaqItems(pageSlug: string, sectionKey: string, locale: Locale, fallback: FaqItem[]) {
  const placements = await getPlacements(pageSlug, sectionKey, "faq_items");
  if (!placements) return fallback;
  const supabase = await createClient();
  const { data } = await supabase
    .from("faq_items")
    .select("*")
    .in(
      "id",
      placements.map((p) => p.item_id),
    );
  if (!data) return fallback;
  const mapped: FaqItem[] = data.map((row) => ({
    id: row.id,
    question: locale === "ar" ? row.ar_question || row.question : row.question,
    answer: locale === "ar" ? row.ar_answer || row.answer : row.answer,
  }));
  return orderByPlacement(mapped, placements);
}

// ---------------------------------------------------------------------------
// Why points
// ---------------------------------------------------------------------------
export async function getWhyPoints(pageSlug: string, sectionKey: string, locale: Locale, fallback: WhyPoint[]) {
  const placements = await getPlacements(pageSlug, sectionKey, "why_points");
  if (!placements) return fallback;
  const supabase = await createClient();
  const { data } = await supabase
    .from("why_points")
    .select("*")
    .in(
      "id",
      placements.map((p) => p.item_id),
    );
  if (!data) return fallback;
  const mapped: WhyPoint[] = data.map((row) => ({
    id: row.id,
    title: locale === "ar" ? row.ar_title || row.title : row.title,
    description: locale === "ar" ? row.ar_description || row.description : row.description,
  }));
  return orderByPlacement(mapped, placements);
}

// ---------------------------------------------------------------------------
// Journey steps
// ---------------------------------------------------------------------------
export async function getJourneySteps(pageSlug: string, sectionKey: string, locale: Locale, fallback: JourneyStep[]) {
  const placements = await getPlacements(pageSlug, sectionKey, "journey_steps");
  if (!placements) return fallback;
  const supabase = await createClient();
  const { data } = await supabase
    .from("journey_steps")
    .select("*")
    .in(
      "id",
      placements.map((p) => p.item_id),
    );
  if (!data) return fallback;
  const mapped: JourneyStep[] = data.map((row) => ({
    id: row.id,
    index: row.index_label,
    title: locale === "ar" ? row.ar_title || row.title : row.title,
    description: locale === "ar" ? row.ar_description || row.description : row.description,
  }));
  return orderByPlacement(mapped, placements);
}

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------
export async function getCredentials(pageSlug: string, sectionKey: string, locale: Locale, fallback: CredentialItem[]) {
  const placements = await getPlacements(pageSlug, sectionKey, "credentials");
  if (!placements) return fallback;
  const supabase = await createClient();
  const { data } = await supabase
    .from("credentials")
    .select("*")
    .in(
      "id",
      placements.map((p) => p.item_id),
    );
  if (!data) return fallback;
  const mapped: CredentialItem[] = data.map((row) => ({
    id: row.id,
    category: row.category as CredentialItem["category"],
    period: locale === "ar" ? row.ar_period || row.period : row.period,
    title: locale === "ar" ? row.ar_title || row.title : row.title,
    institution: locale === "ar" ? row.ar_institution || row.institution : row.institution,
    description: locale === "ar" ? row.ar_description || row.description : row.description,
  }));
  return orderByPlacement(mapped, placements);
}

// ---------------------------------------------------------------------------
// Treatments (by category key, for the Services page)
// ---------------------------------------------------------------------------
export async function getTreatmentsByCategory(categoryKey: string, locale: Locale, fallback: Treatment[]) {
  if (!isSupabaseConfigured) return fallback;
  const supabase = await createClient();
  const { data } = await supabase
    .from("treatments")
    .select("*, image:media!treatments_image_id_fkey(id, bucket, storage_path, alt_text, ar_alt_text), category:treatment_categories!inner(key)")
    .eq("category.key", categoryKey)
    .eq("is_enabled", true)
    .order("sort_order", { ascending: true });
  if (!data || data.length === 0) return fallback;
  return data.map(
    (row): Treatment => ({
      id: row.id,
      slug: row.slug,
      name: locale === "ar" ? row.ar_name || row.name : row.name,
      shortDescription: locale === "ar" ? row.ar_short_description || row.short_description : row.short_description,
      image: toImageAsset(row.image as MediaRow, locale, row.name),
      whatIsIt: locale === "ar" ? row.ar_what_is_it || row.what_is_it : row.what_is_it,
      commonConcerns: (locale === "ar" && row.ar_common_concerns?.length ? row.ar_common_concerns : row.common_concerns) ?? [],
      approach: locale === "ar" ? row.ar_approach || row.approach : row.approach,
      treatmentOptions:
        (locale === "ar" && row.ar_treatment_options?.length ? row.ar_treatment_options : row.treatment_options) ?? [],
      journey: locale === "ar" ? row.ar_journey || row.journey : row.journey,
      notes: locale === "ar" ? row.ar_notes || row.notes : row.notes,
      bookingLabel: locale === "ar" ? row.ar_booking_label || row.booking_label : row.booking_label,
    }),
  );
}
