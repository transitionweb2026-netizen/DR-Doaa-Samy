import { Fragment } from "react";
import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { CategorySelectorSection } from "@/components/sections/services/CategorySelectorSection";
import { TreatmentCategorySection } from "@/components/sections/services/TreatmentCategorySection";
import { BookingPrompt } from "@/components/sections/services/BookingPrompt";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { treatmentCategoriesAr } from "@/data/ar/services/categories";
import { servicesFinalCtaContentAr } from "@/data/ar/services/final-cta";
import { servicesSectionCopyAr } from "@/data/ar/sectionCopy";
import { heroContentAr } from "@/data/ar/home/hero";
import { getHeroContent } from "@/lib/cms/hero";
import { getFinalCtaContent } from "@/lib/cms/finalCta";
import { getSectionCopy } from "@/lib/cms/sectionCopy";
import { getSectionFields, withFieldFallback } from "@/lib/cms/fields";
import { getTreatmentCategories } from "@/lib/cms/treatmentCategories";

export const metadata: Metadata = {
  title: "الخدمات",
  description: "المجموعة الكاملة من علاجات الجلدية والتجميل التي تقدمها د. دعاء سامي — الشعر، البشرة، الوجه، الشفاه ومحيط العين، وأحدث العلاجات التقنية.",
  alternates: {
    canonical: "/ar/services",
    languages: { en: "/services", ar: "/ar/services" },
  },
  openGraph: {
    title: "الخدمات | د. دعاء سامي",
    description: "المجموعة الكاملة من علاجات الجلدية والتجميل، منظمة حسب المشكلة.",
    url: "/ar/services",
  },
};

// Insert the mid-page booking prompt after this many category chapters.
const BOOKING_PROMPT_AFTER_INDEX = 2;

const PAGE = "services";
const locale = "ar" as const;

export default async function ServicesPageAr() {
  const [homeHero, categories, categoriesCopy, bookingPromptFields, finalCta] = await Promise.all([
    // Services reuses Home's hero verbatim (same requirement as the English
    // site) — HeroSection's own bare default is the *English* hero, so this
    // fetches Home's actual Arabic hero explicitly rather than relying on it.
    getHeroContent("home", locale, heroContentAr),
    getTreatmentCategories(locale, treatmentCategoriesAr),
    getSectionCopy(PAGE, "categories", locale, servicesSectionCopyAr.categories),
    getSectionFields(PAGE, "booking_prompt", locale),
    getFinalCtaContent(PAGE, locale, servicesFinalCtaContentAr),
  ]);

  const bookingPrompt = withFieldFallback(bookingPromptFields, servicesSectionCopyAr.bookingPrompt);

  return (
    <>
      <HeroSection content={homeHero} />

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
