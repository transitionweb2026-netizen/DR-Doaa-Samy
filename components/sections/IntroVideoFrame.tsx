"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { cn } from "@/lib/utils/cn";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { ImageAsset } from "@/lib/types/content";

/**
 * Editorial video frame. When `videoUrl` is set (uploaded via the CMS video
 * field), the play button starts real playback in place, with the poster as
 * the <video>'s poster frame and native controls once it's running. With no
 * videoUrl it falls back to the original decorative poster + button.
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const locale = useLocale();
  const label = locale === "ar" ? "فيديو تعريفي" : "Introduction Video";
  const playLabel = locale === "ar" ? "تشغيل الفيديو التعريفي" : "Play introduction video";
  const pauseLabel = locale === "ar" ? "إيقاف الفيديو التعريفي مؤقتاً" : "Pause introduction video";

  function toggle() {
    if (videoUrl && videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
    }
    setIsPlaying((p) => !p);
  }

  return (
    <div className={cn("glass-surface relative w-full overflow-hidden rounded-[32px]", aspectClassName, className)}>
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster.src}
          controls={isPlaying}
          playsInline
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="h-full w-full object-cover"
        />
      ) : (
        <MediaFrame image={poster} tone="charcoal" label={label} className="h-full w-full" />
      )}

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
      ) : !videoUrl ? (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={isPlaying}
          aria-label={pauseLabel}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="glass-surface flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-text-primary transition-transform duration-300 hover:scale-105 sm:h-20 sm:w-20">
            <Pause size={24} fill="currentColor" aria-hidden="true" />
          </span>
        </button>
      ) : null}
    </div>
  );
}
