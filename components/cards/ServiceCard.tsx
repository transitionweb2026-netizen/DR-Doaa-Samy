import { Plus } from "lucide-react";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { cn } from "@/lib/utils/cn";
import type { ServiceItem } from "@/lib/types/content";

export function ServiceCard({
  service,
  onOpen,
  featured = false,
}: {
  service: ServiceItem;
  onOpen: () => void;
  /** Larger, more editorial treatment for the lead card in a bento grid. */
  featured?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group relative flex h-full min-h-[240px] w-full flex-col overflow-hidden rounded-[26px] border border-glass-border text-left transition-transform duration-500 ease-out hover:-translate-y-1.5 focus-visible:-translate-y-1.5",
        featured && "min-h-[320px]",
      )}
      aria-haspopup="dialog"
    >
      <MediaFrame
        image={service.image}
        tone="peach"
        label={service.shortLabel}
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
        className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,10,9,0)_35%,rgba(18,10,9,0.82)_100%)]"
      />

      <div className={cn("relative mt-auto flex items-end justify-between gap-3 p-5", featured && "p-6 sm:p-7")}>
        <span
          className={cn(
            "text-balance font-display font-medium leading-tight text-text-primary",
            featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl",
          )}
        >
          {service.name}
        </span>
        <span
          className={cn(
            "glass-surface inline-flex shrink-0 items-center justify-center rounded-full text-text-primary transition-transform duration-500 group-hover:rotate-90",
            featured ? "h-11 w-11" : "h-9 w-9",
          )}
        >
          <Plus size={featured ? 18 : 16} aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}
