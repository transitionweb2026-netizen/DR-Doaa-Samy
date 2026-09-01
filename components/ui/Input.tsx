import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  error?: string;
};

/**
 * Translucent warm-glass form input. Focus styling comes from the site's
 * global `:focus-visible` outline (globals.css) — deliberately not a
 * `focus:border-*` utility here, since it would compete with `.glass-surface`'s
 * own unlayered `border` declaration for the same property and lose.
 */
export function Input({ label, id, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "glass-surface rounded-2xl px-4 py-3.5 font-body text-sm text-text-primary outline-none placeholder:text-text-muted/70",
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
