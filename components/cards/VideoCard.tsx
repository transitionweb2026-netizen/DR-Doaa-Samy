import { Play } from "lucide-react";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import type { VideoItem } from "@/lib/types/content";

export function VideoCard({ video, onOpen }: { video: VideoItem; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`Play "${video.title}"`}
      className="group relative aspect-[9/16] w-full overflow-hidden rounded-[26px] border border-glass-border text-left"
    >
      <MediaFrame
        image={video.thumbnail}
        tone="charcoal"
        label={video.category}
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
        className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.07]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,10,9,0.05)_30%,rgba(18,10,9,0.85)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.16)_50%,transparent_65%)] transition-transform duration-700 ease-out group-hover:translate-x-full"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="glass-surface flex h-14 w-14 items-center justify-center rounded-full text-text-primary transition-transform duration-300 group-hover:scale-110">
          <Play size={18} fill="currentColor" className="ml-0.5" aria-hidden="true" />
        </span>
      </div>

      {video.durationLabel ? (
        <span className="absolute right-4 top-4 rounded-full border border-glass-border bg-glass-bg-strong px-2.5 py-1 font-body text-[10px] font-medium text-text-primary backdrop-blur-md">
          {video.durationLabel}
        </span>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-peach-300">
          {video.category}
        </p>
        {/* A <button> can't contain heading elements (not phrasing content)
            — visually identical span, matching ServiceCard/CategoryCard's
            same pattern for interactive card titles. */}
        <span className="mt-1 block text-balance font-display text-lg font-medium leading-tight text-text-primary">
          {video.title}
        </span>
      </div>
    </button>
  );
}
