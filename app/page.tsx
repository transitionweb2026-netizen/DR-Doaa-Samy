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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <DoctorIntroSection />
      <FeaturedServicesSection />
      <CasesSection />
      <WhyDoctorSection />
      <PatientJourneySection />
      <ReviewsSection />
      <FeaturedVideosSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
