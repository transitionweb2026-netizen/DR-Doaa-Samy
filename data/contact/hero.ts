import type { HeroContent } from "@/lib/types/content";

export const contactHeroContent: HeroContent = {
  eyebrow: "Contact",
  name: "Dr. Doaa Samy",
  role: "Dermatologist",
  headline: "Let's find a time to talk.",
  description:
    "Whether you have a specific concern or just want to know where to start, reach out — booking a consultation is the easiest next step.",
  // On the Contact page itself, "Book Appointment" jumps to the form below
  // rather than linking back to this same page.
  primaryCta: { label: "Book Appointment", href: "#contact-heading" },
  secondaryCta: { label: "Explore Services", href: "/services" },
  portrait: {
    src: "/images/hero/doaa-hero.png",
    alt: "Portrait of Dr. Doaa Samy in her clinic",
  },
};
