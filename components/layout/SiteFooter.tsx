import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SOCIAL_GLYPHS } from "@/components/ui/SocialIcon";
import { CONTACT, isRouteBuilt, NAV_ITEMS, SITE, SOCIAL_LINKS } from "@/lib/constants/site";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 bg-canvas-deep">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-glass-border to-transparent"
      />
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="font-display text-2xl font-medium text-text-primary">{SITE.name}</p>
          <p className="mt-1 font-body text-sm text-text-muted">{SITE.role}</p>
          <p className="mt-5 font-body text-sm leading-relaxed text-text-secondary">
            Personalized dermatology and aesthetic medicine — precise, modern, and quietly
            confident.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3">
          <p className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
            Explore
          </p>
          {NAV_ITEMS.map((item) => (
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
            Contact
          </p>
          <a href={CONTACT.phoneHref} className="font-body text-sm text-text-secondary transition-colors hover:text-peach-300">
            {CONTACT.phoneDisplay}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="font-body text-sm text-text-secondary transition-colors hover:text-peach-300">
            {CONTACT.email}
          </a>
          <p className="font-body text-sm text-text-secondary">{CONTACT.addressLine}</p>

          <div className="mt-2 flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => {
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
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="font-body text-xs text-text-muted">Dermatology & Aesthetic Medicine</p>
        </Container>
      </div>
    </footer>
  );
}
