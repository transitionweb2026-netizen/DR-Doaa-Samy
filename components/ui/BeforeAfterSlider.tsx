"use client";

import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MediaFrame } from "./MediaPlaceholder";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { getUiStrings } from "@/lib/i18n/ui";
import type { ImageAsset } from "@/lib/types/content";

/**
 * Draggable / keyboard-operable before-after comparison. Drag or click
 * anywhere on the frame, or focus the handle and use the arrow keys.
 */
export function BeforeAfterSlider({
  before,
  after,
  label,
  className,
}: {
  before: ImageAsset;
  after: ImageAsset;
  label: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [value, setValue] = useState(50);
  const t = getUiStrings(useLocale());

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setValue(Math.min(100, Math.max(0, pct)));
  }, []);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    updateFromClientX(event.clientX);
  }

  function handlePointerUp() {
    draggingRef.current = false;
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setValue((v) => Math.max(0, v - 5));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setValue((v) => Math.min(100, v + 5));
    } else if (event.key === "Home") {
      event.preventDefault();
      setValue(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setValue(100);
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative touch-none select-none overflow-hidden", className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* No text label on these placeholder layers — the divider sits at an
          arbitrary %, so a centered "Before"/"After" label from each layer
          would visually collide with the other. The corner badges below
          already communicate which side is which. */}
      <MediaFrame image={before} tone="charcoal" className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <MediaFrame image={after} tone="blush" className="absolute inset-0 h-full w-full" />
      </div>

      <span className="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-glass-border bg-glass-bg-strong px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.15em] text-text-primary backdrop-blur-md">
        {t.before}
      </span>
      <span className="pointer-events-none absolute right-4 top-4 z-10 rounded-full border border-glass-border bg-glass-bg-strong px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.15em] text-text-primary backdrop-blur-md">
        {t.after}
      </span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white/80"
        style={{ left: `${value}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label={t.dragToCompare(label)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        onKeyDown={handleKeyDown}
        className="absolute top-1/2 z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-white/50 bg-white text-canvas-deep shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-peach-300"
        style={{ left: `${value}%` }}
      >
        <ChevronsLeftRight size={14} aria-hidden="true" />
      </div>
    </div>
  );
}
