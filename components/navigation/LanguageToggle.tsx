"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { getUiStrings } from "@/lib/i18n/ui";
import { cn } from "@/lib/utils/cn";

/**
 * Maps the current URL to its mirror in the other language. Both trees use
 * identical path segments (/services ↔ /ar/services), so this is a pure
 * prefix swap — no slug-translation table needed.
 */
function useMirrorHref(): string {
  const pathname = usePathname() || "/";
  const locale = useLocale();

  if (locale === "ar") {
    const withoutPrefix = pathname.replace(/^\/ar(?=\/|$)/, "");
    return withoutPrefix === "" ? "/" : withoutPrefix;
  }
  return pathname === "/" ? "/ar" : `/ar${pathname}`;
}

/**
 * A small EN/AR pill with a sliding highlight — plain local-state animation
 * (not a shared `layoutId`) since the header mounts more than one instance
 * at once (desktop row + mobile menu, the latter always in the DOM via its
 * portal even while visually hidden), and a shared layoutId across
 * simultaneously-mounted instances would fight over the same animation.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const t = getUiStrings(locale);
  const href = useMirrorHref();
  const isAr = locale === "ar";

  return (
    // Forced dir="ltr": this two-letter EN/AR toggle keeps a fixed physical
    // layout (EN left, AR right) on purpose, even inside an RTL page — the
    // slide animation below is a raw translateX, and mirroring the toggle
    // itself per-page would either invert that math or need to duplicate it.
    // Users read "EN/AR" as a fixed control, not as page content that
    // should flip with direction.
    <div
      dir="ltr"
      role="group"
      aria-label={t.languageToggleLabel}
      className={cn(
        "relative inline-flex items-center rounded-full border border-glass-border bg-glass-bg p-1 font-body text-xs font-semibold",
        className,
      )}
    >
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ x: isAr ? "100%" : "0%" }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="absolute inset-y-1 left-1 w-9 rounded-full bg-[linear-gradient(135deg,var(--color-peach-400),var(--color-rose-500))]"
      />
      <Link
        href={isAr ? href : "#"}
        aria-current={!isAr ? "true" : undefined}
        tabIndex={isAr ? 0 : -1}
        aria-disabled={!isAr}
        onClick={(e) => {
          if (!isAr) e.preventDefault();
        }}
        className={cn(
          "relative z-10 flex h-7 w-9 items-center justify-center rounded-full transition-colors duration-300",
          !isAr ? "text-text-inverse" : "text-text-secondary hover:text-text-primary",
        )}
      >
        EN
      </Link>
      <Link
        href={isAr ? "#" : href}
        aria-current={isAr ? "true" : undefined}
        tabIndex={isAr ? -1 : 0}
        aria-disabled={isAr}
        onClick={(e) => {
          if (isAr) e.preventDefault();
        }}
        className={cn(
          "relative z-10 flex h-7 w-9 items-center justify-center rounded-full transition-colors duration-300",
          isAr ? "text-text-inverse" : "text-text-secondary hover:text-text-primary",
        )}
      >
        AR
      </Link>
    </div>
  );
}
