"use client";

import { useState, useTransition } from "react";

export function ToggleSwitch({
  initialChecked,
  onToggle,
  label,
}: {
  initialChecked: boolean;
  onToggle: (checked: boolean) => Promise<{ ok: boolean; error?: string }>;
  label?: string;
}) {
  const [checked, setChecked] = useState(initialChecked);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !checked;
    setChecked(next); // optimistic
    startTransition(async () => {
      const result = await onToggle(next);
      if (!result.ok) setChecked(!next); // revert on failure
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={toggle}
      disabled={isPending}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-[#d88880]" : "bg-[#ddd0ca]"
      } ${isPending ? "opacity-70" : ""}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
