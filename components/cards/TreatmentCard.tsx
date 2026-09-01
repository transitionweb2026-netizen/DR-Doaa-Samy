import { Plus } from "lucide-react";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import type { Treatment } from "@/lib/types/content";

export function TreatmentCard({ treatment, onOpen }: { treatment: Treatment; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-[24px] border border-glass-border text-left transition-transform duration-500 ease-out hover:-translate-y-1.5 focus-visible:-translate-y-1.5"
      aria-haspopup="dialog"
    >
      <MediaFrame
        image={treatment.image}
        tone="rose"
        label={treatment.name}
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 24vw"
        className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,10,9,0)_38%,rgba(18,10,9,0.84)_100%)]"
      />

      <div className="relative mt-auto flex flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="text-balance font-display text-lg font-medium leading-tight text-text-primary">
            {treatment.name}
          </span>
          <span className="glass-surface inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-primary transition-transform duration-500 group-hover:rotate-90">
            <Plus size={14} aria-hidden="true" />
          </span>
        </div>
        <p className="line-clamp-2 font-body text-xs leading-relaxed text-text-secondary">
          {treatment.shortDescription}
        </p>
      </div>
    </button>
  );
}
