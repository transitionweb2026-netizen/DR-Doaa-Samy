import type { CaseItem } from "@/lib/types/content";

// A 3-case preview for the About page. Neutral, non-specific placeholder
// content — replace with real, consented patient stories and imagery.
// Do not fabricate outcomes or figures.
export const aboutFeaturedCases: CaseItem[] = [
  {
    id: "about-case-1",
    title: "Jawline & Contour Balance",
    concern: "Softened jawline definition and facial balance.",
    treatment: "A conservative, structure-led filler approach.",
    result: "Placeholder result summary — to be replaced with the patient's own account.",
    story:
      "This case study is a placeholder. Real before/after imagery and patient narrative will replace this content once available and consented for publication.",
    before: { alt: "Before treatment — placeholder" },
    after: { alt: "After treatment — placeholder" },
  },
  {
    id: "about-case-2",
    title: "Post-Acne Scarring",
    concern: "Textural scarring left by past breakouts.",
    treatment: "A combined micro-needling and skin-renewal program.",
    result: "Placeholder result summary — to be replaced with the patient's own account.",
    story:
      "This case study is a placeholder. Real before/after imagery and patient narrative will replace this content once available and consented for publication.",
    before: { alt: "Before treatment — placeholder" },
    after: { alt: "After treatment — placeholder" },
  },
  {
    id: "about-case-3",
    title: "Even Skin Radiance",
    concern: "Uneven tone and a dull overall complexion.",
    treatment: "A phased brightening and skin-quality protocol.",
    result: "Placeholder result summary — to be replaced with the patient's own account.",
    story:
      "This case study is a placeholder. Real before/after imagery and patient narrative will replace this content once available and consented for publication.",
    before: { alt: "Before treatment — placeholder" },
    after: { alt: "After treatment — placeholder" },
  },
];
