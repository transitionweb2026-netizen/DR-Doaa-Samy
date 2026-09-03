/**
 * Populates a connected Supabase project with the site's existing English
 * placeholder content AND its Arabic counterpart, so the CMS starts
 * pre-filled in both languages instead of empty (or English-only, which
 * would make every Arabic field silently fall back to English on the live
 * site — see lib/cms/fields.ts's English-fallback behavior).
 *
 * Safe to re-run: every row is upserted by a natural key derived from the
 * ENGLISH content only (page slug, section key, field key, item
 * slug/title/question/...), so re-running after editing local data just
 * updates the matching rows (both locales) in place rather than
 * duplicating them — this is also why English and Arabic content are
 * always seeded together, in the same call, keyed off the same English
 * value: there's no other stable id shared between the two data trees.
 *
 * Usage:  npm run cms:seed
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */

// Not lib/supabase/service-role.ts: that module `import "server-only"`,
// which throws unconditionally outside of Next's build (it's normally
// stripped to a no-op by Next's bundler) — this script runs under plain
// tsx, so it builds the same service-role client directly instead.
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// English content
// ---------------------------------------------------------------------------
import { heroContent } from "../data/home/hero";
import { statsContent } from "../data/home/stats";
import { doctorIntroContent } from "../data/home/doctor-intro";
import { featuredServices } from "../data/home/services";
import { casesContent as homeCases } from "../data/home/cases";
import { whyDoctorPoints } from "../data/home/why-doctor";
import { journeySteps } from "../data/home/journey";
import { reviewsContent as homeReviews } from "../data/home/reviews";
import { faqContent as homeFaq } from "../data/home/faq";
import { finalCtaContent as homeFinalCta } from "../data/home/final-cta";
import { videoCatalogue } from "../data/videos/catalogue";

import { aboutHeroContent } from "../data/about/hero";
import { aboutIntroVideoContent } from "../data/about/intro-video";
import { aboutMessageContent } from "../data/about/message";
import { credentials as experienceContent } from "../data/about/experience";
import { keyTreatmentAreas } from "../data/about/treatments";
import { treatmentCategories } from "../data/services/categories";
import { aboutFeaturedCases as aboutCases } from "../data/about/cases";
import { aboutFinalCtaContent as aboutFinalCta } from "../data/about/final-cta";

import { servicesFinalCtaContent as servicesFinalCta } from "../data/services/final-cta";

import { patientsHeroContent } from "../data/patients/hero";
import { patientsFaqContent as patientsFaq } from "../data/patients/faq";
import { patientsFinalCtaContent as patientsFinalCta } from "../data/patients/final-cta";

import { videosHeroContent } from "../data/videos/hero";
import { videosFinalCtaContent as videosFinalCta } from "../data/videos/final-cta";

import { articlesHeroContent } from "../data/articles/hero";
import { articleCatalogue } from "../data/articles/catalogue";
import { articlesFinalCtaContent as articlesFinalCta } from "../data/articles/final-cta";

import { contactHeroContent } from "../data/contact/hero";

import { SITE, CONTACT, SOCIAL_LINKS, NAV_ITEMS } from "../lib/constants/site";

// ---------------------------------------------------------------------------
// Arabic content — same structure, same order, same semantic ids/slugs as
// their English counterparts above (this pairing is what lets the loops
// below zip the two together positionally).
// ---------------------------------------------------------------------------
import { heroContentAr } from "../data/ar/home/hero";
import { statsContentAr } from "../data/ar/home/stats";
import { doctorIntroContentAr } from "../data/ar/home/doctor-intro";
import { featuredServicesAr } from "../data/ar/home/services";
import { casesContentAr as homeCasesAr } from "../data/ar/home/cases";
import { whyDoctorPointsAr } from "../data/ar/home/why-doctor";
import { journeyStepsAr } from "../data/ar/home/journey";
import { reviewsContentAr as homeReviewsAr } from "../data/ar/home/reviews";
import { faqContentAr as homeFaqAr } from "../data/ar/home/faq";
import { finalCtaContentAr as homeFinalCtaAr } from "../data/ar/home/final-cta";
import { videoCatalogueAr } from "../data/ar/videos/catalogue";

import { aboutHeroContentAr } from "../data/ar/about/hero";
import { aboutIntroVideoContentAr } from "../data/ar/about/intro-video";
import { aboutMessageContentAr } from "../data/ar/about/message";
import { credentialsAr as experienceContentAr } from "../data/ar/about/experience";
import { keyTreatmentAreasAr } from "../data/ar/about/treatments";
import { treatmentCategoriesAr } from "../data/ar/services/categories";
import { aboutFeaturedCasesAr as aboutCasesAr } from "../data/ar/about/cases";
import { aboutFinalCtaContentAr as aboutFinalCtaAr } from "../data/ar/about/final-cta";

import { servicesFinalCtaContentAr as servicesFinalCtaAr } from "../data/ar/services/final-cta";

import { patientsHeroContentAr } from "../data/ar/patients/hero";
import { patientsFaqContentAr as patientsFaqAr } from "../data/ar/patients/faq";
import { patientsFinalCtaContentAr as patientsFinalCtaAr } from "../data/ar/patients/final-cta";

import { videosHeroContentAr } from "../data/ar/videos/hero";
import { videosFinalCtaContentAr as videosFinalCtaAr } from "../data/ar/videos/final-cta";

import { articlesHeroContentAr } from "../data/ar/articles/hero";
import { articleCatalogueAr } from "../data/ar/articles/catalogue";
import { articlesFinalCtaContentAr as articlesFinalCtaAr } from "../data/ar/articles/final-cta";

import { contactHeroContentAr } from "../data/ar/contact/hero";

import { homeSectionCopyAr, aboutSectionCopyAr, servicesSectionCopyAr, patientsSectionCopyAr, videosSectionCopyAr, contactSectionCopyAr } from "../data/ar/sectionCopy";
import { SITE_AR, NAV_ITEMS_AR, SOCIAL_LINKS_AR, FOOTER_BLURB_AR } from "../lib/constants/site.ar";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Copy .env.example to .env.local, fill in your Supabase project's values, and re-run `npm run cms:seed`.",
  );
  process.exit(1);
}

const admin = createSupabaseClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------------------------------------------------------------------------
// Generic upsert-by-natural-key helpers
// ---------------------------------------------------------------------------

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Retries a transient "fetch failed" (network blip) a couple of times before giving up. */
async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await sleep(500 * (i + 1));
    }
  }
  throw lastErr;
}

async function upsertRow(
  table: string,
  match: Record<string, unknown>,
  data: Record<string, unknown>,
): Promise<string> {
  return withRetry(async () => {
    let query = admin.from(table).select("id");
    for (const [col, val] of Object.entries(match)) query = query.eq(col, val as never);
    const { data: existing, error: findError } = await query.maybeSingle();
    if (findError) throw new Error(`${table} lookup failed: ${findError.message}`);

    if (existing) {
      const { error } = await admin.from(table).update(data).eq("id", existing.id);
      if (error) throw new Error(`${table} update failed: ${error.message}`);
      return existing.id as string;
    }

    const { data: inserted, error } = await admin
      .from(table)
      .insert({ ...match, ...data })
      .select("id")
      .single();
    if (error) throw new Error(`${table} insert failed: ${error.message}`);
    return inserted.id as string;
  });
}

async function upsertPage(slug: string, name: string, route: string, sortOrder: number) {
  return upsertRow("pages", { slug }, { name, route, sort_order: sortOrder, is_published: true });
}

async function upsertSection(pageId: string, key: string, name: string, sortOrder: number) {
  return upsertRow("sections", { page_id: pageId, key }, { name, sort_order: sortOrder, is_enabled: true });
}

type FieldType = "text" | "textarea" | "richtext" | "image" | "url" | "number" | "boolean" | "list";
type FieldSpec = { key: string; label: string; type: FieldType; translatable?: boolean; valueEn: unknown; valueAr?: unknown };

/** Upserts one field's EN value (always) and AR value (when given and the field is translatable). */
async function upsertField(sectionId: string, spec: FieldSpec, sortOrder: number) {
  const translatable = spec.translatable ?? true;
  const fieldId = await upsertRow(
    "fields",
    { section_id: sectionId, key: spec.key },
    { label: spec.label, field_type: spec.type, is_translatable: translatable, sort_order: sortOrder },
  );
  const { error: enError } = await admin
    .from("field_values")
    .upsert({ field_id: fieldId, locale: "en", value: spec.valueEn }, { onConflict: "field_id,locale" });
  if (enError) throw new Error(`field_values (en) upsert failed for ${spec.key}: ${enError.message}`);

  if (translatable && spec.valueAr !== undefined) {
    const { error: arError } = await admin
      .from("field_values")
      .upsert({ field_id: fieldId, locale: "ar", value: spec.valueAr }, { onConflict: "field_id,locale" });
    if (arError) throw new Error(`field_values (ar) upsert failed for ${spec.key}: ${arError.message}`);
  }
  return fieldId;
}

async function placeItem(pageId: string, sectionId: string, itemType: string, itemId: string, sortOrder: number) {
  const { error } = await admin
    .from("content_placements")
    .upsert(
      { page_id: pageId, section_id: sectionId, item_type: itemType, item_id: itemId, sort_order: sortOrder },
      { onConflict: "section_id,item_type,item_id" },
    );
  if (error) throw new Error(`content_placements upsert failed: ${error.message}`);
}

// A section made only of scalar fields — the common case (Hero, Final CTA,
// section eyebrow/heading/description bundles). Sequential, not
// Promise.all — this sandbox's network drops requests under heavy fan-out.
async function seedScalarSection(pageId: string, key: string, name: string, sortOrder: number, fields: FieldSpec[]) {
  const sectionId = await upsertSection(pageId, key, name, sortOrder);
  for (let i = 0; i < fields.length; i++) {
    await upsertField(sectionId, fields[i], i);
  }
  return sectionId;
}

async function seedHeroSection(pageId: string, sortOrder: number, en: typeof heroContent, ar: typeof heroContentAr) {
  return seedScalarSection(pageId, "hero", "Hero", sortOrder, [
    { key: "eyebrow", label: "Eyebrow", type: "text", valueEn: en.eyebrow, valueAr: ar.eyebrow },
    { key: "name", label: "Name", type: "text", valueEn: en.name, valueAr: ar.name },
    { key: "role", label: "Role", type: "text", valueEn: en.role, valueAr: ar.role },
    { key: "headline", label: "Headline", type: "text", valueEn: en.headline, valueAr: ar.headline },
    { key: "description", label: "Description", type: "textarea", valueEn: en.description, valueAr: ar.description },
    { key: "primary_cta_label", label: "Primary button label", type: "text", valueEn: en.primaryCta.label, valueAr: ar.primaryCta.label },
    { key: "primary_cta_href", label: "Primary button link", type: "url", translatable: false, valueEn: en.primaryCta.href },
    { key: "secondary_cta_label", label: "Secondary button label", type: "text", valueEn: en.secondaryCta.label, valueAr: ar.secondaryCta.label },
    { key: "secondary_cta_href", label: "Secondary button link", type: "url", translatable: false, valueEn: en.secondaryCta.href },
    { key: "portrait_media_id", label: "Portrait image", type: "image", translatable: false, valueEn: "" },
  ]);
}

type FinalCta = { eyebrow: string; heading: string; description: string; whatsappLabel: string; contactLabel: string };

async function seedFinalCtaSection(pageId: string, sortOrder: number, en: FinalCta, ar: FinalCta) {
  // Field keys intentionally match FinalCtaContent's own camelCase property
  // names — lib/cms/finalCta.ts merges by those exact keys.
  return seedScalarSection(pageId, "final_cta", "Final CTA", sortOrder, [
    { key: "eyebrow", label: "Eyebrow", type: "text", valueEn: en.eyebrow, valueAr: ar.eyebrow },
    { key: "heading", label: "Heading", type: "text", valueEn: en.heading, valueAr: ar.heading },
    { key: "description", label: "Description", type: "textarea", valueEn: en.description, valueAr: ar.description },
    { key: "whatsappLabel", label: "WhatsApp button label", type: "text", valueEn: en.whatsappLabel, valueAr: ar.whatsappLabel },
    { key: "contactLabel", label: "Contact button label", type: "text", valueEn: en.contactLabel, valueAr: ar.contactLabel },
  ]);
}

type SectionCopy = { eyebrow?: string; heading?: string; description?: string };

async function seedSectionCopy(
  pageId: string,
  key: string,
  name: string,
  sortOrder: number,
  en: SectionCopy,
  ar: SectionCopy = {},
) {
  const fields: FieldSpec[] = [];
  if (en.eyebrow !== undefined) fields.push({ key: "eyebrow", label: "Eyebrow", type: "text", valueEn: en.eyebrow, valueAr: ar.eyebrow });
  if (en.heading !== undefined) fields.push({ key: "heading", label: "Heading", type: "text", valueEn: en.heading, valueAr: ar.heading });
  if (en.description !== undefined)
    fields.push({ key: "description", label: "Description", type: "textarea", valueEn: en.description, valueAr: ar.description });
  return seedScalarSection(pageId, key, name, sortOrder, fields);
}

// ---------------------------------------------------------------------------
// Collections — each helper zips the English and Arabic arrays together
// positionally (they're authored in matching order with matching semantic
// ids), matches/creates the row by its ENGLISH natural key, and writes both
// locales' columns in the same upsert.
// ---------------------------------------------------------------------------

async function seedStats(pageId: string, sectionId: string, en: typeof statsContent, ar: typeof statsContentAr) {
  for (let i = 0; i < en.length; i++) {
    const item = en[i];
    const itemAr = ar[i];
    const id = await upsertRow(
      "stats",
      { label: item.label },
      {
        value: item.value,
        suffix: item.suffix ?? "",
        ar_suffix: itemAr?.suffix ?? "",
        ar_label: itemAr?.label ?? "",
        emphasis: item.emphasis ?? null,
        is_enabled: true,
        sort_order: i,
      },
    );
    await placeItem(pageId, sectionId, "stats", id, i);
  }
}

async function seedServices(pageId: string, sectionId: string, en: typeof featuredServices, ar: typeof featuredServicesAr) {
  for (let i = 0; i < en.length; i++) {
    const item = en[i];
    const itemAr = ar.find((a) => a.slug === item.slug);
    const id = await upsertRow(
      "services",
      { slug: item.slug },
      {
        name: item.name,
        ar_name: itemAr?.name ?? "",
        short_label: item.shortLabel,
        ar_short_label: itemAr?.shortLabel ?? "",
        summary: item.summary,
        ar_summary: itemAr?.summary ?? "",
        description: item.description,
        ar_description: itemAr?.description ?? "",
        benefits: item.benefits,
        ar_benefits: itemAr?.benefits ?? [],
        suitable_for: item.suitableFor,
        ar_suitable_for: itemAr?.suitableFor ?? [],
        session_info: item.sessionInfo,
        ar_session_info: itemAr?.sessionInfo ?? "",
        is_enabled: true,
        sort_order: i,
      },
    );
    await placeItem(pageId, sectionId, "services", id, i);
  }
}

async function seedCases(pageId: string, sectionId: string, en: typeof homeCases, ar: typeof homeCasesAr) {
  for (let i = 0; i < en.length; i++) {
    const item = en[i];
    const itemAr = ar[i];
    const id = await upsertRow(
      "cases",
      { title: item.title },
      {
        concern: item.concern,
        ar_concern: itemAr?.concern ?? "",
        treatment: item.treatment,
        ar_treatment: itemAr?.treatment ?? "",
        result: item.result,
        ar_result: itemAr?.result ?? "",
        story: item.story,
        ar_story: itemAr?.story ?? "",
        ar_title: itemAr?.title ?? "",
        is_enabled: true,
        sort_order: i,
      },
    );
    await placeItem(pageId, sectionId, "cases", id, i);
  }
}

async function seedWhyPoints(pageId: string, sectionId: string, en: typeof whyDoctorPoints, ar: typeof whyDoctorPointsAr) {
  for (let i = 0; i < en.length; i++) {
    const item = en[i];
    const itemAr = ar[i];
    const id = await upsertRow(
      "why_points",
      { title: item.title },
      {
        description: item.description,
        ar_title: itemAr?.title ?? "",
        ar_description: itemAr?.description ?? "",
        is_enabled: true,
        sort_order: i,
      },
    );
    await placeItem(pageId, sectionId, "why_points", id, i);
  }
}

async function seedJourneySteps(pageId: string, sectionId: string, en: typeof journeySteps, ar: typeof journeyStepsAr) {
  for (let i = 0; i < en.length; i++) {
    const item = en[i];
    const itemAr = ar[i];
    const id = await upsertRow(
      "journey_steps",
      { title: item.title },
      {
        index_label: item.index,
        description: item.description,
        ar_title: itemAr?.title ?? "",
        ar_description: itemAr?.description ?? "",
        is_enabled: true,
        sort_order: i,
      },
    );
    await placeItem(pageId, sectionId, "journey_steps", id, i);
  }
}

async function seedReviews(pageId: string, sectionId: string, en: typeof homeReviews, ar: typeof homeReviewsAr) {
  for (let i = 0; i < en.length; i++) {
    const item = en[i];
    const itemAr = ar[i];
    const id = await upsertRow(
      "reviews",
      { name: item.name },
      {
        initials: item.initials,
        rating: item.rating,
        quote: item.quote,
        treatment: item.treatment ?? null,
        ar_name: itemAr?.name ?? "",
        ar_quote: itemAr?.quote ?? "",
        ar_treatment: itemAr?.treatment ?? null,
        is_enabled: true,
        sort_order: i,
      },
    );
    await placeItem(pageId, sectionId, "reviews", id, i);
  }
}

async function seedVideos(pageId: string, sectionId: string, en: typeof videoCatalogue, ar: typeof videoCatalogueAr) {
  const ids: string[] = [];
  for (let i = 0; i < en.length; i++) {
    const item = en[i];
    const itemAr = ar[i];
    const id = await upsertRow(
      "videos",
      { title: item.title },
      {
        category: item.category,
        duration_label: item.durationLabel ?? null,
        description: item.description ?? null,
        video_url: item.videoUrl ?? null,
        ar_title: itemAr?.title ?? "",
        ar_category: itemAr?.category ?? "",
        ar_description: itemAr?.description ?? null,
        is_enabled: true,
        sort_order: i,
      },
    );
    ids.push(id);
    await placeItem(pageId, sectionId, "videos", id, i);
  }
  return ids;
}

async function seedFaq(pageId: string, sectionId: string, en: typeof homeFaq, ar: typeof homeFaqAr) {
  for (let i = 0; i < en.length; i++) {
    const item = en[i];
    const itemAr = ar[i];
    const id = await upsertRow(
      "faq_items",
      { question: item.question },
      {
        answer: item.answer,
        ar_question: itemAr?.question ?? "",
        ar_answer: itemAr?.answer ?? "",
        is_enabled: true,
        sort_order: i,
      },
    );
    await placeItem(pageId, sectionId, "faq_items", id, i);
  }
}

async function seedCredentials(pageId: string, sectionId: string, en: typeof experienceContent, ar: typeof experienceContentAr) {
  for (let i = 0; i < en.length; i++) {
    const item = en[i];
    const itemAr = ar[i];
    const id = await upsertRow(
      "credentials",
      { title: item.title },
      {
        category: item.category,
        period: item.period,
        institution: item.institution,
        description: item.description,
        ar_title: itemAr?.title ?? "",
        ar_period: itemAr?.period ?? "",
        ar_institution: itemAr?.institution ?? "",
        ar_description: itemAr?.description ?? "",
        is_enabled: true,
        sort_order: i,
      },
    );
    await placeItem(pageId, sectionId, "credentials", id, i);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Seeding CMS content (English + Arabic) from local placeholder data...\n");

  // --- Site-wide settings, navigation, social links -------------------------
  await admin.from("site_settings").upsert(
    {
      id: true,
      site_name: SITE.name,
      ar_site_name: SITE_AR.name,
      role_title: SITE.role,
      ar_role_title: SITE_AR.role,
      tagline: SITE.tagline,
      ar_tagline: SITE_AR.tagline,
      phone_display: CONTACT.phoneDisplay,
      phone_href: CONTACT.phoneHref,
      whatsapp_number: CONTACT.whatsappNumber,
      email: CONTACT.email,
      address: CONTACT.addressLine,
      ar_address: "القاهرة، مصر",
      footer_blurb: "Personalized dermatology and aesthetic medicine — precise, modern, and quietly confident.",
      ar_footer_blurb: FOOTER_BLURB_AR,
      copyright_text: `© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.`,
      ar_copyright_text: `© ${new Date().getFullYear()} ${SITE_AR.name}. جميع الحقوق محفوظة.`,
    },
    { onConflict: "id" },
  );
  console.log("✓ Site settings");

  for (let i = 0; i < NAV_ITEMS.length; i++) {
    const item = NAV_ITEMS[i];
    const itemAr = NAV_ITEMS_AR[i];
    await upsertRow(
      "nav_items",
      { location: "header", label: item.label },
      { href: item.href, ar_label: itemAr?.label ?? "", is_enabled: true, sort_order: i },
    );
    await upsertRow(
      "nav_items",
      { location: "footer", label: item.label },
      { href: item.href, ar_label: itemAr?.label ?? "", is_enabled: true, sort_order: i },
    );
  }
  console.log(`✓ Navigation (${NAV_ITEMS.length} items × header + footer)`);

  for (let i = 0; i < SOCIAL_LINKS.length; i++) {
    const s = SOCIAL_LINKS[i];
    const sAr = SOCIAL_LINKS_AR[i];
    await upsertRow(
      "social_links",
      { label: s.label },
      { href: s.href, icon_key: s.icon, is_enabled: true, sort_order: i },
    );
    void sAr; // social_links has no ar_label column (icon-only on the frontend) — nothing to write yet.
  }
  console.log(`✓ Social links (${SOCIAL_LINKS.length})\n`);

  // --- Home -------------------------------------------------------------
  const homeId = await upsertPage("home", "Home", "/", 0);
  await seedHeroSection(homeId, 0, heroContent, heroContentAr);
  await seedScalarSection(homeId, "doctor_intro", "Doctor Intro", 1, [
    { key: "eyebrow", label: "Eyebrow", type: "text", valueEn: doctorIntroContent.eyebrow, valueAr: doctorIntroContentAr.eyebrow },
    { key: "heading", label: "Heading", type: "text", valueEn: doctorIntroContent.heading, valueAr: doctorIntroContentAr.heading },
    { key: "paragraphs", label: "Paragraphs", type: "list", valueEn: doctorIntroContent.paragraphs, valueAr: doctorIntroContentAr.paragraphs },
    { key: "highlights", label: "Highlights", type: "list", valueEn: doctorIntroContent.highlights, valueAr: doctorIntroContentAr.highlights },
    { key: "video_media_id", label: "Video thumbnail", type: "image", translatable: false, valueEn: "" },
    {
      key: "video_duration_label",
      label: "Video duration label",
      type: "text",
      translatable: false,
      valueEn: doctorIntroContent.video.durationLabel ?? "",
    },
  ]);
  const statsSectionId = await upsertSection(homeId, "stats", "Stats", 2);
  await seedStats(homeId, statsSectionId, statsContent, statsContentAr);

  const servicesSectionId = await seedSectionCopy(homeId, "featured_services", "Featured Services", 3, {
    eyebrow: "What We Offer",
    heading: "Featured Services",
    description: "A glimpse of our most requested treatments — the full catalogue lives on the Services page.",
  }, homeSectionCopyAr.featuredServices);
  await seedServices(homeId, servicesSectionId, featuredServices, featuredServicesAr);

  const casesSectionId = await seedSectionCopy(homeId, "cases", "Cases & Transformations", 4, {
    eyebrow: "Real Results",
    heading: "Cases & Transformations",
    description: "A curated look at treatment outcomes. Drag the divider to compare — tap to expand each case.",
  }, homeSectionCopyAr.cases);
  await seedCases(homeId, casesSectionId, homeCases, homeCasesAr);

  const whySectionId = await seedSectionCopy(homeId, "why_doctor", "Why Dr. Doaa", 5, {
    eyebrow: "The Difference",
    heading: "Why Dr. Doaa",
  }, homeSectionCopyAr.whyDoctor);
  await seedWhyPoints(homeId, whySectionId, whyDoctorPoints, whyDoctorPointsAr);

  const journeySectionId = await seedSectionCopy(homeId, "patient_journey", "Patient Journey", 6, {
    eyebrow: "The Process",
    heading: "Your Journey With Dr. Doaa",
    description: "A considered, step-by-step path from first consultation to lasting results.",
  }, homeSectionCopyAr.journey);
  await seedJourneySteps(homeId, journeySectionId, journeySteps, journeyStepsAr);

  const reviewsSectionId = await seedSectionCopy(homeId, "reviews", "Reviews", 7, {
    eyebrow: "Patient Voices",
    heading: "Patient Reviews",
    description: "What patients share after their consultation and treatment experience.",
  }, homeSectionCopyAr.reviews);
  await seedReviews(homeId, reviewsSectionId, homeReviews, homeReviewsAr);

  const videosSectionId = await seedSectionCopy(homeId, "featured_videos", "Featured Videos", 8, {
    eyebrow: "Watch & Learn",
    heading: "Featured Videos",
    description: "Short, editorial pieces on treatments, skin care, and life inside the clinic.",
  }, homeSectionCopyAr.featuredVideos);
  // Seed the FULL catalogue once (under the Videos page below), then place
  // just the first 3 into Home's teaser — same rows, two placements, no
  // duplication, matching how the local data does it today.
  const videosPageIdForCatalogue = await upsertPage("videos", "Videos", "/videos", 4);
  const videosLibrarySectionId = await seedSectionCopy(videosPageIdForCatalogue, "library", "Video Library", 1, {
    eyebrow: "Watch & Learn",
    heading: "Featured Videos",
    description: "Short, editorial pieces on treatments, skin science, and life inside the clinic.",
  }, videosSectionCopyAr.library);
  const allVideoIds = await seedVideos(videosPageIdForCatalogue, videosLibrarySectionId, videoCatalogue, videoCatalogueAr);
  for (let i = 0; i < 3; i++) {
    await placeItem(homeId, videosSectionId, "videos", allVideoIds[i], i);
  }

  const faqSectionId = await seedSectionCopy(homeId, "faq", "FAQ", 9, {
    eyebrow: "Good to Know",
    heading: "Frequently Asked Questions",
  }, homeSectionCopyAr.faq);
  await seedFaq(homeId, faqSectionId, homeFaq, homeFaqAr);

  await seedFinalCtaSection(homeId, 10, homeFinalCta, homeFinalCtaAr);
  console.log("✓ Home (11 sections)");

  // --- About --------------------------------------------------------------
  const aboutId = await upsertPage("about", "About Dr. Doaa", "/about", 1);
  await seedHeroSection(aboutId, 0, aboutHeroContent, aboutHeroContentAr);
  await seedScalarSection(aboutId, "intro_video", "Intro Video", 1, [
    { key: "eyebrow", label: "Eyebrow", type: "text", valueEn: aboutIntroVideoContent.eyebrow, valueAr: aboutIntroVideoContentAr.eyebrow },
    { key: "heading", label: "Heading", type: "text", valueEn: aboutIntroVideoContent.heading, valueAr: aboutIntroVideoContentAr.heading },
    { key: "video_media_id", label: "Video thumbnail", type: "image", translatable: false, valueEn: "" },
    {
      key: "video_duration_label",
      label: "Video duration label",
      type: "text",
      translatable: false,
      valueEn: aboutIntroVideoContent.video.durationLabel ?? "",
    },
  ]);
  await seedScalarSection(aboutId, "message", "Doctor's Message", 2, [
    { key: "eyebrow", label: "Eyebrow", type: "text", valueEn: aboutMessageContent.eyebrow, valueAr: aboutMessageContentAr.eyebrow },
    { key: "quote", label: "Quote", type: "textarea", valueEn: aboutMessageContent.quote, valueAr: aboutMessageContentAr.quote },
    { key: "paragraphs", label: "Paragraphs", type: "list", valueEn: aboutMessageContent.paragraphs, valueAr: aboutMessageContentAr.paragraphs },
    { key: "signature_name", label: "Signature name", type: "text", valueEn: aboutMessageContent.signatureName, valueAr: aboutMessageContentAr.signatureName },
    { key: "signature_title", label: "Signature title", type: "text", valueEn: aboutMessageContent.signatureTitle, valueAr: aboutMessageContentAr.signatureTitle },
  ]);
  const credentialsSectionId = await seedSectionCopy(aboutId, "credentials", "Credentials", 3, {
    eyebrow: "Credentials",
    heading: "Experience & Certifications",
    description:
      "A continuing path of clinical training and hands-on practice — the foundation every treatment plan is built on.",
  }, aboutSectionCopyAr.credentials);
  await seedCredentials(aboutId, credentialsSectionId, experienceContent, experienceContentAr);
  const keyAreasSectionId = await seedSectionCopy(aboutId, "key_areas", "Key Areas", 4, {
    eyebrow: "Key Areas",
    heading: "Important Treatments",
    description: "A concise look at the areas Dr. Doaa focuses on most — the full catalogue lives on the Services page.",
  }, aboutSectionCopyAr.keyAreas);
  await seedServices(aboutId, keyAreasSectionId, keyTreatmentAreas, keyTreatmentAreasAr);
  const aboutCasesSectionId = await seedSectionCopy(aboutId, "cases", "Cases", 5, {
    eyebrow: "Featured Cases",
    heading: "A Preview of Real Results",
    description: "A small selection of treatment journeys. Drag the divider to compare — tap to expand each case.",
  }, aboutSectionCopyAr.cases);
  await seedCases(aboutId, aboutCasesSectionId, aboutCases, aboutCasesAr);
  await seedFinalCtaSection(aboutId, 6, aboutFinalCta, aboutFinalCtaAr);
  console.log("✓ About (7 sections)");

  // --- Services -------------------------------------------------------------
  const servicesPageId = await upsertPage("services", "Services", "/services", 2);
  await seedHeroSection(servicesPageId, 0, heroContent, heroContentAr); // Services reuses Home's hero verbatim per spec
  const categoriesSectionId = await seedSectionCopy(servicesPageId, "categories", "Treatment Categories", 1, {
    eyebrow: "Start Here",
    heading: "What Do You Need to Treat?",
    description: "Choose the area closest to your concern — it jumps straight to the relevant treatments below.",
  }, servicesSectionCopyAr.categories);
  for (let i = 0; i < treatmentCategories.length; i++) {
    const cat = treatmentCategories[i];
    const catAr = treatmentCategoriesAr.find((c) => c.id === cat.id);
    const catId = await upsertRow(
      "treatment_categories",
      { key: cat.id },
      {
        title: cat.title,
        card_label: cat.cardLabel,
        description: cat.description,
        ar_title: catAr?.title ?? "",
        ar_card_label: catAr?.cardLabel ?? "",
        ar_description: catAr?.description ?? "",
        is_enabled: true,
        sort_order: i,
      },
    );
    for (let j = 0; j < cat.treatments.length; j++) {
      const t = cat.treatments[j];
      const tAr = catAr?.treatments.find((x) => x.slug === t.slug);
      await upsertRow(
        "treatments",
        { slug: t.slug },
        {
          category_id: catId,
          name: t.name,
          short_description: t.shortDescription,
          what_is_it: t.whatIsIt,
          common_concerns: t.commonConcerns,
          approach: t.approach,
          treatment_options: t.treatmentOptions,
          journey: t.journey,
          notes: t.notes,
          booking_label: t.bookingLabel,
          ar_name: tAr?.name ?? "",
          ar_short_description: tAr?.shortDescription ?? "",
          ar_what_is_it: tAr?.whatIsIt ?? "",
          ar_common_concerns: tAr?.commonConcerns ?? [],
          ar_approach: tAr?.approach ?? "",
          ar_treatment_options: tAr?.treatmentOptions ?? [],
          ar_journey: tAr?.journey ?? "",
          ar_notes: tAr?.notes ?? "",
          ar_booking_label: tAr?.bookingLabel ?? "",
          is_enabled: true,
          sort_order: j,
        },
      );
    }
  }
  void categoriesSectionId;
  await seedScalarSection(servicesPageId, "booking_prompt", "Mid-Page Booking Prompt", 2, [
    { key: "title", label: "Title", type: "text", valueEn: "Not sure which treatment fits you?", valueAr: servicesSectionCopyAr.bookingPrompt.title },
    {
      key: "description",
      label: "Description",
      type: "text",
      valueEn: "A short consultation is the easiest way to get a clear, personalized plan.",
      valueAr: servicesSectionCopyAr.bookingPrompt.description,
    },
    { key: "ctaLabel", label: "Button label", type: "text", valueEn: "Book a Consultation", valueAr: servicesSectionCopyAr.bookingPrompt.ctaLabel },
    { key: "ctaHref", label: "Button link", type: "url", translatable: false, valueEn: "/contact" },
  ]);
  await seedFinalCtaSection(servicesPageId, 3, servicesFinalCta, servicesFinalCtaAr);
  console.log(`✓ Services (${treatmentCategories.length} categories)`);

  // --- Patients & Stories -----------------------------------------------
  const patientsId = await upsertPage("patients-reviews", "Patients & Stories", "/patients-reviews", 3);
  await seedHeroSection(patientsId, 0, patientsHeroContent, patientsHeroContentAr);
  const patientsCasesSectionId = await seedSectionCopy(patientsId, "cases", "Cases", 1, {}, patientsSectionCopyAr.cases);
  await seedCases(patientsId, patientsCasesSectionId, homeCases, homeCasesAr);
  const patientsReviewsSectionId = await seedSectionCopy(patientsId, "reviews", "Reviews", 2, {}, patientsSectionCopyAr.reviews);
  await seedReviews(patientsId, patientsReviewsSectionId, homeReviews, homeReviewsAr);
  const patientsFaqSectionId = await seedSectionCopy(patientsId, "faq", "FAQ", 3, {}, patientsSectionCopyAr.faq);
  await seedFaq(patientsId, patientsFaqSectionId, patientsFaq, patientsFaqAr);
  await seedFinalCtaSection(patientsId, 4, patientsFinalCta, patientsFinalCtaAr);
  console.log("✓ Patients & Stories (5 sections)");

  // --- Videos (hero/final CTA — library was seeded above) -----------------
  await seedHeroSection(videosPageIdForCatalogue, 0, videosHeroContent, videosHeroContentAr);
  await seedFinalCtaSection(videosPageIdForCatalogue, 2, videosFinalCta, videosFinalCtaAr);
  console.log("✓ Videos (hero + library + final CTA)");

  // --- Articles -------------------------------------------------------------
  const articlesId = await upsertPage("articles", "Articles", "/articles", 5);
  await seedHeroSection(articlesId, 0, articlesHeroContent, articlesHeroContentAr);
  await upsertSection(articlesId, "library", "Article Library", 1);
  for (let i = 0; i < articleCatalogue.length; i++) {
    const a = articleCatalogue[i];
    const aAr = articleCatalogueAr.find((x) => x.slug === a.slug);
    await upsertRow(
      "articles",
      { slug: a.slug },
      {
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        category: a.category,
        published_date: a.date,
        reading_time: a.readingTime,
        author: a.author,
        ar_title: aAr?.title ?? "",
        ar_excerpt: aAr?.excerpt ?? "",
        ar_content: aAr?.content ?? [],
        ar_category: aAr?.category ?? "",
        ar_reading_time: aAr?.readingTime ?? "",
        ar_author: aAr?.author ?? "",
        is_published: a.published,
        is_featured: a.featured,
        sort_order: i,
      },
    );
  }
  await seedFinalCtaSection(articlesId, 2, articlesFinalCta, articlesFinalCtaAr);
  console.log(`✓ Articles (${articleCatalogue.length} articles)`);

  // --- Contact --------------------------------------------------------------
  const contactId = await upsertPage("contact", "Contact", "/contact", 6);
  await seedHeroSection(contactId, 0, contactHeroContent, contactHeroContentAr);
  await seedSectionCopy(contactId, "form", "Contact Panel", 1, {
    eyebrow: "Get In Touch",
    heading: "Let’s talk about your skin.",
    description: "Reach out directly, or send a message and we’ll get back to you — whichever feels easiest.",
  }, contactSectionCopyAr.form);
  console.log("✓ Contact\n");

  // --- Legal pages (shells — no local placeholder copy exists yet) --------
  const legalPages: { slug: string; name: string; route: string }[] = [
    { slug: "privacy-policy", name: "Privacy Policy", route: "/privacy-policy" },
    { slug: "terms-of-service", name: "Terms of Service", route: "/terms-of-service" },
    { slug: "medical-disclaimer", name: "Medical Disclaimer", route: "/medical-disclaimer" },
  ];
  for (let i = 0; i < legalPages.length; i++) {
    const lp = legalPages[i];
    const pageId = await upsertPage(lp.slug, lp.name, lp.route, 7 + i);
    const sectionId = await upsertSection(pageId, "blocks", "Content Blocks", 0);
    void sectionId;
  }
  console.log("✓ Legal page shells (Privacy Policy, Terms of Service, Medical Disclaimer)\n");

  console.log("Done. Every page now has real EN + AR rows in Supabase — open /admin to start editing.");
}

main().catch((err) => {
  console.error("\nSeed failed:", err);
  process.exit(1);
});
