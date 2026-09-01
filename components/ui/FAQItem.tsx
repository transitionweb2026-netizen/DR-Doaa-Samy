"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { EASE_PREMIUM } from "@/components/motion/variants";
import type { FaqItem } from "@/lib/types/content";

export function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${item.id}`;
  const buttonId = `faq-trigger-${item.id}`;

  return (
    <div
      className={cn(
        "glass-surface overflow-hidden rounded-[22px] transition-colors duration-300",
        isOpen && "border-peach-300/40",
      )}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-8"
        >
          <span className="flex items-baseline gap-4">
            <span className="font-display text-sm font-medium text-peach-300">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-body text-base font-medium text-text-primary sm:text-lg">
              {item.question}
            </span>
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.35, ease: EASE_PREMIUM }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-glass-border text-text-primary"
          >
            <Plus size={15} aria-hidden="true" />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_PREMIUM }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 pl-[3.75rem] font-body text-sm leading-relaxed text-text-secondary sm:px-8 sm:pl-[4.5rem]">
              {item.answer}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
