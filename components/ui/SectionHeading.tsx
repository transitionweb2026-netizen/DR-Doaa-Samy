import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { fadeUp } from "@/components/motion/variants";

type SectionHeadingProps = {
  eyebrow?: string;
  heading: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
  headingClassName?: string;
};

export function SectionHeading({
  eyebrow,
  heading,
  description,
  align = "left",
  className,
  headingClassName,
}: SectionHeadingProps) {
  return (
    <RevealOnScroll
      variants={fadeUp}
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "mb-4 inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.25em] text-peach-300",
          )}
        >
          <span className="h-px w-6 bg-peach-400/70" aria-hidden="true" />
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "text-balance font-display text-[clamp(1.9rem,4vw,3.25rem)] font-medium leading-[1.1] text-text-primary",
          headingClassName,
        )}
      >
        {heading}
      </h2>
      {description ? (
        <p className="mt-5 text-balance font-body text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-text-secondary">
          {description}
        </p>
      ) : null}
    </RevealOnScroll>
  );
}
