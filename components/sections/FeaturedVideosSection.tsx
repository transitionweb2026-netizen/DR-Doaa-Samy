"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { staggerContainer, cardReveal } from "@/components/motion/variants";
import { VideoCard } from "@/components/cards/VideoCard";
import { VideoModal } from "@/components/modals/VideoModal";
import { featuredVideos } from "@/data/home/videos";
import { useLocale, localizedHref } from "@/lib/i18n/LocaleContext";
import { getUiStrings } from "@/lib/i18n/ui";
import type { VideoItem } from "@/lib/types/content";

export function FeaturedVideosSection({
  videos = featuredVideos,
  eyebrow = "Watch & Learn",
  heading = "Featured Videos",
  headingId = "videos-heading",
  description = "Short, editorial pieces on treatments, skin care, and life inside the clinic.",
  showCta = true,
  tone = "dark",
}: {
  videos?: VideoItem[];
  eyebrow?: string;
  heading?: string;
  headingId?: string;
  description?: string;
  /** Hide the "View All Videos" link when already on its destination page. */
  showCta?: boolean;
  /** "blush" opens the light glass modal (Videos page); "dark" (default) matches Home's teaser. */
  tone?: "dark" | "blush";
}) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const locale = useLocale();
  const t = getUiStrings(locale);

  return (
    <section aria-labelledby={headingId} className="relative py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          heading={<span id={headingId}>{heading}</span>}
          description={description}
        />

        <RevealStagger
          variants={staggerContainer}
          className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3"
        >
          {videos.map((video) => (
            <RevealItem key={video.id} variants={cardReveal}>
              <VideoCard video={video} onOpen={() => setActiveVideo(video)} />
            </RevealItem>
          ))}
        </RevealStagger>

        {showCta ? (
          <div className="mt-12 flex justify-center">
            <Button href={localizedHref(locale, "/videos")} variant="glass" size="lg">
              {t.viewAllVideos}
            </Button>
          </div>
        ) : null}
      </Container>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} tone={tone} />
    </section>
  );
}
