"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";

/**
 * The connecting line behind the journey steps fills in sync with scroll
 * progress through the section — vertical on mobile, horizontal from `lg`.
 * A single scroll-driven value drives both scaleX and scaleY; whichever
 * axis is visually a hairline at the current breakpoint is the one that's
 * actually doing the work, so no breakpoint branching is needed in JS.
 */
export function JourneyProgressLine() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 55%"],
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 start-8 top-0 w-px lg:bottom-auto lg:inset-x-0 lg:top-8 lg:h-px lg:w-auto"
    >
      <div className="absolute inset-0 bg-glass-border" />
      <motion.div
        // The steps themselves mirror under RTL (grid auto-placement
        // follows direction), so the fill has to start from the same side
        // they now begin reading from, not always the physical left.
        className="absolute inset-0 origin-top bg-gradient-to-b from-peach-400 via-peach-300/60 to-transparent lg:origin-left lg:bg-gradient-to-r rtl:lg:origin-right rtl:lg:bg-gradient-to-l"
        style={
          prefersReducedMotion
            ? { scaleY: 1, scaleX: 1 }
            : { scaleY: scrollYProgress, scaleX: scrollYProgress }
        }
      />
    </div>
  );
}
