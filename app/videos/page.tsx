import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { FeaturedVideosSection } from "@/components/sections/FeaturedVideosSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { videosHeroContent } from "@/data/videos/hero";
import { videoCatalogue } from "@/data/videos/catalogue";
import { videosFinalCtaContent } from "@/data/videos/final-cta";
import { getHeroContent } from "@/lib/cms/hero";
import { getFinalCtaContent } from "@/lib/cms/finalCta";
import { getSectionCopy } from "@/lib/cms/sectionCopy";
import { getVideos } from "@/lib/cms/collections";
import { DEFAULT_LOCALE } from "@/lib/cms/types";

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

const PAGE = "videos";
const locale = DEFAULT_LOCALE;

export default async function VideosPage() {
  const [hero, videos, libraryCopy, finalCta] = await Promise.all([
    getHeroContent(PAGE, locale, videosHeroContent),
    getVideos(PAGE, "library", locale, videoCatalogue),
    getSectionCopy(PAGE, "library", locale, {
      eyebrow: "Watch & Learn",
      heading: "Featured Videos",
      description: "Short, editorial pieces on treatments, skin science, and life inside the clinic.",
    }),
    getFinalCtaContent(PAGE, locale, videosFinalCtaContent),
  ]);

  return (
    <>
      <HeroSection content={hero} id="videos-hero" ariaLabel="Videos" />

      <FeaturedVideosSection
        videos={videos}
        headingId="all-videos-heading"
        showCta={false}
        tone="blush"
        {...libraryCopy}
      />

      <FinalCTASection content={finalCta} />
    </>
  );
}
