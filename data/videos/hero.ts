import type { HeroContent } from "@/lib/types/content";

export const videosHeroContent: HeroContent = {
  eyebrow: "Videos",
  name: "Dr. Doaa Samy",
  role: "Dermatologist",
  headline: "Dermatology, explained plainly.",
  description:
    "Short, editorial videos on treatments, skin science, and what to actually expect — the same clear, unhurried explanations you'd get in a consultation.",
  primaryCta: { label: "Book Appointment", href: "/contact" },
  secondaryCta: { label: "Explore Services", href: "/services" },
  portrait: {
    src: "/images/hero/doaa-hero.png",
    alt: "Portrait of Dr. Doaa Samy in her clinic",
  },
};
