import { Fragment } from "react";
import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { CategorySelectorSection } from "@/components/sections/services/CategorySelectorSection";
import { TreatmentCategorySection } from "@/components/sections/services/TreatmentCategorySection";
import { BookingPrompt } from "@/components/sections/services/BookingPrompt";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { treatmentCategories } from "@/data/services/categories";
import { servicesFinalCtaContent } from "@/data/services/final-cta";
import { getFinalCtaContent } from "@/lib/cms/finalCta";
import { getSectionCopy } from "@/lib/cms/sectionCopy";
import { getSectionFields, withFieldFallback } from "@/lib/cms/fields";
import { getTreatmentCategories } from "@/lib/cms/treatmentCategories";
import { getHeroContent } from "@/lib/cms/hero";
import { heroContent } from "@/data/home/hero";
import { localizedHref } from "@/lib/i18n/paths";
import { DEFAULT_LOCALE } from "@/lib/cms/types";

export const metadata: Metadata = {
  title: "Services",
  description:
    "The full range of dermatology and aesthetic treatments Dr. Doaa Samy provides — hair, skin, face, lips & under-eye, and advanced technology-led treatments.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services | Dr. Doaa Samy",
    description:
      "The full range of dermatology and aesthetic treatments Dr. Doaa Samy provides, organized by concern.",
    url: "/services",
  },
};

// Insert the mid-page booking prompt after this many category chapters.
const BOOKING_PROMPT_AFTER_INDEX = 2;

const PAGE = "services";
const locale = DEFAULT_LOCALE;

export default async function ServicesPage() {
  const [hero, categories, categoriesCopy, bookingPromptFields, finalCta] = await Promise.all([
    getHeroContent(PAGE, locale, heroContent),
    getTreatmentCategories(locale, treatmentCategories),
    getSectionCopy(PAGE, "categories", locale, {
      eyebrow: "Start Here",
      heading: "What Do You Need to Treat?",
      description: "Choose the area closest to your concern — it jumps straight to the relevant treatments below.",
    }),
    getSectionFields(PAGE, "booking_prompt", locale),
    getFinalCtaContent(PAGE, locale, servicesFinalCtaContent),
  ]);

  const bookingPromptDefaults = withFieldFallback(bookingPromptFields, {
    title: "Not sure which treatment fits you?",
    description: "A short consultation is the easiest way to get a clear, personalized plan.",
    ctaLabel: "Book a Consultation",
    ctaHref: "/contact",
  });
  const bookingPrompt = { ...bookingPromptDefaults, ctaHref: localizedHref(locale, bookingPromptDefaults.ctaHref) };

  return (
    <>
      <HeroSection content={hero} />

      <CategorySelectorSection categories={categories} {...categoriesCopy} />

      {categories.map((category, index) => (
        <Fragment key={category.id}>
          <TreatmentCategorySection category={category} index={index} total={categories.length} />
          {index === BOOKING_PROMPT_AFTER_INDEX ? <BookingPrompt {...bookingPrompt} /> : null}
        </Fragment>
      ))}

      <FinalCTASection content={finalCta} />
    </>
  );
}
