"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { NavLink } from "./NavLink";
import { NAV_ITEMS, CONTACT, whatsappUrl } from "@/lib/constants/site";
import { Button } from "@/components/ui/Button";
import { staggerContainerFast, fadeUp } from "@/components/motion/variants";
import { useMounted } from "@/lib/hooks/useMounted";
import type { NavItemContent } from "@/lib/cms/siteSettings";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function MobileMenu({
  isOpen,
  onClose,
  navItems = NAV_ITEMS,
  phoneDisplay = CONTACT.phoneDisplay,
  phoneHref = CONTACT.phoneHref,
  whatsappHref = whatsappUrl(),
}: {
  isOpen: boolean;
  onClose: () => void;
  navItems?: NavItemContent[];
  phoneDisplay?: string;
  phoneHref?: string;
  whatsappHref?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
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
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[300] md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-[#0c0605]/85 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="glass-surface absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col gap-8 rounded-l-[28px] bg-[linear-gradient(165deg,rgba(42,24,21,0.98),rgba(18,10,9,0.99))] p-8 pt-24"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-glass-border bg-glass-bg text-text-primary"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <motion.nav
              initial="hidden"
              animate="visible"
              variants={staggerContainerFast}
              className="flex flex-col gap-6"
            >
              {navItems.map((item) => (
                <motion.div key={item.href} variants={fadeUp}>
                  <NavLink item={item} onClick={onClose} className="text-lg" />
                </motion.div>
              ))}
            </motion.nav>

            <div className="mt-auto flex flex-col gap-4 border-t border-glass-border pt-6">
              <a href={phoneHref} className="font-body text-sm text-text-secondary hover:text-text-primary">
                {phoneDisplay}
              </a>
              <Button href={whatsappHref} variant="primary" size="md" className="w-full">
                WhatsApp Us
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
