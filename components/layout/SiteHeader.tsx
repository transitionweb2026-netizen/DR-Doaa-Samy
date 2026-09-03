"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Sparkle } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants/site";
import { NavLink } from "@/components/navigation/NavLink";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { LanguageToggle } from "@/components/navigation/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";
import { CONTACT, whatsappUrl } from "@/lib/constants/site";
import { useLocale, localizedHref } from "@/lib/i18n/LocaleContext";
import { getUiStrings } from "@/lib/i18n/ui";
import type { NavItemContent, SiteSettingsContent } from "@/lib/cms/siteSettings";

export function SiteHeader({
  navItems = NAV_ITEMS,
  siteName,
  roleTitle,
  phoneDisplay = CONTACT.phoneDisplay,
  phoneHref = CONTACT.phoneHref,
  whatsappHref = whatsappUrl(),
}: {
  navItems?: NavItemContent[];
  siteName?: SiteSettingsContent["siteName"];
  roleTitle?: SiteSettingsContent["roleTitle"];
  phoneDisplay?: string;
  phoneHref?: string;
  whatsappHref?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const locale = useLocale();
  const t = getUiStrings(locale);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] transition-all duration-500",
        scrolled ? "py-3" : "py-6",
      )}
    >
      <Container>
        <div
          className={cn(
            "flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500 sm:px-6",
            scrolled ? "glass-surface" : "border border-glass-border bg-black/10 backdrop-blur-sm",
          )}
        >
          <Link href={localizedHref(locale, "/")} className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-glass-border text-peach-300">
              <Sparkle size={15} aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-lg font-medium tracking-tight text-text-primary sm:text-xl">
                {siteName ?? "Dr. Doaa Samy"}
              </span>
              <span className="font-body text-[11px] text-text-muted">{roleTitle ?? "Dermatologist"}</span>
            </span>
          </Link>

          <nav aria-label={t.primary} className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <LanguageToggle />
            <Button href={localizedHref(locale, "/contact")} variant="glass" size="md" showIcon={false}>
              {t.bookAppointment}
            </Button>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <LanguageToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t.openMenu}
              aria-haspopup="dialog"
              className="glass-surface inline-flex h-11 w-11 items-center justify-center rounded-full text-text-primary"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={navItems}
        phoneDisplay={phoneDisplay}
        phoneHref={phoneHref}
        whatsappHref={whatsappHref}
      />
    </header>
  );
}
