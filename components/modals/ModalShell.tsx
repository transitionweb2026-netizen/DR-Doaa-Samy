"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { modalBackdrop, modalReveal } from "@/components/motion/variants";
import { cn } from "@/lib/utils/cn";
import { useMounted } from "@/lib/hooks/useMounted";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { getUiStrings } from "@/lib/i18n/ui";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

type ModalShellProps = {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  children: ReactNode;
  className?: string;
  /**
   * "dark" (default) is the Home page's tinted-dark glass. "blush" swaps in
   * the light blush/soft-pink glass variant (see `.modal-blush` in
   * globals.css) — used for the About page's treatment/case detail modals.
   */
  tone?: "dark" | "blush";
};

/**
 * Portal-rendered, accessible glass modal shell: focus trap, Escape to
 * close, backdrop click to close, body scroll lock, and focus restoration
 * to the element that opened it.
 */
export function ModalShell({ isOpen, onClose, titleId, children, className, tone = "dark" }: ModalShellProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const t = getUiStrings(useLocale());

  // Portals must not render during SSR.
  const mounted = useMounted();

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    (focusables?.[0] ?? panel)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={modalBackdrop}
            className="absolute inset-0 bg-[#0c0605]/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            variants={modalReveal}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={cn(
              "glass-surface relative z-10 max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[28px] p-6 sm:p-8 md:p-10",
              tone === "blush" && "modal-blush",
              className,
            )}
            // `.glass-surface`'s own `background` (which itself reads the
            // --color-glass-bg* tokens) sits at equal-or-higher cascade
            // precedence than a Tailwind arbitrary bg-[...] utility once
            // `.modal-blush` overrides those tokens on this same element —
            // so the tone-specific panel background is set inline, which
            // always wins regardless of class order.
            style={{
              background:
                tone === "blush"
                  ? "linear-gradient(165deg,rgba(255,240,235,0.97),rgba(250,222,213,0.95))"
                  : "linear-gradient(165deg,rgba(42,24,21,0.97),rgba(18,10,9,0.98))",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t.closeDialog}
              className="absolute end-5 top-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-glass-border bg-glass-bg text-text-primary transition-colors hover:bg-glass-bg-strong"
            >
              <X size={18} aria-hidden="true" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
