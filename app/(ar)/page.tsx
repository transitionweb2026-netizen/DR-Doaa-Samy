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
import { getPortraitImage } from "@/lib/cms/portrait";
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

import { heroContentAr } from "@/data/ar/home/hero";
import { statsContentAr } from "@/data/ar/home/stats";
import { doctorIntroContentAr } from "@/data/ar/home/doctor-intro";
import { featuredServicesAr } from "@/data/ar/home/services";
import { casesContentAr } from "@/data/ar/home/cases";
import { whyDoctorPointsAr } from "@/data/ar/home/why-doctor";
import { journeyStepsAr } from "@/data/ar/home/journey";
import { reviewsContentAr } from "@/data/ar/home/reviews";
import { videoCatalogueAr } from "@/data/ar/videos/catalogue";
import { faqContentAr } from "@/data/ar/home/faq";
import { finalCtaContentAr } from "@/data/ar/home/final-cta";
import { homeSectionCopyAr } from "@/data/ar/sectionCopy";

// Same page slug as the English Home ("home") — Supabase content is
// per-locale on the same rows (paired ar_* columns / locale field_values),
// not a separate page tree, so this must match app/(marketing)/page.tsx.
const PAGE = "home";
const locale = "ar" as const;
const featuredVideosAr = videoCatalogueAr.slice(0, 3);

export default async function HomePageAr() {
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
    whyDoctorPortrait,
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
    getHeroContent(PAGE, locale, heroContentAr),
    getDoctorIntroContent(PAGE, locale, doctorIntroContentAr),
    getStats(PAGE, "stats", locale, statsContentAr),
    getServices(PAGE, "featured_services", locale, featuredServicesAr),
    getSectionCopy(PAGE, "featured_services", locale, homeSectionCopyAr.featuredServices),
    getCases(PAGE, "cases", locale, casesContentAr),
    getSectionCopy(PAGE, "cases", locale, homeSectionCopyAr.cases),
    getWhyPoints(PAGE, "why_doctor", locale, whyDoctorPointsAr),
    getSectionCopy(PAGE, "why_doctor", locale, homeSectionCopyAr.whyDoctor),
    getPortraitImage(PAGE, "why_doctor", locale, { alt: "د. دعاء سامي في العيادة" }),
    getJourneySteps(PAGE, "patient_journey", locale, journeyStepsAr),
    getSectionCopy(PAGE, "patient_journey", locale, homeSectionCopyAr.journey),
    getReviews(PAGE, "reviews", locale, reviewsContentAr),
    getSectionCopy(PAGE, "reviews", locale, homeSectionCopyAr.reviews),
    getVideos(PAGE, "featured_videos", locale, featuredVideosAr),
    getSectionCopy(PAGE, "featured_videos", locale, homeSectionCopyAr.featuredVideos),
    getFaqItems(PAGE, "faq", locale, faqContentAr),
    getSectionCopy(PAGE, "faq", locale, homeSectionCopyAr.faq),
    getFinalCtaContent(PAGE, locale, finalCtaContentAr),
  ]);

  return (
    <>
      <HeroSection content={hero} />
      <StatsSection stats={stats} />
      <DoctorIntroSection content={doctorIntro} locale="ar" />
      <FeaturedServicesSection services={services} {...servicesCopy} />
      <CasesSection cases={cases} {...casesCopy} />
      <WhyDoctorSection points={whyPoints} {...whyDoctorCopy} locale="ar" portrait={whyDoctorPortrait} />
      <PatientJourneySection steps={steps} {...journeyCopy} />
      <ReviewsSection reviews={reviews} {...reviewsCopy} />
      <FeaturedVideosSection videos={videos} {...videosCopy} />
      <FAQSection items={faq} {...faqCopy} />
      <FinalCTASection content={finalCta} locale="ar" />
    </>
  );
}
