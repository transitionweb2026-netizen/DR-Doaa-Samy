import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  id: string;
  options: { value: string; label: string }[];
};

export function Select({ label, id, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={cn(
            "glass-surface w-full appearance-none rounded-2xl px-4 py-3.5 pe-11 font-body text-sm text-text-primary outline-none",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value || option.label} value={option.value} className="bg-canvas-raised text-text-primary">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
