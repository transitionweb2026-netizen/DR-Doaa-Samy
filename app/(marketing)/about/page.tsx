import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { AboutIntroVideoSection } from "@/components/sections/about/AboutIntroVideoSection";
import { DoctorMessageSection } from "@/components/sections/about/DoctorMessageSection";
import { ExperienceSection } from "@/components/sections/about/ExperienceSection";
import { KeyAreasSection } from "@/components/sections/about/KeyAreasSection";
import { AboutFeaturedCasesSection } from "@/components/sections/about/AboutFeaturedCasesSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { aboutHeroContent } from "@/data/about/hero";
import { aboutFinalCtaContent } from "@/data/about/final-cta";
import { aboutIntroVideoContent } from "@/data/about/intro-video";
import { aboutMessageContent } from "@/data/about/message";
import { credentials as experienceContent } from "@/data/about/experience";
import { keyTreatmentAreas } from "@/data/about/treatments";
import { aboutFeaturedCases } from "@/data/about/cases";
import { getHeroContent } from "@/lib/cms/hero";
import { getFinalCtaContent } from "@/lib/cms/finalCta";
import { getSectionCopy } from "@/lib/cms/sectionCopy";
import { getAboutIntroVideoContent } from "@/lib/cms/aboutIntroVideo";
import { getAboutMessageContent } from "@/lib/cms/aboutMessage";
import { getPortraitImage } from "@/lib/cms/portrait";
import { getCases, getCredentials, getServices } from "@/lib/cms/collections";
import { DEFAULT_LOCALE } from "@/lib/cms/types";

export const metadata: Metadata = {
  title: "About Dr. Doaa",
  description:
    "Meet Dr. Doaa Samy — her approach to dermatology and aesthetic medicine, professional experience, key treatment areas, and featured patient cases.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Dr. Doaa Samy",
    description:
      "Her approach to dermatology and aesthetic medicine, professional experience, and key treatment areas.",
    url: "/about",
  },
};

const PAGE = "about";
const locale = DEFAULT_LOCALE;

export default async function AboutPage() {
  const [
    hero,
    introVideo,
    message,
    messagePortrait,
    credentials,
    credentialsCopy,
    keyAreas,
    keyAreasCopy,
    cases,
    casesCopy,
    finalCta,
  ] = await Promise.all([
    getHeroContent(PAGE, locale, aboutHeroContent),
    getAboutIntroVideoContent(PAGE, locale, aboutIntroVideoContent),
    getAboutMessageContent(PAGE, locale, aboutMessageContent),
    getPortraitImage(PAGE, "message", locale, { alt: "Dr. Doaa Samy in the clinic" }),
    getCredentials(PAGE, "credentials", locale, experienceContent),
    getSectionCopy(PAGE, "credentials", locale, {
      eyebrow: "Credentials",
      heading: "Experience & Certifications",
      description: "A continuing path of clinical training and hands-on practice — the foundation every treatment plan is built on.",
    }),
    getServices(PAGE, "key_areas", locale, keyTreatmentAreas),
    getSectionCopy(PAGE, "key_areas", locale, {
      eyebrow: "Key Areas",
      heading: "Important Treatments",
      description: "A concise look at the areas Dr. Doaa focuses on most — the full catalogue lives on the Services page.",
    }),
    getCases(PAGE, "cases", locale, aboutFeaturedCases),
    getSectionCopy(PAGE, "cases", locale, {
      eyebrow: "Featured Cases",
      heading: "A Preview of Real Results",
      description: "A small selection of treatment journeys. Drag the divider to compare — tap to expand each case.",
    }),
    getFinalCtaContent(PAGE, locale, aboutFinalCtaContent),
  ]);

  return (
    <>
      <HeroSection content={hero} id="about-hero" ariaLabel="About Dr. Doaa" />
      <AboutIntroVideoSection content={introVideo} />
      <DoctorMessageSection content={message} portrait={messagePortrait} />
      <ExperienceSection credentials={credentials} {...credentialsCopy} />
      <KeyAreasSection services={keyAreas} {...keyAreasCopy} />
      <AboutFeaturedCasesSection cases={cases} {...casesCopy} />
      <FinalCTASection content={finalCta} />
    </>
  );
}
