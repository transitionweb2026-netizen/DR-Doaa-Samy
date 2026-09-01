import { Quote } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Rating } from "@/components/ui/Rating";
import { cn } from "@/lib/utils/cn";
import type { ReviewItem } from "@/lib/types/content";

export function ReviewCard({ review, offset = false }: { review: ReviewItem; offset?: boolean }) {
  return (
    <GlassCard
      variant="soft"
      className={cn(
        "flex h-full flex-col gap-5 p-6 transition-transform duration-500 hover:-translate-y-1.5 hover:border-peach-300/40 sm:p-7",
        offset && "lg:mt-8",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <Rating value={review.rating} />
        <Quote size={22} className="shrink-0 text-peach-400/40" aria-hidden="true" />
      </div>

      <p className="flex-1 text-balance font-body text-[0.95rem] leading-relaxed text-text-secondary">
        &ldquo;{review.quote}&rdquo;
      </p>

      <div className="flex items-center gap-3 border-t border-glass-border pt-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-peach-300),var(--color-rose-500))] font-body text-xs font-semibold text-text-inverse">
          {review.initials}
        </span>
        <div>
          <p className="font-body text-sm font-semibold text-text-primary">{review.name}</p>
          {review.treatment ? (
            <p className="font-body text-xs text-text-muted">{review.treatment}</p>
          ) : null}
        </div>
      </div>
    </GlassCard>
  );
}
