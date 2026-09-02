"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Phone } from "lucide-react";
import { WhatsappGlyph } from "@/components/ui/SocialIcon";
import { CONTACT, whatsappUrl } from "@/lib/constants/site";
import { EASE_PREMIUM } from "@/components/motion/variants";

// Synced against the real, external scroll position via useSyncExternalStore
// — the React-recommended pattern for this exact case (a boolean derived
// from a browser API that changes outside React), rather than a raw
// useEffect + setState, which the newer react-hooks lint rule flags as an
// avoidable cascading render.
function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("scroll", callback);
    window.removeEventListener("resize", callback);
  };
}

function getIsPastHero() {
  return window.scrollY > window.innerHeight * 0.8;
}

function getIsPastHeroServerSnapshot() {
  return false;
}

/**
 * Persistent bottom-left quick-contact cluster (site-wide, mounted once in
 * the root layout). Flat gradient/solid fills, no glass treatment — matches
 * the same phone/WhatsApp icon-circle styling already established in
 * HeroContactPanel and ContactSection, just lifted off the page with a
 * stronger shadow since these float independently rather than sitting
 * inside a card.
 *
 * Only shown once scrolled past the hero: every page's Hero already carries
 * its own prominent phone + WhatsApp panel, and on mobile that panel flows
 * in-document into this same bottom-left corner before the user scrolls —
 * showing this fixed cluster from the very top would sit directly on top
 * of it. Past the hero, this is the one persistent way to reach either
 * action, so it slides in from the corner right on cue.
 */
export function FloatingContactButtons({
  phoneDisplay = CONTACT.phoneDisplay,
  phoneHref = CONTACT.phoneHref,
  whatsappHref = whatsappUrl("Hi, I'd like to ask about booking a consultation with Dr. Doaa Samy."),
}: {
  phoneDisplay?: string;
  phoneHref?: string;
  whatsappHref?: string;
}) {
  const visible = useSyncExternalStore(subscribeToScroll, getIsPastHero, getIsPastHeroServerSnapshot);

  return (
    <AnimatePresence>
      {visible ? (
        <div className="fixed bottom-6 left-5 z-[90] flex flex-col items-center gap-3 sm:bottom-8 sm:left-6">
          <motion.a
            href={phoneHref}
            aria-label={`Call the clinic at ${phoneDisplay}`}
            initial={{ opacity: 0, x: -32, y: 24, scale: 0.75 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -24, y: 16, scale: 0.8, transition: { duration: 0.25 } }}
            transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.15 }}
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.94 }}
            className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-peach-400),var(--color-rose-500))] text-text-inverse shadow-[0_10px_30px_-8px_rgba(216,136,128,0.6)] transition-shadow duration-300 hover:shadow-[0_14px_38px_-8px_rgba(216,136,128,0.75)] sm:h-14 sm:w-14"
          >
            <span
              aria-hidden="true"
              className="animate-pulse-glow absolute -inset-2.5 -z-10 rounded-full bg-[radial-gradient(circle,rgba(216,136,128,0.5),transparent_70%)] blur-md"
            />
            <Phone size={20} aria-hidden="true" className="sm:h-[22px] sm:w-[22px]" />
          </motion.a>

          <motion.a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            initial={{ opacity: 0, x: -32, y: 24, scale: 0.75 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -24, y: 16, scale: 0.8, transition: { duration: 0.25 } }}
            transition={{ duration: 0.6, ease: EASE_PREMIUM }}
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.94 }}
            className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.55)] transition-shadow duration-300 hover:shadow-[0_14px_38px_-8px_rgba(37,211,102,0.7)] sm:h-14 sm:w-14"
          >
            <span
              aria-hidden="true"
              className="animate-pulse-glow absolute -inset-2.5 -z-10 rounded-full bg-[radial-gradient(circle,rgba(216,136,128,0.5),transparent_70%)] blur-md"
              style={{ animationDelay: "1.5s" }}
            />
            <WhatsappGlyph size={22} />
          </motion.a>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
