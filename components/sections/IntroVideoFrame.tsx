"use client";

import { useRef, useState } from "react";
import { Loader2, Play } from "lucide-react";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { cn } from "@/lib/utils/cn";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { ImageAsset } from "@/lib/types/content";

/**
 * Editorial frame for the "intro video" sections. With no videoUrl set,
 * this is just the cover image, exactly as uploaded — no play button or
 * duration badge, since there's nothing to play. Once a real video is
 * uploaded (videoUrl set), the play button appears and starts real
 * playback in place, with the poster as the <video>'s poster frame and
 * native controls once it's running.
 */
export function IntroVideoFrame({
  poster,
  videoUrl,
  durationLabel,
  aspectClassName = "aspect-[4/5] sm:aspect-[16/11]",
  className,
}: {
  poster: ImageAsset;
  videoUrl?: string;
  durationLabel?: string;
  /** Override the frame's aspect ratio — e.g. a wider cinematic ratio for a standalone feature placement. */
  aspectClassName?: string;
  className?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  // A tap doesn't mean instant playback — a large file on a slow mobile
  // connection can take a while to buffer. Without this, that wait looks
  // indistinguishable from the video being broken.
  const [isBuffering, setIsBuffering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const locale = useLocale();
  const label = locale === "ar" ? "فيديو تعريفي" : "Introduction Video";
  const playLabel = locale === "ar" ? "تشغيل الفيديو التعريفي" : "Play introduction video";

  if (!videoUrl) {
    return (
      <div className={cn("glass-surface relative w-full overflow-hidden rounded-[32px]", aspectClassName, className)}>
        <MediaFrame image={poster} tone="charcoal" label={label} className="h-full w-full" />
      </div>
    );
  }

  function toggle() {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else {
      setIsBuffering(true);
      videoRef.current.play();
    }
    setIsPlaying((p) => !p);
  }

  return (
    <div className={cn("glass-surface relative w-full overflow-hidden rounded-[32px]", aspectClassName, className)}>
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster.src}
        controls={isPlaying}
        playsInline
        preload="metadata"
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
        // This frame sits inside a scroll-reveal wrapper (scale/slide-in
        // motion), and Motion leaves that transform set as a persistent
        // inline style even at rest — which on iOS Safari can make a
        // <video> nested inside it fail to render (stays black/frozen)
        // since the browser composites it as part of the parent's
        // transformed layer. Promoting the video to its own GPU layer
        // works around it.
        className="h-full w-full transform-gpu object-cover"
      />

      {!isPlaying ? (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,10,9,0.05)_0%,rgba(18,10,9,0.55)_100%)]"
          />

          <button
            type="button"
            onClick={toggle}
            aria-pressed={isPlaying}
            aria-label={playLabel}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="glass-surface flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-text-primary transition-transform duration-300 hover:scale-105 sm:h-20 sm:w-20">
              <Play size={24} fill="currentColor" className="ml-1 rtl:ml-0 rtl:mr-1" aria-hidden="true" />
            </span>
          </button>

          {durationLabel ? (
            <span className="absolute bottom-5 end-5 rounded-full border border-glass-border bg-glass-bg-strong px-3 py-1 font-body text-xs font-medium text-text-primary backdrop-blur-md">
              {durationLabel}
            </span>
          ) : null}
        </>
      ) : null}

      {isPlaying && isBuffering ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="glass-surface flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-text-primary">
            <Loader2 size={22} className="animate-spin" aria-hidden="true" />
          </span>
        </div>
      ) : null}
    </div>
  );
}
