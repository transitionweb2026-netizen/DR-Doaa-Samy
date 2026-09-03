import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { CasesSection } from "@/components/sections/CasesSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { patientsHeroContentAr } from "@/data/ar/patients/hero";
import { patientsFaqContentAr } from "@/data/ar/patients/faq";
import { patientsFinalCtaContentAr } from "@/data/ar/patients/final-cta";
import { casesContentAr } from "@/data/ar/home/cases";
import { reviewsContentAr } from "@/data/ar/home/reviews";
import { patientsSectionCopyAr } from "@/data/ar/sectionCopy";
import { getHeroContent } from "@/lib/cms/hero";
import { getFinalCtaContent } from "@/lib/cms/finalCta";
import { getSectionCopy } from "@/lib/cms/sectionCopy";
import { getCases, getFaqItems, getReviews } from "@/lib/cms/collections";

export const metadata: Metadata = {
  title: "المرضى والقصص",
  description: "رحلات حقيقية للمرضى، حالات قبل وبعد، وتقييمات شاركها من خضعوا للاستشارة والعلاج مع د. دعاء سامي.",
  alternates: {
    canonical: "/ar/patients-reviews",
    languages: { en: "/patients-reviews", ar: "/ar/patients-reviews" },
  },
  openGraph: {
    title: "المرضى والقصص | د. دعاء سامي",
    description: "رحلات حقيقية للمرضى، حالات قبل وبعد، وتقييمات.",
    url: "/ar/patients-reviews",
  },
};

const PAGE = "patients-reviews";
const locale = "ar" as const;

export default async function PatientsReviewsPageAr() {
  const [hero, cases, casesCopy, reviews, reviewsCopy, faq, faqCopy, finalCta] = await Promise.all([
    getHeroContent(PAGE, locale, patientsHeroContentAr),
    getCases(PAGE, "cases", locale, casesContentAr),
    getSectionCopy(PAGE, "cases", locale, patientsSectionCopyAr.cases),
    getReviews(PAGE, "reviews", locale, reviewsContentAr),
    getSectionCopy(PAGE, "reviews", locale, patientsSectionCopyAr.reviews),
    getFaqItems(PAGE, "faq", locale, patientsFaqContentAr),
    getSectionCopy(PAGE, "faq", locale, patientsSectionCopyAr.faq),
    getFinalCtaContent(PAGE, locale, patientsFinalCtaContentAr),
  ]);

  return (
    <>
      <HeroSection content={hero} id="patients-hero" ariaLabel="المرضى والقصص" />

      <CasesSection cases={cases} headingId="patients-cases-heading" tone="blush" showCta={false} {...casesCopy} />

      <ReviewsSection reviews={reviews} showCta={false} {...reviewsCopy} />

      <FAQSection items={faq} headingId="patients-faq-heading" {...faqCopy} />

      <FinalCTASection content={finalCta} />
    </>
  );
}
