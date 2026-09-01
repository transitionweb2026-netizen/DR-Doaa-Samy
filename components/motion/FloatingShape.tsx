import { cn } from "@/lib/utils/cn";

type FloatingShapeProps = {
  className?: string;
  tone?: "peach" | "rose" | "blush";
  speed?: "slow" | "slower";
};

const TONE_GRADIENTS: Record<NonNullable<FloatingShapeProps["tone"]>, string> = {
  peach: "bg-[radial-gradient(circle,var(--color-peach-400)_0%,transparent_72%)]",
  rose: "bg-[radial-gradient(circle,var(--color-rose-400)_0%,transparent_72%)]",
  blush: "bg-[radial-gradient(circle,var(--color-blush-400)_0%,transparent_72%)]",
};

/**
 * Ambient blurred atmosphere blob. Purely decorative — kept out of the
 * accessibility tree and paused for reduced-motion users via the
 * global CSS animation-duration override.
 */
export function FloatingShape({ className, tone = "peach", speed = "slow" }: FloatingShapeProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full opacity-40 blur-3xl",
        TONE_GRADIENTS[tone],
        speed === "slow" ? "animate-float-slow" : "animate-float-slower",
        className,
      )}
    />
  );
}
