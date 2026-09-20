import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { CategorySelectorSection } from "@/components/sections/services/CategorySelectorSection";
import { TreatmentCategorySection } from "@/components/sections/services/TreatmentCategorySection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { treatmentCategories } from "@/data/services/categories";
import { servicesFinalCtaContent } from "@/data/services/final-cta";
import { getFinalCtaContent } from "@/lib/cms/finalCta";
import { getSectionCopy } from "@/lib/cms/sectionCopy";
import { getTreatmentCategories } from "@/lib/cms/treatmentCategories";
import { getHeroContent } from "@/lib/cms/hero";
import { heroContent } from "@/data/home/hero";
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

const PAGE = "services";
const locale = DEFAULT_LOCALE;

export default async function ServicesPage() {
  const [hero, categories, categoriesCopy, finalCta] = await Promise.all([
    getHeroContent(PAGE, locale, heroContent),
    getTreatmentCategories(locale, treatmentCategories),
    getSectionCopy(PAGE, "categories", locale, {
      eyebrow: "Start Here",
      heading: "What Do You Need to Treat?",
      description: "Choose the area closest to your concern — it jumps straight to the relevant treatments below.",
    }),
    getFinalCtaContent(PAGE, locale, servicesFinalCtaContent),
  ]);

  return (
    <>
      <HeroSection content={hero} />

      <CategorySelectorSection categories={categories} {...categoriesCopy} />

      {categories.map((category, index) => (
        <TreatmentCategorySection key={category.id} category={category} index={index} total={categories.length} />
      ))}

      <FinalCTASection content={finalCta} />
    </>
  );
}
