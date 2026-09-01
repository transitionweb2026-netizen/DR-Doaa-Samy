"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll, RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { fadeUp, staggerContainer, cardReveal } from "@/components/motion/variants";
import { TreatmentCard } from "@/components/cards/TreatmentCard";
import { TreatmentModal } from "@/components/modals/TreatmentModal";
import { cn } from "@/lib/utils/cn";
import type { Treatment, TreatmentCategory } from "@/lib/types/content";

/**
 * One "chapter" of the Services catalogue. Reused for every category rather
 * than hand-built per category, but `index` drives enough variation
 * (alternating alignment, glow position) that no two chapters look
 * mechanically identical. Arriving here via a category-selector click (a
 * plain #hash link) briefly glows the heading — the "visual connection
 * between selector and target section."
 */
export function TreatmentCategorySection({
  category,
  index,
  total,
}: {
  category: TreatmentCategory;
  index: number;
  total: number;
}) {
  const [activeTreatment, setActiveTreatment] = useState<Treatment | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const alignRight = index % 2 === 1;

  // A transient visual "you arrived here" pulse when reached via the
  // category selector's #hash link — driven directly via a CSS class/
  // animation rather than React state, since it's a purely cosmetic,
  // self-clearing effect with no bearing on render output.
  useEffect(() => {
    function flashIfTargeted() {
      const el = headingRef.current;
      if (!el || window.location.hash !== `#${category.id}`) return;
      el.classList.remove("hash-glow");
      void el.offsetWidth; // force reflow so the animation can retrigger
      el.classList.add("hash-glow");
    }
    flashIfTargeted();
    window.addEventListener("hashchange", flashIfTargeted);
    return () => window.removeEventListener("hashchange", flashIfTargeted);
  }, [category.id]);

  return (
    <section
      id={category.id}
      aria-labelledby={`${category.id}-heading`}
      className="relative scroll-mt-24 overflow-hidden py-16 sm:scroll-mt-28 sm:py-20"
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute -z-10 h-[420px] w-[420px] rounded-full opacity-70 blur-3xl",
          alignRight
            ? "right-[-8%] top-0 bg-[radial-gradient(circle,rgba(184,105,97,0.16),transparent_70%)]"
            : "left-[-8%] top-0 bg-[radial-gradient(circle,rgba(216,136,128,0.18),transparent_70%)]",
        )}
      />

      <Container>
        <RevealOnScroll variants={fadeUp} className={cn("max-w-2xl", alignRight && "ml-auto text-right")}>
          <span
            className={cn(
              "mb-4 inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.25em] text-peach-300",
              alignRight && "flex-row-reverse",
            )}
          >
            <span className="h-px w-6 bg-peach-400/70" aria-hidden="true" />
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <h2
            ref={headingRef}
            id={`${category.id}-heading`}
            className="text-balance font-display text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08] text-text-primary"
          >
            {category.title}
          </h2>
          <p className="mt-4 text-balance font-body text-base leading-relaxed text-text-secondary">
            {category.description}
          </p>
        </RevealOnScroll>

        <RevealStagger
          variants={staggerContainer}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
        >
          {category.treatments.map((treatment) => (
            <RevealItem key={treatment.id} variants={cardReveal}>
              <TreatmentCard treatment={treatment} onOpen={() => setActiveTreatment(treatment)} />
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>

      <TreatmentModal treatment={activeTreatment} onClose={() => setActiveTreatment(null)} />
    </section>
  );
}
