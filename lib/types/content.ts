/**
 * Shared content models for the Home page.
 *
 * These types describe the shape of content regardless of where it comes
 * from. Today it's populated by local data modules in `data/home`; later
 * the same shapes can be filled from Supabase without touching components.
 */

export type ImageAsset = {
  /** Path/URL to the real image. Leave undefined to render a brand placeholder. */
  src?: string;
  alt: string;
};

export type HeroContent = {
  eyebrow: string;
  name: string;
  role: string;
  headline: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  portrait: ImageAsset;
};

export type StatItem = {
  id: string;
  value: number;
  suffix?: string;
  label: string;
  /** Marks the lead figure for asymmetric stat compositions. */
  emphasis?: "hero";
};

export type DoctorIntroContent = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  highlights: string[];
  video: ImageAsset & { durationLabel?: string };
};

export type ServiceItem = {
  id: string;
  slug: string;
  name: string;
  shortLabel: string;
  image: ImageAsset;
  summary: string;
  description: string;
  benefits: string[];
  suitableFor: string[];
  sessionInfo: string;
};

export type CaseItem = {
  id: string;
  title: string;
  concern: string;
  treatment: string;
  result: string;
  story: string;
  before: ImageAsset;
  after: ImageAsset;
};

export type WhyPoint = {
  id: string;
  title: string;
  description: string;
};

export type JourneyStep = {
  id: string;
  index: string;
  title: string;
  description: string;
};

export type ReviewItem = {
  id: string;
  name: string;
  initials: string;
  rating: number;
  quote: string;
  treatment?: string;
};

export type VideoItem = {
  id: string;
  title: string;
  category: string;
  thumbnail: ImageAsset;
  durationLabel?: string;
  /** Shown in the video modal. Leave undefined for a shorter modal. */
  description?: string;
  /** Real embeddable video URL. Leave undefined to render a "coming soon" placeholder in the modal. */
  videoUrl?: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FinalCtaContent = {
  eyebrow: string;
  heading: string;
  description: string;
  whatsappLabel: string;
  contactLabel: string;
};

/* ---- About page ---- */
// The About hero reuses `HeroContent` as-is — same shape, same component
// (see components/hero/HeroSection.tsx), so the two pages' heroes stay in
// sync by construction rather than by convention.

export type AboutMessageContent = {
  eyebrow: string;
  quote: string;
  paragraphs: string[];
  signatureName: string;
  signatureTitle: string;
};

export type CredentialCategory = "Education" | "Certification" | "Experience";

export type CredentialItem = {
  id: string;
  category: CredentialCategory;
  period: string;
  title: string;
  institution: string;
  description: string;
};

/* ---- Services page ---- */

export type Treatment = {
  id: string;
  slug: string;
  name: string;
  /** Kept short — the full picture lives in the modal. */
  shortDescription: string;
  image: ImageAsset;
  whatIsIt: string;
  commonConcerns: string[];
  approach: string;
  treatmentOptions: string[];
  journey: string;
  notes: string;
  bookingLabel: string;
};

export type TreatmentCategory = {
  /** Also the URL hash anchor (e.g. "hair" → #hair). */
  id: string;
  title: string;
  /** 1–2 word/phrase label for the category selector card. */
  cardLabel: string;
  /** One line — used as the selector card's supporting text and the section's intro. */
  description: string;
  image: ImageAsset;
  treatments: Treatment[];
};

/* ---- Articles page ---- */

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Body copy as paragraphs — kept as plain structured text rather than a
   *  markup format, so a CMS rich-text field can map onto it directly. */
  content: string[];
  image: ImageAsset;
  category: string;
  /** ISO date string (e.g. "2026-06-12"). */
  date: string;
  readingTime: string;
  author: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  featured: boolean;
};

/* ---- Contact page ---- */

export type ContactFormPayload = {
  name: string;
  phone: string;
  email: string;
  service?: string;
  message: string;
};
