import { ArrowRight } from "lucide-react";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import type { TreatmentCategory } from "@/lib/types/content";

const TONE_CYCLE = ["peach", "rose", "blush", "peach", "rose"] as const;

export function CategoryCard({ category, index }: { category: TreatmentCategory; index: number }) {
  return (
    // A plain <a>, deliberately not next/link: this is a same-page hash
    // jump, and next/link intercepts the click through its client router
    // instead of a real browser hash navigation — which means no native
    // `hashchange` event fires, breaking the target section's arrival glow
    // (see TreatmentCategorySection) even though the URL still updates.
    <a
      href={`#${category.id}`}
      className="group relative flex h-full min-h-[300px] w-full flex-col overflow-hidden rounded-[26px] border border-glass-border text-left transition-transform duration-500 ease-out hover:-translate-y-1.5 focus-visible:-translate-y-1.5"
      aria-label={`Jump to ${category.title} treatments`}
    >
      <MediaFrame
        image={category.image}
        tone={TONE_CYCLE[index % TONE_CYCLE.length]}
        label={category.title}
        sizes="(max-width: 640px) 72vw, (max-width: 1024px) 45vw, 20vw"
        className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,10,9,0)_32%,rgba(18,10,9,0.86)_100%)]"
      />

      <div className="relative mt-auto flex items-end justify-between gap-3 p-5">
        <div>
          <span className="font-display text-xl font-medium leading-tight text-text-primary sm:text-2xl">
            {category.title}
          </span>
          <p className="mt-1 font-body text-xs text-text-secondary">{category.cardLabel}</p>
        </div>
        <span className="glass-surface inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-primary transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowRight size={15} aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}
