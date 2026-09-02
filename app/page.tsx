import { HeroSection } from "@/components/hero/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { DoctorIntroSection } from "@/components/sections/DoctorIntroSection";
import { FeaturedServicesSection } from "@/components/sections/FeaturedServicesSection";
import { CasesSection } from "@/components/sections/CasesSection";
import { WhyDoctorSection } from "@/components/sections/WhyDoctorSection";
import { PatientJourneySection } from "@/components/sections/PatientJourneySection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { FeaturedVideosSection } from "@/components/sections/FeaturedVideosSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

import { getHeroContent } from "@/lib/cms/hero";
import { getDoctorIntroContent } from "@/lib/cms/doctorIntro";
import { getFinalCtaContent } from "@/lib/cms/finalCta";
import { getSectionCopy } from "@/lib/cms/sectionCopy";
import {
  getCases,
  getFaqItems,
  getJourneySteps,
  getReviews,
  getServices,
  getStats,
  getVideos,
  getWhyPoints,
} from "@/lib/cms/collections";
import { DEFAULT_LOCALE } from "@/lib/cms/types";

import { heroContent } from "@/data/home/hero";
import { statsContent } from "@/data/home/stats";
import { doctorIntroContent } from "@/data/home/doctor-intro";
import { featuredServices } from "@/data/home/services";
import { casesContent } from "@/data/home/cases";
import { whyDoctorPoints } from "@/data/home/why-doctor";
import { journeySteps } from "@/data/home/journey";
import { reviewsContent } from "@/data/home/reviews";
import { featuredVideos } from "@/data/home/videos";
import { faqContent } from "@/data/home/faq";
import { finalCtaContent } from "@/data/home/final-cta";

// Page/section keys used throughout — must match the seed script and the
// admin dashboard's `pages`/`sections` rows exactly.
const PAGE = "home";
const locale = DEFAULT_LOCALE; // this route is always English; /ar mirrors it

export default async function HomePage() {
  const [
    hero,
    doctorIntro,
    stats,
    services,
    servicesCopy,
    cases,
    casesCopy,
    whyPoints,
    whyDoctorCopy,
    steps,
    journeyCopy,
    reviews,
    reviewsCopy,
    videos,
    videosCopy,
    faq,
    faqCopy,
    finalCta,
  ] = await Promise.all([
    getHeroContent(PAGE, locale, heroContent),
    getDoctorIntroContent(PAGE, locale, doctorIntroContent),
    getStats(PAGE, "stats", locale, statsContent),
    getServices(PAGE, "featured_services", locale, featuredServices),
    getSectionCopy(PAGE, "featured_services", locale, {
      eyebrow: "What We Offer",
      heading: "Featured Services",
      description: "A glimpse of our most requested treatments — the full catalogue lives on the Services page.",
    }),
    getCases(PAGE, "cases", locale, casesContent),
    getSectionCopy(PAGE, "cases", locale, {
      eyebrow: "Real Results",
      heading: "Cases & Transformations",
      description: "A curated look at treatment outcomes. Drag the divider to compare — tap to expand each case.",
    }),
    getWhyPoints(PAGE, "why_doctor", locale, whyDoctorPoints),
    getSectionCopy(PAGE, "why_doctor", locale, { eyebrow: "The Difference", heading: "Why Dr. Doaa" }),
    getJourneySteps(PAGE, "patient_journey", locale, journeySteps),
    getSectionCopy(PAGE, "patient_journey", locale, {
      eyebrow: "The Process",
      heading: "Your Journey With Dr. Doaa",
      description: "A considered, step-by-step path from first consultation to lasting results.",
    }),
    getReviews(PAGE, "reviews", locale, reviewsContent),
    getSectionCopy(PAGE, "reviews", locale, {
      eyebrow: "Patient Voices",
      heading: "Patient Reviews",
      description: "What patients share after their consultation and treatment experience.",
    }),
    getVideos(PAGE, "featured_videos", locale, featuredVideos),
    getSectionCopy(PAGE, "featured_videos", locale, {
      eyebrow: "Watch & Learn",
      heading: "Featured Videos",
      description: "Short, editorial pieces on treatments, skin care, and life inside the clinic.",
    }),
    getFaqItems(PAGE, "faq", locale, faqContent),
    getSectionCopy(PAGE, "faq", locale, { eyebrow: "Good to Know", heading: "Frequently Asked Questions" }),
    getFinalCtaContent(PAGE, locale, finalCtaContent),
  ]);

  return (
    <>
      <HeroSection content={hero} />
      <StatsSection stats={stats} />
      <DoctorIntroSection content={doctorIntro} />
      <FeaturedServicesSection services={services} {...servicesCopy} />
      <CasesSection cases={cases} {...casesCopy} />
      <WhyDoctorSection points={whyPoints} {...whyDoctorCopy} />
      <PatientJourneySection steps={steps} {...journeyCopy} />
      <ReviewsSection reviews={reviews} {...reviewsCopy} />
      <FeaturedVideosSection videos={videos} {...videosCopy} />
      <FAQSection items={faq} {...faqCopy} />
      <FinalCTASection content={finalCta} />
    </>
  );
}
