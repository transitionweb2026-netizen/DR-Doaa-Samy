"use client";

import { useRef, useState } from "react";
import { Loader2, Pause, Play } from "lucide-react";
import { ModalShell } from "./ModalShell";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { Button } from "@/components/ui/Button";
import { useLocale, localizedHref } from "@/lib/i18n/LocaleContext";
import { getUiStrings } from "@/lib/i18n/ui";
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
  // A tap doesn't mean instant playback — a large file on a slow mobile
  // connection can take a while to buffer. Without this, that wait looks
  // indistinguishable from the video being broken.
  const [isBuffering, setIsBuffering] = useState(false);
  // Many of the clinic's clips are shot in portrait (phone) orientation.
  // A fixed 16:9 box would force them into a landscape crop that cuts off
  // most of the frame — so the box adapts to the real footage instead,
  // falling back to 16:9 only until metadata (or nothing, for the
  // "coming soon" placeholder) tells us otherwise.
  const [videoAspect, setVideoAspect] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const locale = useLocale();
  const t = getUiStrings(locale);

  // A fresh video was opened (or the modal closed) — don't carry over the
  // previous one's playing state onto an element that hasn't started yet.
  // Adjusted during render (React's documented pattern for resetting state
  // on a prop change) rather than in an effect, which would double-render.
  const [prevVideoId, setPrevVideoId] = useState(video?.id);
  if (video?.id !== prevVideoId) {
    setPrevVideoId(video?.id);
    setIsPlaying(false);
    setIsBuffering(false);
    setVideoAspect(null);
  }

  function toggle() {
    if (video?.videoUrl && videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else {
        setIsBuffering(true);
        videoRef.current.play();
      }
    }
    setIsPlaying((p) => !p);
  }

  return (
    <ModalShell isOpen={Boolean(video)} onClose={onClose} titleId={titleId} tone={tone}>
      {video ? (
        <div className="flex flex-col gap-6">
          <div
            className="glass-surface relative w-full overflow-hidden rounded-[20px]"
            style={{ aspectRatio: videoAspect ?? 16 / 9, maxHeight: "75vh" }}
          >
            {video.videoUrl ? (
              <video
                ref={videoRef}
                src={video.videoUrl}
                poster={video.thumbnail.src}
                controls={isPlaying}
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => {
                  const { videoWidth, videoHeight } = e.currentTarget;
                  if (videoWidth && videoHeight) setVideoAspect(videoWidth / videoHeight);
                }}
                onPause={() => {
                  setIsPlaying(false);
                  setIsBuffering(false);
                }}
                onEnded={() => {
                  setIsPlaying(false);
                  setIsBuffering(false);
                }}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
                // This modal's panel animates in with scale/filter (see
                // ModalShell's modalReveal variant), and Motion leaves that
                // transform/filter set as a persistent inline style even at
                // rest — which on iOS Safari can make a <video> nested
                // inside it fail to render (stays black/frozen) since the
                // browser composites it as part of the parent's filtered
                // layer. Promoting the video to its own GPU layer works
                // around it.
                //
                // object-contain (not cover): the box above now matches the
                // real footage's aspect ratio, but until that metadata
                // loads — or if maxHeight clamps an extreme ratio — this
                // guarantees the frame is never cropped, only letterboxed.
                className="h-full w-full transform-gpu object-contain"
              />
            ) : (
              <MediaFrame image={video.thumbnail} tone="charcoal" className="h-full w-full" />
            )}

            {!isPlaying ? (
              <>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,10,9,0.1)_0%,rgba(18,10,9,0.5)_100%)]"
                />
                <button
                  type="button"
                  onClick={toggle}
                  aria-pressed={isPlaying}
                  aria-label={t.playVideo}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="glass-surface flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-text-primary transition-transform duration-300 hover:scale-105">
                    <Play size={22} fill="currentColor" className="ml-1" aria-hidden="true" />
                  </span>
                </button>
                {!video.videoUrl ? (
                  <span className="absolute bottom-4 end-4 rounded-full border border-glass-border bg-glass-bg-strong px-3 py-1 font-body text-[11px] font-medium text-text-primary backdrop-blur-md">
                    {t.videoComingSoon}
                  </span>
                ) : null}
              </>
            ) : !video.videoUrl ? (
              <button
                type="button"
                onClick={toggle}
                aria-pressed={isPlaying}
                aria-label={t.pauseVideo}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="glass-surface flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-text-primary transition-transform duration-300 hover:scale-105">
                  <Pause size={22} fill="currentColor" aria-hidden="true" />
                </span>
              </button>
            ) : null}

            {isPlaying && isBuffering ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="glass-surface flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-text-primary">
                  <Loader2 size={22} className="animate-spin" aria-hidden="true" />
                </span>
              </div>
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

          <Button href={localizedHref(locale, "/contact")} variant="primary" size="lg" className="justify-center">
            {t.bookConsultation}
          </Button>
        </div>
      ) : null}
    </ModalShell>
  );
}
