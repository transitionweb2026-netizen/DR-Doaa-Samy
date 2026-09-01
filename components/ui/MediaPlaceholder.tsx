import Image from "next/image";
import { ImageIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ImageAsset } from "@/lib/types/content";

type Tone = "peach" | "rose" | "blush" | "charcoal";

const TONE_GRADIENTS: Record<Tone, string> = {
  peach: "from-[#e7b6b1] via-[#d88880] to-[#a0534b]",
  rose: "from-[#d7a29d] via-[#b86961] to-[#241613]",
  blush: "from-[#f6d7cd] via-[#e5a494] to-[#8f584d]",
  charcoal: "from-[#3a2420] via-[#241613] to-[#120a09]",
};

type MediaFrameProps = {
  image?: ImageAsset;
  tone?: Tone;
  icon?: LucideIcon;
  label?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Renders a real, optimized next/image when `image.src` is supplied.
 * Otherwise renders a branded gradient placeholder (tone + icon + label)
 * so layouts look finished before real photography is dropped in — just
 * pass `image.src` later and this component swaps automatically.
 */
export function MediaFrame({
  image,
  tone = "peach",
  icon: Icon = ImageIcon,
  label,
  className,
  imageClassName,
  sizes = "100vw",
  priority = false,
}: MediaFrameProps) {
  if (image?.src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={image?.alt ?? label ?? "Placeholder image"}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br",
        TONE_GRADIENTS[tone],
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30 mix-blend-overlay [background-image:radial-gradient(circle_at_30%_20%,white,transparent_45%)]"
      />
      <Icon
        aria-hidden="true"
        className="relative h-8 w-8 text-white/70 sm:h-10 sm:w-10"
        strokeWidth={1.25}
      />
      {label ? (
        <span className="relative font-body text-[11px] font-medium uppercase tracking-[0.2em] text-white/70">
          {label}
        </span>
      ) : null}
    </div>
  );
}
