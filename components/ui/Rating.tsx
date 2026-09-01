import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Rating({ value, max = 5, className }: { value: number; max?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)} role="img" aria-label={`Rated ${value} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={15}
          strokeWidth={1.5}
          aria-hidden="true"
          className={i < value ? "fill-peach-400 text-peach-400" : "fill-transparent text-glass-border"}
        />
      ))}
    </div>
  );
}
