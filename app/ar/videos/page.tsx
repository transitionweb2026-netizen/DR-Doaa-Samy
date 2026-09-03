import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { FeaturedVideosSection } from "@/components/sections/FeaturedVideosSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { videosHeroContentAr } from "@/data/ar/videos/hero";
import { videoCatalogueAr } from "@/data/ar/videos/catalogue";
import { videosFinalCtaContentAr } from "@/data/ar/videos/final-cta";
import { videosSectionCopyAr } from "@/data/ar/sectionCopy";
import { getHeroContent } from "@/lib/cms/hero";
import { getFinalCtaContent } from "@/lib/cms/finalCta";
import { getSectionCopy } from "@/lib/cms/sectionCopy";
import { getVideos } from "@/lib/cms/collections";

export const metadata: Metadata = {
  title: "الفيديوهات",
  description: "فيديوهات تعليمية من د. دعاء سامي عن طب الجلدية والعناية بالبشرة والعلاجات التجميلية — شرح واضح لما يجب توقعه.",
  alternates: {
    canonical: "/ar/videos",
    languages: { en: "/videos", ar: "/ar/videos" },
  },
  openGraph: {
    title: "الفيديوهات | د. دعاء سامي",
    description: "فيديوهات تعليمية عن طب الجلدية والعناية بالبشرة والعلاجات التجميلية.",
    url: "/ar/videos",
  },
};

const PAGE = "videos";
const locale = "ar" as const;

export default async function VideosPageAr() {
  const [hero, videos, libraryCopy, finalCta] = await Promise.all([
    getHeroContent(PAGE, locale, videosHeroContentAr),
    getVideos(PAGE, "library", locale, videoCatalogueAr),
    getSectionCopy(PAGE, "library", locale, videosSectionCopyAr.library),
    getFinalCtaContent(PAGE, locale, videosFinalCtaContentAr),
  ]);

  return (
    <>
      <HeroSection content={hero} id="videos-hero" ariaLabel="الفيديوهات" />

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
