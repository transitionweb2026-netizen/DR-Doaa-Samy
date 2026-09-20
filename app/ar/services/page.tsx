import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { CategorySelectorSection } from "@/components/sections/services/CategorySelectorSection";
import { TreatmentCategorySection } from "@/components/sections/services/TreatmentCategorySection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { treatmentCategoriesAr } from "@/data/ar/services/categories";
import { servicesFinalCtaContentAr } from "@/data/ar/services/final-cta";
import { servicesSectionCopyAr } from "@/data/ar/sectionCopy";
import { heroContentAr } from "@/data/ar/home/hero";
import { getHeroContent } from "@/lib/cms/hero";
import { getFinalCtaContent } from "@/lib/cms/finalCta";
import { getSectionCopy } from "@/lib/cms/sectionCopy";
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

const PAGE = "services";
const locale = "ar" as const;

export default async function ServicesPageAr() {
  const [hero, categories, categoriesCopy, finalCta] = await Promise.all([
    getHeroContent(PAGE, locale, heroContentAr),
    getTreatmentCategories(locale, treatmentCategoriesAr),
    getSectionCopy(PAGE, "categories", locale, servicesSectionCopyAr.categories),
    getFinalCtaContent(PAGE, locale, servicesFinalCtaContentAr),
  ]);

  return (
    <>
      <HeroSection content={hero} />

      <CategorySelectorSection categories={categories} {...categoriesCopy} />

      {categories.map((category, index) => (
        <TreatmentCategorySection key={category.id} category={category} index={index} total={categories.length} />
      ))}

      <FinalCTASection content={finalCta} locale="ar" />
    </>
  );
}
