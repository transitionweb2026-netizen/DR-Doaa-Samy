"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { ModalShell } from "./ModalShell";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { Button } from "@/components/ui/Button";
import type { VideoItem } from "@/lib/types/content";

export function VideoModal({
  video,
  onClose,
  tone = "dark",
}: {
  video: VideoItem | null;
  onClose: () => void;
  /** "blush" renders the light soft-pink glass variant (Videos page). */
  tone?: "dark" | "blush";
}) {
  const titleId = "video-modal-title";
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <ModalShell isOpen={Boolean(video)} onClose={onClose} titleId={titleId} tone={tone}>
      {video ? (
        <div className="flex flex-col gap-6">
          <div className="glass-surface relative aspect-video w-full overflow-hidden rounded-[20px]">
            <MediaFrame image={video.thumbnail} tone="charcoal" className="h-full w-full" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,10,9,0.1)_0%,rgba(18,10,9,0.5)_100%)]"
            />
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-pressed={isPlaying}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="glass-surface flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-text-primary transition-transform duration-300 hover:scale-105">
                {isPlaying ? (
                  <Pause size={22} fill="currentColor" aria-hidden="true" />
                ) : (
                  <Play size={22} fill="currentColor" className="ml-1" aria-hidden="true" />
                )}
              </span>
            </button>
            {!video.videoUrl ? (
              <span className="absolute bottom-4 right-4 rounded-full border border-glass-border bg-glass-bg-strong px-3 py-1 font-body text-[11px] font-medium text-text-primary backdrop-blur-md">
                Video coming soon
              </span>
            ) : null}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">
                {video.category}
              </p>
              {video.durationLabel ? (
                <span className="font-body text-xs text-text-muted">{video.durationLabel}</span>
              ) : null}
            </div>
            <h3 id={titleId} className="mt-2 font-display text-2xl font-medium text-text-primary sm:text-3xl">
              {video.title}
            </h3>
            {video.description ? (
              <p className="mt-3 font-body text-base leading-relaxed text-text-secondary">{video.description}</p>
            ) : null}
          </div>

          <Button href="/contact" variant="primary" size="lg" className="justify-center">
            Book a Consultation
          </Button>
        </div>
      ) : null}
    </ModalShell>
  );
}
