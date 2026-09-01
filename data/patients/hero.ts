import type { HeroContent } from "@/lib/types/content";

// Same HeroContent shape and same shared HeroSection component as every
// other page — only the words differ, the image and composition don't.
export const patientsHeroContent: HeroContent = {
  eyebrow: "Patients & Stories",
  name: "Dr. Doaa Samy",
  role: "Dermatologist",
  headline: "Real journeys, told by the people who lived them.",
  description:
    "Every result here started as someone's own concern — and their own decision to address it. This is where those journeys, and what patients have said about them, live.",
  primaryCta: { label: "Book Appointment", href: "/contact" },
  secondaryCta: { label: "Explore Services", href: "/services" },
  portrait: {
    src: "/images/hero/doaa-hero.png",
    alt: "Portrait of Dr. Doaa Samy in her clinic",
  },
};
