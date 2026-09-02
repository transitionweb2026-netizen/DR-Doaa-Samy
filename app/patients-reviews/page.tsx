import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { CasesSection } from "@/components/sections/CasesSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { patientsHeroContent } from "@/data/patients/hero";
import { patientsFaqContent } from "@/data/patients/faq";
import { patientsFinalCtaContent } from "@/data/patients/final-cta";
import { casesContent } from "@/data/home/cases";
import { reviewsContent } from "@/data/home/reviews";
import { getHeroContent } from "@/lib/cms/hero";
import { getFinalCtaContent } from "@/lib/cms/finalCta";
import { getSectionCopy } from "@/lib/cms/sectionCopy";
import { getCases, getFaqItems, getReviews } from "@/lib/cms/collections";
import { DEFAULT_LOCALE } from "@/lib/cms/types";

export const metadata: Metadata = {
  title: "Patients & Stories",
  description:
    "Real patient journeys, before & after cases, and reviews shared after consultation and treatment with Dr. Doaa Samy.",
  alternates: {
    canonical: "/patients-reviews",
  },
  openGraph: {
    title: "Patients & Stories | Dr. Doaa Samy",
    description: "Real patient journeys, before & after cases, and reviews.",
    url: "/patients-reviews",
  },
};

const PAGE = "patients-reviews";
const locale = DEFAULT_LOCALE;

export default async function PatientsReviewsPage() {
  const [hero, cases, casesCopy, reviews, reviewsCopy, faq, faqCopy, finalCta] = await Promise.all([
    getHeroContent(PAGE, locale, patientsHeroContent),
    getCases(PAGE, "cases", locale, casesContent),
    getSectionCopy(PAGE, "cases", locale, {
      eyebrow: "Real Results",
      heading: "Before & After Cases",
      description: "A closer look at treatment journeys. Drag the divider to compare — tap to expand each case.",
    }),
    getReviews(PAGE, "reviews", locale, reviewsContent),
    getSectionCopy(PAGE, "reviews", locale, { eyebrow: "Patient Voices", heading: "Patient Reviews" }),
    getFaqItems(PAGE, "faq", locale, patientsFaqContent),
    getSectionCopy(PAGE, "faq", locale, {
      eyebrow: "Good to Know",
      heading: "Questions About Our Patients & Reviews",
    }),
    getFinalCtaContent(PAGE, locale, patientsFinalCtaContent),
  ]);

  return (
    <>
      <HeroSection content={hero} id="patients-hero" ariaLabel="Patients & Stories" />

      <CasesSection cases={cases} headingId="patients-cases-heading" tone="blush" {...casesCopy} />

      <ReviewsSection reviews={reviews} showCta={false} {...reviewsCopy} />

      <FAQSection items={faq} headingId="patients-faq-heading" {...faqCopy} />

      <FinalCTASection content={finalCta} />
    </>
  );
}
