/**
 * Populates a connected Supabase project with the site's existing English
 * placeholder content, so the CMS starts pre-filled instead of empty.
 *
 * Safe to re-run: every row is upserted by a natural key (page slug,
 * section key, field key, item slug/title/...), so running this again
 * after editing local data just updates the matching rows in place rather
 * than duplicating them. Arabic columns are left empty on purpose — this
 * script only ever carries over the site's authored English copy; nothing
 * is auto-translated (see docs/cms-content-inventory.md).
 *
 * Usage:  npm run cms:seed
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */

// Not lib/supabase/service-role.ts: that module `import "server-only"`,
// which throws unconditionally outside of Next's build (it's normally
// stripped to a no-op by Next's bundler) — this script runs under plain
// tsx, so it builds the same service-role client directly instead.
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

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

async function upsertField(
  sectionId: string,
  key: string,
  label: string,
  fieldType: FieldType,
  translatable: boolean,
  sortOrder: number,
  value: unknown,
) {
  const fieldId = await upsertRow(
    "fields",
    { section_id: sectionId, key },
    { label, field_type: fieldType, is_translatable: translatable, sort_order: sortOrder },
  );
  const { error } = await admin
    .from("field_values")
    .upsert({ field_id: fieldId, locale: "en", value }, { onConflict: "field_id,locale" });
  if (error) throw new Error(`field_values upsert failed for ${key}: ${error.message}`);
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
// section eyebrow/heading/description bundles).
async function seedScalarSection(
  pageId: string,
  key: string,
  name: string,
  sortOrder: number,
  fields: { key: string; label: string; type: FieldType; translatable?: boolean; value: unknown }[],
) {
  const sectionId = await upsertSection(pageId, key, name, sortOrder);
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    await upsertField(sectionId, f.key, f.label, f.type, f.translatable ?? true, i, f.value);
  }
  return sectionId;
}

async function seedHeroSection(pageId: string, sortOrder: number, hero: typeof heroContent) {
  return seedScalarSection(pageId, "hero", "Hero", sortOrder, [
    { key: "eyebrow", label: "Eyebrow", type: "text", value: hero.eyebrow },
    { key: "name", label: "Name", type: "text", value: hero.name },
    { key: "role", label: "Role", type: "text", value: hero.role },
    { key: "headline", label: "Headline", type: "text", value: hero.headline },
    { key: "description", label: "Description", type: "textarea", value: hero.description },
    { key: "primary_cta_label", label: "Primary button label", type: "text", value: hero.primaryCta.label },
    { key: "primary_cta_href", label: "Primary button link", type: "url", translatable: false, value: hero.primaryCta.href },
    { key: "secondary_cta_label", label: "Secondary button label", type: "text", value: hero.secondaryCta.label },
    { key: "secondary_cta_href", label: "Secondary button link", type: "url", translatable: false, value: hero.secondaryCta.href },
    { key: "portrait_media_id", label: "Portrait image", type: "image", translatable: false, value: "" },
  ]);
}

async function seedFinalCtaSection(
  pageId: string,
  sortOrder: number,
  cta: { eyebrow: string; heading: string; description: string; whatsappLabel: string; contactLabel: string },
) {
  // Field keys intentionally match FinalCtaContent's own camelCase property
  // names — lib/cms/finalCta.ts merges by those exact keys.
  return seedScalarSection(pageId, "final_cta", "Final CTA", sortOrder, [
    { key: "eyebrow", label: "Eyebrow", type: "text", value: cta.eyebrow },
    { key: "heading", label: "Heading", type: "text", value: cta.heading },
    { key: "description", label: "Description", type: "textarea", value: cta.description },
    { key: "whatsappLabel", label: "WhatsApp button label", type: "text", value: cta.whatsappLabel },
    { key: "contactLabel", label: "Contact button label", type: "text", value: cta.contactLabel },
  ]);
}

async function seedSectionCopy(
  pageId: string,
  key: string,
  name: string,
  sortOrder: number,
  copy: { eyebrow?: string; heading?: string; description?: string },
) {
  const fields: { key: string; label: string; type: FieldType; value: unknown }[] = [];
  if (copy.eyebrow !== undefined) fields.push({ key: "eyebrow", label: "Eyebrow", type: "text", value: copy.eyebrow });
  if (copy.heading !== undefined) fields.push({ key: "heading", label: "Heading", type: "text", value: copy.heading });
  if (copy.description !== undefined)
    fields.push({ key: "description", label: "Description", type: "textarea", value: copy.description });
  return seedScalarSection(pageId, key, name, sortOrder, fields);
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

// Sequential, not Promise.all — this sandbox's network drops requests under
// heavy fan-out ("fetch failed"), and a one-time seed script has no reason
// to race the API.
async function seedStats(pageId: string, sectionId: string, items: typeof statsContent) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const id = await upsertRow(
      "stats",
      { label: item.label },
      { value: item.value, suffix: item.suffix ?? "", emphasis: item.emphasis ?? null, is_enabled: true, sort_order: i },
    );
    await placeItem(pageId, sectionId, "stats", id, i);
  }
}

async function seedServices(pageId: string, sectionId: string, items: typeof featuredServices) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const id = await upsertRow(
      "services",
      { slug: item.slug },
      {
        name: item.name,
        short_label: item.shortLabel,
        summary: item.summary,
        description: item.description,
        benefits: item.benefits,
        suitable_for: item.suitableFor,
        session_info: item.sessionInfo,
        is_enabled: true,
        sort_order: i,
      },
    );
    await placeItem(pageId, sectionId, "services", id, i);
  }
}

async function seedCases(pageId: string, sectionId: string, items: typeof homeCases) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const id = await upsertRow(
      "cases",
      { title: item.title },
      {
        concern: item.concern,
        treatment: item.treatment,
        result: item.result,
        story: item.story,
        is_enabled: true,
        sort_order: i,
      },
    );
    await placeItem(pageId, sectionId, "cases", id, i);
  }
}

async function seedWhyPoints(pageId: string, sectionId: string, items: typeof whyDoctorPoints) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const id = await upsertRow(
      "why_points",
      { title: item.title },
      { description: item.description, is_enabled: true, sort_order: i },
    );
    await placeItem(pageId, sectionId, "why_points", id, i);
  }
}

async function seedJourneySteps(pageId: string, sectionId: string, items: typeof journeySteps) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const id = await upsertRow(
      "journey_steps",
      { title: item.title },
      { index_label: item.index, description: item.description, is_enabled: true, sort_order: i },
    );
    await placeItem(pageId, sectionId, "journey_steps", id, i);
  }
}

async function seedReviews(pageId: string, sectionId: string, items: typeof homeReviews) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const id = await upsertRow(
      "reviews",
      { name: item.name },
      {
        initials: item.initials,
        rating: item.rating,
        quote: item.quote,
        treatment: item.treatment ?? null,
        is_enabled: true,
        sort_order: i,
      },
    );
    await placeItem(pageId, sectionId, "reviews", id, i);
  }
}

async function seedVideos(pageId: string, sectionId: string, items: typeof videoCatalogue) {
  const ids: string[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const id = await upsertRow(
      "videos",
      { title: item.title },
      {
        category: item.category,
        duration_label: item.durationLabel ?? null,
        description: item.description ?? null,
        video_url: item.videoUrl ?? null,
        is_enabled: true,
        sort_order: i,
      },
    );
    ids.push(id);
    await placeItem(pageId, sectionId, "videos", id, i);
  }
  return ids;
}

async function seedFaq(pageId: string, sectionId: string, items: typeof homeFaq) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const id = await upsertRow(
      "faq_items",
      { question: item.question },
      { answer: item.answer, is_enabled: true, sort_order: i },
    );
    await placeItem(pageId, sectionId, "faq_items", id, i);
  }
}

async function seedCredentials(pageId: string, sectionId: string, items: typeof experienceContent) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const id = await upsertRow(
      "credentials",
      { title: item.title },
      {
        category: item.category,
        period: item.period,
        institution: item.institution,
        description: item.description,
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
  console.log("Seeding CMS content from local placeholder data...\n");

  // --- Site-wide settings, navigation, social links -------------------------
  await admin.from("site_settings").upsert(
    {
      id: true,
      site_name: SITE.name,
      role_title: SITE.role,
      tagline: SITE.tagline,
      phone_display: CONTACT.phoneDisplay,
      phone_href: CONTACT.phoneHref,
      whatsapp_number: CONTACT.whatsappNumber,
      email: CONTACT.email,
      address: CONTACT.addressLine,
      footer_blurb: "Personalized dermatology and aesthetic medicine — precise, modern, and quietly confident.",
      copyright_text: `© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.`,
    },
    { onConflict: "id" },
  );
  console.log("✓ Site settings");

  for (let i = 0; i < NAV_ITEMS.length; i++) {
    const item = NAV_ITEMS[i];
    await upsertRow("nav_items", { location: "header", label: item.label }, { href: item.href, is_enabled: true, sort_order: i });
    await upsertRow("nav_items", { location: "footer", label: item.label }, { href: item.href, is_enabled: true, sort_order: i });
  }
  console.log(`✓ Navigation (${NAV_ITEMS.length} items × header + footer)`);

  for (let i = 0; i < SOCIAL_LINKS.length; i++) {
    const s = SOCIAL_LINKS[i];
    await upsertRow("social_links", { label: s.label }, { href: s.href, icon_key: s.icon, is_enabled: true, sort_order: i });
  }
  console.log(`✓ Social links (${SOCIAL_LINKS.length})\n`);

  // --- Home -------------------------------------------------------------
  const homeId = await upsertPage("home", "Home", "/", 0);
  await seedHeroSection(homeId, 0, heroContent);
  await seedScalarSection(homeId, "doctor_intro", "Doctor Intro", 1, [
    { key: "eyebrow", label: "Eyebrow", type: "text", value: doctorIntroContent.eyebrow },
    { key: "heading", label: "Heading", type: "text", value: doctorIntroContent.heading },
    { key: "paragraphs", label: "Paragraphs", type: "list", value: doctorIntroContent.paragraphs },
    { key: "highlights", label: "Highlights", type: "list", value: doctorIntroContent.highlights },
    { key: "video_media_id", label: "Video thumbnail", type: "image", translatable: false, value: "" },
    { key: "video_duration_label", label: "Video duration label", type: "text", translatable: false, value: doctorIntroContent.video.durationLabel ?? "" },
  ]);
  const statsSectionId = await upsertSection(homeId, "stats", "Stats", 2);
  await seedStats(homeId, statsSectionId, statsContent);

  const servicesSectionId = await seedSectionCopy(homeId, "featured_services", "Featured Services", 3, {
    eyebrow: "What We Offer",
    heading: "Featured Services",
    description: "A glimpse of our most requested treatments — the full catalogue lives on the Services page.",
  });
  await seedServices(homeId, servicesSectionId, featuredServices);

  const casesSectionId = await seedSectionCopy(homeId, "cases", "Cases & Transformations", 4, {
    eyebrow: "Real Results",
    heading: "Cases & Transformations",
    description: "A curated look at treatment outcomes. Drag the divider to compare — tap to expand each case.",
  });
  await seedCases(homeId, casesSectionId, homeCases);

  const whySectionId = await seedSectionCopy(homeId, "why_doctor", "Why Dr. Doaa", 5, {
    eyebrow: "The Difference",
    heading: "Why Dr. Doaa",
  });
  await seedWhyPoints(homeId, whySectionId, whyDoctorPoints);

  const journeySectionId = await seedSectionCopy(homeId, "patient_journey", "Patient Journey", 6, {
    eyebrow: "The Process",
    heading: "Your Journey With Dr. Doaa",
    description: "A considered, step-by-step path from first consultation to lasting results.",
  });
  await seedJourneySteps(homeId, journeySectionId, journeySteps);

  const reviewsSectionId = await seedSectionCopy(homeId, "reviews", "Reviews", 7, {
    eyebrow: "Patient Voices",
    heading: "Patient Reviews",
    description: "What patients share after their consultation and treatment experience.",
  });
  await seedReviews(homeId, reviewsSectionId, homeReviews);

  const videosSectionId = await seedSectionCopy(homeId, "featured_videos", "Featured Videos", 8, {
    eyebrow: "Watch & Learn",
    heading: "Featured Videos",
    description: "Short, editorial pieces on treatments, skin care, and life inside the clinic.",
  });
  // Seed the FULL catalogue once (under the Videos page below), then place
  // just the first 3 into Home's teaser — same rows, two placements, no
  // duplication, matching how the local data does it today.
  const videosPageIdForCatalogue = await upsertPage("videos", "Videos", "/videos", 4);
  const videosLibrarySectionId = await upsertSection(videosPageIdForCatalogue, "library", "Video Library", 1);
  const allVideoIds = await seedVideos(videosPageIdForCatalogue, videosLibrarySectionId, videoCatalogue);
  for (let i = 0; i < 3; i++) {
    await placeItem(homeId, videosSectionId, "videos", allVideoIds[i], i);
  }

  const faqSectionId = await seedSectionCopy(homeId, "faq", "FAQ", 9, {
    eyebrow: "Good to Know",
    heading: "Frequently Asked Questions",
  });
  await seedFaq(homeId, faqSectionId, homeFaq);

  await seedFinalCtaSection(homeId, 10, homeFinalCta);
  console.log("✓ Home (11 sections)");

  // --- About --------------------------------------------------------------
  const aboutId = await upsertPage("about", "About Dr. Doaa", "/about", 1);
  await seedHeroSection(aboutId, 0, aboutHeroContent);
  await seedScalarSection(aboutId, "intro_video", "Intro Video", 1, [
    { key: "eyebrow", label: "Eyebrow", type: "text", value: aboutIntroVideoContent.eyebrow },
    { key: "heading", label: "Heading", type: "text", value: aboutIntroVideoContent.heading },
    { key: "video_media_id", label: "Video thumbnail", type: "image", translatable: false, value: "" },
    {
      key: "video_duration_label",
      label: "Video duration label",
      type: "text",
      translatable: false,
      value: aboutIntroVideoContent.video.durationLabel ?? "",
    },
  ]);
  await seedScalarSection(aboutId, "message", "Doctor's Message", 2, [
    { key: "eyebrow", label: "Eyebrow", type: "text", value: aboutMessageContent.eyebrow },
    { key: "quote", label: "Quote", type: "textarea", value: aboutMessageContent.quote },
    { key: "paragraphs", label: "Paragraphs", type: "list", value: aboutMessageContent.paragraphs },
    { key: "signature_name", label: "Signature name", type: "text", value: aboutMessageContent.signatureName },
    { key: "signature_title", label: "Signature title", type: "text", value: aboutMessageContent.signatureTitle },
  ]);
  const credentialsSectionId = await seedSectionCopy(aboutId, "credentials", "Credentials", 3, {
    eyebrow: "Credentials",
    heading: "Experience & Certifications",
    description:
      "A continuing path of clinical training and hands-on practice — the foundation every treatment plan is built on.",
  });
  await seedCredentials(aboutId, credentialsSectionId, experienceContent);
  const keyAreasSectionId = await seedSectionCopy(aboutId, "key_areas", "Key Areas", 4, {
    eyebrow: "Key Areas",
    heading: "Important Treatments",
    description: "A concise look at the areas Dr. Doaa focuses on most — the full catalogue lives on the Services page.",
  });
  await seedServices(aboutId, keyAreasSectionId, keyTreatmentAreas);
  const aboutCasesSectionId = await seedSectionCopy(aboutId, "cases", "Cases", 5, {
    eyebrow: "Featured Cases",
    heading: "A Preview of Real Results",
    description: "A small selection of treatment journeys. Drag the divider to compare — tap to expand each case.",
  });
  await seedCases(aboutId, aboutCasesSectionId, aboutCases);
  await seedFinalCtaSection(aboutId, 6, aboutFinalCta);
  console.log("✓ About (7 sections)");

  // --- Services -------------------------------------------------------------
  const servicesPageId = await upsertPage("services", "Services", "/services", 2);
  await seedHeroSection(servicesPageId, 0, heroContent); // Services reuses Home's hero verbatim per spec
  const categoriesSectionId = await seedSectionCopy(servicesPageId, "categories", "Treatment Categories", 1, {
    eyebrow: "Start Here",
    heading: "What Do You Need to Treat?",
    description: "Choose the area closest to your concern — it jumps straight to the relevant treatments below.",
  });
  for (let i = 0; i < treatmentCategories.length; i++) {
    const cat = treatmentCategories[i];
    const catId = await upsertRow(
      "treatment_categories",
      { key: cat.id },
      { title: cat.title, card_label: cat.cardLabel, description: cat.description, is_enabled: true, sort_order: i },
    );
    for (let j = 0; j < cat.treatments.length; j++) {
      const t = cat.treatments[j];
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
          is_enabled: true,
          sort_order: j,
        },
      );
    }
  }
  void categoriesSectionId;
  await seedScalarSection(servicesPageId, "booking_prompt", "Mid-Page Booking Prompt", 2, [
    { key: "title", label: "Title", type: "text", value: "Not sure which treatment fits you?" },
    {
      key: "description",
      label: "Description",
      type: "text",
      value: "A short consultation is the easiest way to get a clear, personalized plan.",
    },
    { key: "ctaLabel", label: "Button label", type: "text", value: "Book a Consultation" },
    { key: "ctaHref", label: "Button link", type: "url", translatable: false, value: "/contact" },
  ]);
  await seedFinalCtaSection(servicesPageId, 3, servicesFinalCta);
  console.log(`✓ Services (${treatmentCategories.length} categories)`);

  // --- Patients & Stories -----------------------------------------------
  const patientsId = await upsertPage("patients-reviews", "Patients & Stories", "/patients-reviews", 3);
  await seedHeroSection(patientsId, 0, patientsHeroContent);
  const patientsCasesSectionId = await seedSectionCopy(patientsId, "cases", "Cases", 1, {});
  await seedCases(patientsId, patientsCasesSectionId, homeCases);
  const patientsReviewsSectionId = await seedSectionCopy(patientsId, "reviews", "Reviews", 2, {});
  await seedReviews(patientsId, patientsReviewsSectionId, homeReviews);
  const patientsFaqSectionId = await seedSectionCopy(patientsId, "faq", "FAQ", 3, {});
  await seedFaq(patientsId, patientsFaqSectionId, patientsFaq);
  await seedFinalCtaSection(patientsId, 4, patientsFinalCta);
  console.log("✓ Patients & Stories (5 sections)");

  // --- Videos (hero/final CTA — library was seeded above) -----------------
  await seedHeroSection(videosPageIdForCatalogue, 0, videosHeroContent);
  await seedFinalCtaSection(videosPageIdForCatalogue, 2, videosFinalCta);
  console.log("✓ Videos (hero + library + final CTA)");

  // --- Articles -------------------------------------------------------------
  const articlesId = await upsertPage("articles", "Articles", "/articles", 5);
  await seedHeroSection(articlesId, 0, articlesHeroContent);
  await upsertSection(articlesId, "library", "Article Library", 1);
  for (let i = 0; i < articleCatalogue.length; i++) {
    const a = articleCatalogue[i];
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
        is_published: a.published,
        is_featured: a.featured,
        sort_order: i,
      },
    );
  }
  await seedFinalCtaSection(articlesId, 2, articlesFinalCta);
  console.log(`✓ Articles (${articleCatalogue.length} articles)`);

  // --- Contact --------------------------------------------------------------
  const contactId = await upsertPage("contact", "Contact", "/contact", 6);
  await seedHeroSection(contactId, 0, contactHeroContent);
  await seedSectionCopy(contactId, "form", "Contact Panel", 1, {
    eyebrow: "Get In Touch",
    heading: "Let’s talk about your skin.",
    description: "Reach out directly, or send a message and we’ll get back to you — whichever feels easiest.",
  });
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

  console.log("Done. Every page now has real rows in Supabase — open /admin to start editing.");
}

main().catch((err) => {
  console.error("\nSeed failed:", err);
  process.exit(1);
});
