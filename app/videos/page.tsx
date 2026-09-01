import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { FeaturedVideosSection } from "@/components/sections/FeaturedVideosSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { videosHeroContent } from "@/data/videos/hero";
import { videoCatalogue } from "@/data/videos/catalogue";
import { videosFinalCtaContent } from "@/data/videos/final-cta";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Educational videos from Dr. Doaa Samy on dermatology, skincare, and aesthetic treatments — clear explanations of what to expect.",
  alternates: {
    canonical: "/videos",
  },
  openGraph: {
    title: "Videos | Dr. Doaa Samy",
    description: "Educational videos on dermatology, skincare, and aesthetic treatments.",
    url: "/videos",
  },
};

export default function VideosPage() {
  return (
    <>
      <HeroSection content={videosHeroContent} id="videos-hero" ariaLabel="Videos" />

      <FeaturedVideosSection
        videos={videoCatalogue}
        eyebrow="Watch & Learn"
        heading="Featured Videos"
        headingId="all-videos-heading"
        description="Short, editorial pieces on treatments, skin science, and life inside the clinic."
        showCta={false}
        tone="blush"
      />

      <FinalCTASection content={videosFinalCtaContent} />
    </>
  );
}
