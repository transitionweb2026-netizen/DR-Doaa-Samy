import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { AboutIntroVideoSection } from "@/components/sections/about/AboutIntroVideoSection";
import { DoctorMessageSection } from "@/components/sections/about/DoctorMessageSection";
import { ExperienceSection } from "@/components/sections/about/ExperienceSection";
import { KeyAreasSection } from "@/components/sections/about/KeyAreasSection";
import { AboutFeaturedCasesSection } from "@/components/sections/about/AboutFeaturedCasesSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { aboutHeroContentAr } from "@/data/ar/about/hero";
import { aboutFinalCtaContentAr } from "@/data/ar/about/final-cta";
import { aboutIntroVideoContentAr } from "@/data/ar/about/intro-video";
import { aboutMessageContentAr } from "@/data/ar/about/message";
import { credentialsAr } from "@/data/ar/about/experience";
import { keyTreatmentAreasAr } from "@/data/ar/about/treatments";
import { aboutFeaturedCasesAr } from "@/data/ar/about/cases";
import { aboutSectionCopyAr } from "@/data/ar/sectionCopy";
import { getHeroContent } from "@/lib/cms/hero";
import { getFinalCtaContent } from "@/lib/cms/finalCta";
import { getSectionCopy } from "@/lib/cms/sectionCopy";
import { getAboutIntroVideoContent } from "@/lib/cms/aboutIntroVideo";
import { getAboutMessageContent } from "@/lib/cms/aboutMessage";
import { getCases, getCredentials, getServices } from "@/lib/cms/collections";

export const metadata: Metadata = {
  title: "عن د. دعاء",
  description: "تعرّفي على د. دعاء سامي — منهجها في طب الجلدية والتجميل، خبرتها المهنية، أبرز مجالات علاجها، وحالات مختارة من مرضاها.",
  alternates: {
    canonical: "/ar/about",
    languages: { en: "/about", ar: "/ar/about" },
  },
  openGraph: {
    title: "عن د. دعاء سامي",
    description: "منهجها في طب الجلدية والتجميل، خبرتها المهنية، وأبرز مجالات علاجها.",
    url: "/ar/about",
  },
};

const PAGE = "about";
const locale = "ar" as const;

export default async function AboutPageAr() {
  const [
    hero,
    introVideo,
    message,
    credentials,
    credentialsCopy,
    keyAreas,
    keyAreasCopy,
    cases,
    casesCopy,
    finalCta,
  ] = await Promise.all([
    getHeroContent(PAGE, locale, aboutHeroContentAr),
    getAboutIntroVideoContent(PAGE, locale, aboutIntroVideoContentAr),
    getAboutMessageContent(PAGE, locale, aboutMessageContentAr),
    getCredentials(PAGE, "credentials", locale, credentialsAr),
    getSectionCopy(PAGE, "credentials", locale, aboutSectionCopyAr.credentials),
    getServices(PAGE, "key_areas", locale, keyTreatmentAreasAr),
    getSectionCopy(PAGE, "key_areas", locale, aboutSectionCopyAr.keyAreas),
    getCases(PAGE, "cases", locale, aboutFeaturedCasesAr),
    getSectionCopy(PAGE, "cases", locale, aboutSectionCopyAr.cases),
    getFinalCtaContent(PAGE, locale, aboutFinalCtaContentAr),
  ]);

  return (
    <>
      <HeroSection content={hero} id="about-hero" ariaLabel="عن د. دعاء" />
      <AboutIntroVideoSection content={introVideo} />
      <DoctorMessageSection content={message} locale="ar" />
      <ExperienceSection credentials={credentials} {...credentialsCopy} />
      <KeyAreasSection services={keyAreas} {...keyAreasCopy} />
      <AboutFeaturedCasesSection cases={cases} {...casesCopy} />
      <FinalCTASection content={finalCta} />
    </>
  );
}
