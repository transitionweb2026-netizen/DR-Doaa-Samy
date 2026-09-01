import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { CasesSection } from "@/components/sections/CasesSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { patientsHeroContent } from "@/data/patients/hero";
import { patientsFaqContent } from "@/data/patients/faq";
import { patientsFinalCtaContent } from "@/data/patients/final-cta";

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

export default function PatientsReviewsPage() {
  return (
    <>
      <HeroSection content={patientsHeroContent} id="patients-hero" ariaLabel="Patients & Stories" />

      <CasesSection
        eyebrow="Real Results"
        heading="Before & After Cases"
        headingId="patients-cases-heading"
        description="A closer look at treatment journeys. Drag the divider to compare — tap to expand each case."
        tone="blush"
      />

      <ReviewsSection showCta={false} />

      <FAQSection
        items={patientsFaqContent}
        eyebrow="Good to Know"
        heading="Questions About Our Patients & Reviews"
        headingId="patients-faq-heading"
      />

      <FinalCTASection content={patientsFinalCtaContent} />
    </>
  );
}
