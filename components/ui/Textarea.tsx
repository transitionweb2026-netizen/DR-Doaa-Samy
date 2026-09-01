import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  id: string;
  error?: string;
};

export function Textarea({ label, id, error, className, rows = 5, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={cn(
          "glass-surface resize-none rounded-2xl px-4 py-3.5 font-body text-sm leading-relaxed text-text-primary outline-none placeholder:text-text-muted/70",
          className,
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="font-body text-xs text-rose-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
