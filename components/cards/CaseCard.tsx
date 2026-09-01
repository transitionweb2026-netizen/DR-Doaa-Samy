import { Expand } from "lucide-react";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import type { CaseItem } from "@/lib/types/content";

export function CaseCard({ item, onOpen }: { item: CaseItem; onOpen: () => void }) {
  return (
    <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-[26px] border border-glass-border">
      <BeforeAfterSlider before={item.before} after={item.after} label={item.title} className="h-full w-full" />

      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`View full case details for ${item.title}`}
        className="glass-surface absolute bottom-4 right-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full text-text-primary transition-transform duration-300 hover:scale-105"
      >
        <Expand size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
