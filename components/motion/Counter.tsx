"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";

type CounterProps = {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

/**
 * Animated number counter that counts up once its section enters the
 * viewport. Falls back to displaying the final value instantly when the
 * user prefers reduced motion.
 */
export function Counter({ value, suffix = "", duration = 1.8, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      motionValue.set(value);
      return;
    }
    motionValue.set(value);
  }, [isInView, motionValue, value, prefersReducedMotion]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (!ref.current) return;
      const formatted = Math.round(latest).toLocaleString("en-US");
      ref.current.textContent = `${formatted}${suffix}`;
    });
    return unsubscribe;
  }, [spring, suffix]);

  return (
    <span ref={ref} className={className} aria-hidden="true">
      0{suffix}
    </span>
  );
}
