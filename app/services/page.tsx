import { Fragment } from "react";
import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { CategorySelectorSection } from "@/components/sections/services/CategorySelectorSection";
import { TreatmentCategorySection } from "@/components/sections/services/TreatmentCategorySection";
import { BookingPrompt } from "@/components/sections/services/BookingPrompt";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { treatmentCategories } from "@/data/services/categories";
import { servicesFinalCtaContent } from "@/data/services/final-cta";

export const metadata: Metadata = {
  title: "Services",
  description:
    "The full range of dermatology and aesthetic treatments Dr. Doaa Samy provides — hair, skin, face, lips & under-eye, and advanced technology-led treatments.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services | Dr. Doaa Samy",
    description:
      "The full range of dermatology and aesthetic treatments Dr. Doaa Samy provides, organized by concern.",
    url: "/services",
  },
};

// Insert the mid-page booking prompt after this many category chapters.
const BOOKING_PROMPT_AFTER_INDEX = 2;

export default function ServicesPage() {
  return (
    <>
      {/* Reused exactly — same component, same default content as Home. */}
      <HeroSection />

      <CategorySelectorSection />

      {treatmentCategories.map((category, index) => (
        <Fragment key={category.id}>
          <TreatmentCategorySection category={category} index={index} total={treatmentCategories.length} />
          {index === BOOKING_PROMPT_AFTER_INDEX ? <BookingPrompt /> : null}
        </Fragment>
      ))}

      <FinalCTASection content={servicesFinalCtaContent} />
    </>
  );
}
