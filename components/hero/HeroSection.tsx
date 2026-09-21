"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/Button";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { HeroContactPanel } from "./HeroContactPanel";
import { heroContent } from "@/data/home/hero";
import { EASE_PREMIUM, fadeUp, staggerContainer } from "@/components/motion/variants";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { HeroContent } from "@/lib/types/content";

/**
 * The site's Hero grammar, shared by every page that opens with one —
 * same full-bleed backdrop, scrims, layout and motion regardless of page,
 * so different chapters (Home, About, …) genuinely look like each other.
 * Only the content and image differ.
 */
export function HeroSection({
  content = heroContent,
  id = "hero",
  ariaLabel,
}: {
  content?: HeroContent;
  id?: string;
  ariaLabel?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const locale = useLocale();
  const resolvedAriaLabel = ariaLabel ?? (locale === "ar" ? "مقدمة" : "Introduction");

  // Cinematic scroll parallax — the backdrop drifts up slightly slower
  // than the page for depth; the copy eases out as the section scrolls away.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const backdropY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label={resolvedAriaLabel}
      className="relative min-h-[100svh] w-full overflow-hidden"
    >
      {/* Single full-bleed photographic backdrop — the portrait IS the
          environment, not a separate boxed image. Extra top/bottom bleed
          keeps the parallax drift from ever exposing an edge.
          Height is pinned to one viewport (not the section's full height)
          — on mobile the stacked copy (name/role/headline/description/
          CTAs) regularly runs to 1.5x a phone's viewport, and stretching
          a landscape-shot photo with object-cover across a box that tall
          and narrow forced an extreme zoom that cropped almost the whole
          frame down to a close-up of just the face. Capping it lets the
          full composition show — desktop's section height already equals
          one viewport, so this is a no-op there. The dark scrim below
          continues over the section's real (taller) height, fading into
          the page background where the image now stops. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 -top-16 -z-20 h-[calc(100svh+8rem)]"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE_PREMIUM }}
        style={prefersReducedMotion ? undefined : { y: backdropY }}
      >
        {/* The source photo is a tall portrait (~941x1672) but this frame
            is always wider than it is tall on desktop, so object-cover
            crops most of the photo's height away. Centered vertically,
            that crop lands mid-torso and cuts the subject's head off
            entirely on shorter/laptop-height screens. Anchoring higher
            (28% from the top) keeps the face in frame from ~650px tall
            up through full desktop heights. Mobile's box is much closer
            to the photo's own aspect ratio — barely any vertical crop
            happens there either way — so it's left centered.
            All of the site's hero placements currently share this one
            photo; if a page ever gets a differently-composed photo of
            its own, this anchor may need to move with it. */}
        <MediaFrame
          image={content.portrait}
          tone="rose"
          priority
          sizes="100vw"
          className="h-full w-full"
          imageClassName="object-center sm:object-[50%_28%]"
        />
      </motion.div>

      {/* Readability scrims — left-to-right for the copy, top/bottom so the
          nav and the bottom row (scroll cue + contact card) sit on solid
          ground. Tuned lighter on desktop where the source image already
          carries a dark left field; heavier on mobile where text sits
          directly over the portrait. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,7,6,0.6)_0%,rgba(12,7,6,0.15)_22%,rgba(12,7,6,0.35)_72%,rgba(12,7,6,0.82)_100%)] lg:bg-[linear-gradient(100deg,rgba(12,7,6,0.88)_0%,rgba(12,7,6,0.55)_32%,rgba(12,7,6,0.08)_58%,transparent_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,7,6,0.35)_0%,transparent_18%,transparent_76%,rgba(12,7,6,0.55)_100%)]" />
      </div>

      <motion.div
        style={prefersReducedMotion ? undefined : { opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-16 pt-32 sm:px-8 sm:pt-40 lg:px-12 lg:pb-0"
      >
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-xl">
          <motion.h1
            variants={fadeUp}
            className="text-balance font-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.05] text-text-primary"
          >
            {content.name}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-3 font-body text-lg font-medium text-peach-300 sm:text-xl">
            {content.role}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-balance font-display text-[clamp(1.25rem,2.4vw,1.75rem)] font-normal leading-snug text-text-primary/90"
          >
            {content.headline}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-md text-balance font-body text-base leading-relaxed text-text-secondary"
          >
            {content.description}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
            <Button href={content.primaryCta.href} variant="primary" size="lg">
              {content.primaryCta.label}
            </Button>
            <Button href={content.secondaryCta.href} variant="ghost" size="lg" showIcon={false}>
              {content.secondaryCta.label}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue — centered along the bottom edge */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_PREMIUM, delay: 1.1 }}
        className="pointer-events-none absolute inset-x-0 bottom-8 z-10 hidden flex-col items-center gap-2 sm:flex lg:bottom-10"
      >
        <span className="glass-surface inline-flex h-9 w-6 items-start justify-center rounded-full pt-1.5">
          <motion.span
            aria-hidden="true"
            className="h-1.5 w-1 rounded-full bg-peach-300"
            animate={prefersReducedMotion ? undefined : { y: [0, 8, 0], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        <span className="font-body text-[10px] font-medium uppercase tracking-[0.25em] text-text-muted">
          {locale === "ar" ? "مرري للأسفل" : "Scroll Down"}
        </span>
      </motion.div>

      {/* Contact panel — lower-right, floats over the backdrop */}
      {/* Below `sm`, a phone-height viewport doesn't have room to pin this
          over the copy without colliding with the CTA row — so it flows in
          document order there instead, and only becomes an absolutely
          positioned overlay from `sm` up, where the earlier breakpoints
          confirmed it fits cleanly. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_PREMIUM, delay: 0.9 }}
        className="relative z-20 mt-10 flex justify-center px-5 pb-10 sm:absolute sm:bottom-8 sm:end-8 sm:mt-0 sm:justify-end sm:px-0 sm:pb-0 lg:bottom-10 lg:end-12"
      >
        <HeroContactPanel />
      </motion.div>
    </section>
  );
}
