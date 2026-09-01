import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type GlassCardVariant = "soft" | "elevated" | "dark" | "accent" | "floating";

const VARIANT_STYLES: Record<GlassCardVariant, string> = {
  // Gentle, low-contrast tint — good for dense grids (reviews, FAQ)
  soft: "bg-[linear-gradient(165deg,rgba(255,214,184,0.08),rgba(255,214,184,0.03))] border-glass-border",
  // Used for hero-adjacent, stats, and primary showcase surfaces
  elevated:
    "bg-[linear-gradient(165deg,rgba(255,214,184,0.13),rgba(255,214,184,0.04))] border-[rgba(255,224,202,0.22)] shadow-[0_30px_70px_-25px_rgba(20,8,6,0.7)]",
  // Deeper, moodier tint for dark showcase panels (why-doctor, journey)
  dark: "bg-[linear-gradient(165deg,rgba(36,22,19,0.85),rgba(27,16,14,0.9))] border-[rgba(255,224,202,0.1)]",
  // Accent-forward tint for CTAs / highlighted callouts
  accent:
    "bg-[linear-gradient(165deg,rgba(216,136,128,0.18),rgba(184,105,97,0.1))] border-[rgba(231,179,174,0.28)] shadow-glow-peach",
  // For cards that visually float above the layout (journey nodes, badges)
  floating:
    "bg-[linear-gradient(165deg,rgba(255,214,184,0.16),rgba(255,214,184,0.05))] border-[rgba(255,224,202,0.24)] shadow-[0_20px_50px_-18px_rgba(20,8,6,0.75)]",
};

type GlassCardProps = {
  children: ReactNode;
  variant?: GlassCardVariant;
  className?: string;
  as?: ElementType;
} & Record<string, unknown>;

/**
 * Premium tinted-glass card. One flexible primitive rather than five
 * near-duplicate components — pass `variant` to pick the tonal treatment.
 */
export function GlassCard({
  children,
  variant = "soft",
  className,
  as: Tag = "div",
  ...rest
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "glass-surface rounded-[28px]",
        VARIANT_STYLES[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
