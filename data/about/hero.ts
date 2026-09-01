import type { HeroContent } from "@/lib/types/content";

// Reuses the exact same HeroContent shape as Home (components/hero/HeroSection.tsx
// is one shared component) so both hero moments look like each other by
// construction — only the words and image differ.
export const aboutHeroContent: HeroContent = {
  eyebrow: "About Dr. Doaa",
  name: "Dr. Doaa Samy",
  role: "Dermatologist",
  headline: "Care that starts with listening, not a checklist.",
  description:
    "A dermatology practice built on a simple idea: your skin has its own story, and any good plan starts by understanding it — not by reaching for the nearest trend.",
  primaryCta: { label: "Book Appointment", href: "/contact" },
  secondaryCta: { label: "Explore Services", href: "/services" },
  portrait: {
    src: "/images/hero/doaa-hero.png",
    alt: "Portrait of Dr. Doaa Samy in her clinic",
  },
};
