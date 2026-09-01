"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { cn } from "@/lib/utils/cn";
import type { ImageAsset } from "@/lib/types/content";

/**
 * Editorial video frame with a working play/pause affordance. No real
 * video source is wired up yet — swap `poster.src` for a real thumbnail
 * and connect an actual <video>/player once footage is available.
 */
export function IntroVideoFrame({
  poster,
  durationLabel,
  aspectClassName = "aspect-[4/5] sm:aspect-[16/11]",
  className,
}: {
  poster: ImageAsset;
  durationLabel?: string;
  /** Override the frame's aspect ratio — e.g. a wider cinematic ratio for a standalone feature placement. */
  aspectClassName?: string;
  className?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={cn("glass-surface relative w-full overflow-hidden rounded-[32px]", aspectClassName, className)}>
      <MediaFrame image={poster} tone="charcoal" label="Introduction Video" className="h-full w-full" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,10,9,0.05)_0%,rgba(18,10,9,0.55)_100%)]"
      />

      <button
        type="button"
        onClick={() => setIsPlaying((p) => !p)}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Pause introduction video" : "Play introduction video"}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="glass-surface flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-text-primary transition-transform duration-300 hover:scale-105 sm:h-20 sm:w-20">
          {isPlaying ? (
            <Pause size={24} fill="currentColor" aria-hidden="true" />
          ) : (
            <Play size={24} fill="currentColor" className="ml-1" aria-hidden="true" />
          )}
        </span>
      </button>

      {durationLabel ? (
        <span className="absolute bottom-5 right-5 rounded-full border border-glass-border bg-glass-bg-strong px-3 py-1 font-body text-xs font-medium text-text-primary backdrop-blur-md">
          {durationLabel}
        </span>
      ) : null}
    </div>
  );
}
