import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SOCIAL_GLYPHS } from "@/components/ui/SocialIcon";
import { AddressBlock } from "@/components/ui/AddressBlock";
import { CONTACT, CONTACT_PHONES, isRouteBuilt, NAV_ITEMS, SITE, SOCIAL_LINKS } from "@/lib/constants/site";
import { getUiStrings } from "@/lib/i18n/ui";
import type { UiLocale } from "@/lib/i18n/LocaleContext";
import type { NavItemContent, PhoneNumber, SocialLinkContent } from "@/lib/cms/siteSettings";

const DEFAULT_FOOTER_BLURB =
  "Personalized dermatology and aesthetic medicine — precise, modern, and quietly confident.";

export function SiteFooter({
  navItems = NAV_ITEMS,
  socialLinks = SOCIAL_LINKS,
  siteName = SITE.name,
  roleTitle = SITE.role,
  tagline = SITE.tagline,
  footerBlurb = DEFAULT_FOOTER_BLURB,
  phones = CONTACT_PHONES,
  email = CONTACT.email,
  addressLine = CONTACT.addressLine,
  copyrightText,
  locale = "en",
}: {
  navItems?: readonly NavItemContent[];
  socialLinks?: readonly SocialLinkContent[];
  siteName?: string;
  roleTitle?: string;
  tagline?: string;
  footerBlurb?: string;
  phones?: PhoneNumber[];
  email?: string;
  addressLine?: string;
  copyrightText?: string;
  locale?: UiLocale;
}) {
  const t = getUiStrings(locale);
  return (
    <footer className="relative z-10 mt-24 bg-canvas-deep">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-glass-border to-transparent"
      />
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="font-display text-2xl font-medium text-text-primary">{siteName}</p>
          <p className="mt-1 font-body text-sm text-text-muted">{roleTitle}</p>
          <p className="mt-5 font-body text-sm leading-relaxed text-text-secondary">{footerBlurb}</p>
        </div>

        <nav aria-label={t.explore} className="flex flex-col gap-3">
          <p className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
            {t.explore}
          </p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={isRouteBuilt(item.href) ? undefined : false}
              className="font-body text-sm text-text-secondary transition-colors hover:text-peach-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-4">
          <p className="mb-1 font-body text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
            {t.contact}
          </p>
          {phones.map((phone) => (
            <a
              key={phone.href}
              href={phone.href}
              className="flex items-center gap-2 font-body text-sm text-text-secondary transition-colors hover:text-peach-300"
            >
              <Phone size={13} aria-hidden="true" className="shrink-0" />
              <span dir="ltr">{phone.display}</span>
            </a>
          ))}
          <a href={`mailto:${email}`} className="font-body text-sm text-text-secondary transition-colors hover:text-peach-300">
            {email}
          </a>
          <div className="flex items-start gap-2">
            <MapPin size={13} aria-hidden="true" className="mt-0.5 shrink-0" />
            <AddressBlock value={addressLine} className="font-body text-sm leading-relaxed text-text-secondary" />
          </div>

          <div className="mt-2 flex items-center gap-3">
            {socialLinks.map((social) => {
              const Glyph = SOCIAL_GLYPHS[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-glass-border bg-glass-bg text-text-secondary transition-colors hover:border-peach-300/50 hover:text-peach-300"
                >
                  {Glyph ? <Glyph size={16} /> : null}
                </a>
              );
            })}
          </div>
        </div>
      </Container>

      <div className="border-t border-glass-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 sm:flex-row">
          <p className="font-body text-xs text-text-muted">
            {copyrightText ?? `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
          </p>
          <p className="font-body text-xs text-text-muted">{tagline}</p>
        </Container>
      </div>
    </footer>
  );
}
