import type { HeroContent } from "@/lib/types/content";

export const articlesHeroContent: HeroContent = {
  eyebrow: "Articles",
  name: "Dr. Doaa Samy",
  role: "Dermatologist",
  headline: "Dermatology knowledge, worth reading before your visit.",
  description:
    "Practical, plain-language articles on skincare, dermatology, and aesthetic medicine — written to inform, not to sell.",
  primaryCta: { label: "Book Appointment", href: "/contact" },
  secondaryCta: { label: "Explore Services", href: "/services" },
  portrait: {
    src: "/images/hero/doaa-hero.png",
    alt: "Portrait of Dr. Doaa Samy in her clinic",
  },
};
