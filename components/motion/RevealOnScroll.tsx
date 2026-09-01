"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp } from "./variants";

type RevealOnScrollProps = {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  /** Delay in seconds, useful for manual staggering outside a stagger container. */
  delay?: number;
  once?: boolean;
  /** How much of the element must enter the viewport before animating. */
  amount?: number;
  as?: "div" | "section" | "span" | "ul" | "li";
};

/**
 * Viewport-triggered reveal wrapper. Wraps a section/element and animates
 * it into view once using the shared premium easing curve.
 */
export function RevealOnScroll({
  children,
  variants = fadeUp,
  className,
  delay = 0,
  once = true,
  amount = 0.3,
  as = "div",
}: RevealOnScrollProps) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}

/**
 * A single staggered item, meant to be used as a direct child of
 * <RevealStagger>. Kept here (rather than inline `motion.div` in section
 * files) so section components can stay Server Components — the `motion`
 * package ships no "use client" banner of its own, so the boundary has to
 * live in a dedicated client file like this one.
 */
export function RevealItem({
  children,
  variants,
  className,
}: {
  children: ReactNode;
  variants?: Variants;
  className?: string;
}) {
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Container that staggers its direct motion children into view.
 */
export function RevealStagger({
  children,
  className,
  variants,
  once = true,
  amount = 0.2,
  as = "div",
}: Omit<RevealOnScrollProps, "delay">) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
