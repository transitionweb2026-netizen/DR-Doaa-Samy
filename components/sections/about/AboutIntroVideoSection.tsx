import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { scaleIn, fadeUp } from "@/components/motion/variants";
import { IntroVideoFrame } from "@/components/sections/IntroVideoFrame";
import { aboutIntroVideoContent } from "@/data/about/intro-video";
import type { ImageAsset } from "@/lib/types/content";

/**
 * A large, standalone cinematic video feature — no side text, the video
 * itself is the entire composition. Distinct from Home's split video+copy
 * treatment: same glass-frame language, wider and more dominant.
 */
export function AboutIntroVideoSection({
  content = aboutIntroVideoContent,
}: {
  content?: { eyebrow: string; heading: string; video: ImageAsset & { durationLabel?: string } };
}) {
  return (
    <section aria-labelledby="about-video-heading" className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,136,128,0.16),transparent_70%)] blur-3xl"
      />

      <Container className="flex flex-col items-center">
        <RevealOnScroll variants={fadeUp} className="max-w-xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.25em] text-peach-300">
            <span className="h-px w-6 bg-peach-400/70" aria-hidden="true" />
            {content.eyebrow}
            <span className="h-px w-6 bg-peach-400/70" aria-hidden="true" />
          </span>
          <h2
            id="about-video-heading"
            className="text-balance font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-medium leading-[1.15] text-text-primary"
          >
            {content.heading}
          </h2>
        </RevealOnScroll>

        <RevealOnScroll variants={scaleIn} className="mt-12 w-full max-w-5xl">
          <IntroVideoFrame
            poster={content.video}
            durationLabel={content.video.durationLabel}
            aspectClassName="aspect-video"
            className="rounded-[40px] shadow-[0_40px_100px_-30px_rgba(20,8,6,0.7)]"
          />
        </RevealOnScroll>
      </Container>
    </section>
  );
}
