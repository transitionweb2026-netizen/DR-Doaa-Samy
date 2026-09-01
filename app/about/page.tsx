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

export default function AboutPage() {
  return (
    <>
      <HeroSection content={aboutHeroContent} id="about-hero" ariaLabel="About Dr. Doaa" />
      <AboutIntroVideoSection />
      <DoctorMessageSection />
      <ExperienceSection />
      <KeyAreasSection />
      <AboutFeaturedCasesSection />
      <FinalCTASection content={aboutFinalCtaContent} />
    </>
  );
}
