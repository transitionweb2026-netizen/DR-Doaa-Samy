import { Phone } from "lucide-react";
import { CONTACT, SOCIAL_LINKS, whatsappUrl } from "@/lib/constants/site";
import { SOCIAL_GLYPHS, WhatsappGlyph } from "@/components/ui/SocialIcon";

export function HeroContactPanel() {
  return (
    <div
      className="glass-surface flex w-full max-w-xs flex-col gap-4 rounded-[24px] p-5"
      // This panel floats directly over vivid photography rather than the
      // app's calm canvas background, so it needs a noticeably stronger
      // backing than the shared `.glass-surface` tint for text to stay
      // legible — set inline so every other glass-surface use is unaffected.
      style={{ background: "linear-gradient(180deg, rgba(23,13,11,0.78), rgba(23,13,11,0.62))" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
            Call the Clinic
          </p>
          <a
            href={CONTACT.phoneHref}
            className="mt-1 block font-body text-sm font-semibold text-text-primary transition-colors hover:text-peach-300"
          >
            {CONTACT.phoneDisplay}
          </a>
        </div>
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-peach-400),var(--color-rose-500))] text-text-inverse">
          <Phone size={16} aria-hidden="true" />
        </span>
      </div>

      <div className="h-px w-full bg-glass-border" aria-hidden="true" />

      <a
        href={whatsappUrl("Hi, I'd like to book a consultation with Dr. Doaa Samy.")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3"
      >
        <span className="font-body text-sm font-medium text-text-primary transition-colors hover:text-peach-300">
          Chat on WhatsApp
        </span>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
          <WhatsappGlyph size={16} />
        </span>
      </a>

      <div className="h-px w-full bg-glass-border" aria-hidden="true" />

      <div>
        <p className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
          Follow Us
        </p>
        <div className="flex items-center gap-2.5">
          {SOCIAL_LINKS.map((social) => {
            const Glyph = SOCIAL_GLYPHS[social.icon];
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-glass-border bg-glass-bg text-text-secondary transition-colors hover:border-peach-300/50 hover:text-peach-300"
              >
                {Glyph ? <Glyph size={14} /> : null}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
