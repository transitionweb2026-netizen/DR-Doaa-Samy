"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Sparkle } from "lucide-react";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { ImageAsset } from "@/lib/types/content";

/**
 * The layered "playing card" portrait stack from the Why Dr. Doaa section.
 * The front card tilts gently toward the cursor for a tactile, physical
 * feel — disabled outright for prefers-reduced-motion. `image` is CMS-driven
 * (portrait_media_id on the home:why_doctor / about:message sections); when
 * unset it renders the same brand placeholder tone as before.
 */
export function WhyDoctorPortrait({ image }: { image?: ImageAsset }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const locale = useLocale();
  const doctorLabel = locale === "ar" ? "دعاء سامي" : "Dr. Doaa Samy";
  const roleLabel = locale === "ar" ? "استشارية الأمراض الجلدية" : "Dermatologist";
  const defaultAlt = locale === "ar" ? "د. دعاء سامي في العيادة" : "Dr. Doaa Samy in the clinic";

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 160, damping: 22 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 160, damping: 22 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width);
    my.set((event.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full max-w-sm py-6"
      style={{ perspective: 1200 }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-6 -bottom-4 top-10 -z-10 rotate-[6deg] rounded-[30px] border border-glass-border bg-canvas-raised/70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-3 -bottom-2 top-5 -z-10 -rotate-[3deg] rounded-[30px] border border-glass-border bg-canvas-alt/80"
      />

      <motion.div
        style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="glass-surface relative aspect-[3/4] w-full overflow-hidden rounded-[30px]"
      >
        <MediaFrame
          image={image ?? { alt: defaultAlt }}
          tone="rose"
          label={doctorLabel}
          sizes="(max-width: 1024px) 80vw, 32vw"
          className="h-full w-full"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(18,10,9,0.65)_100%)]"
        />
        <span className="glass-surface absolute bottom-5 start-5 inline-flex items-center gap-2 rounded-full px-4 py-2 font-body text-xs font-medium text-text-primary">
          <Sparkle size={13} className="text-peach-300" aria-hidden="true" />
          {roleLabel}
        </span>
      </motion.div>
    </div>
  );
}
