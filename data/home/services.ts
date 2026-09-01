import type { ServiceItem } from "@/lib/types/content";

// Five featured services for Home. The full catalogue will live on /services.
export const featuredServices: ServiceItem[] = [
  {
    id: "hair-restoration",
    slug: "hair-problems-treatment",
    name: "Hair Problems Treatment",
    shortLabel: "Hair",
    image: { alt: "Hair restoration treatment" },
    summary: "Targeted care for thinning, shedding, and scalp health.",
    description:
      "A diagnostic-first approach to hair loss and scalp conditions, combining clinical assessment with treatment protocols tailored to the underlying cause.",
    benefits: [
      "Personalized diagnosis of hair loss patterns",
      "Non-surgical, minimally invasive options",
      "Progress tracked over a structured plan",
    ],
    suitableFor: [
      "Early to moderate thinning",
      "Postpartum or stress-related shedding",
      "Scalp conditions affecting hair health",
    ],
    sessionInfo: "Session length and frequency vary by protocol — discussed at consultation.",
  },
  {
    id: "prp-plasma",
    slug: "prp-plasma",
    name: "PRP / Plasma",
    shortLabel: "PRP",
    image: { alt: "PRP plasma therapy" },
    summary: "Platelet-rich plasma to support natural renewal.",
    description:
      "A regenerative treatment that concentrates the body's own growth factors to support skin quality and hair density with minimal downtime.",
    benefits: [
      "Uses your own plasma — no synthetic fillers",
      "Supports collagen and tissue renewal",
      "Minimal downtime",
    ],
    suitableFor: [
      "Early signs of skin fatigue or dullness",
      "Hair density support",
      "Patients seeking a natural regenerative option",
    ],
    sessionInfo: "Typically delivered as a short course of sessions, spaced per plan.",
  },
  {
    id: "skin-brightening",
    slug: "skin-brightening-tone-unification",
    name: "Skin Brightening & Tone Unification",
    shortLabel: "Brightening",
    image: { alt: "Skin brightening treatment" },
    summary: "Even, luminous tone through gentle, guided care.",
    description:
      "A tailored protocol addressing uneven pigmentation and dullness, designed to restore a balanced, radiant complexion over time.",
    benefits: [
      "Addresses uneven pigmentation gently",
      "Improves overall skin radiance",
      "Customized to your skin type",
    ],
    suitableFor: [
      "Uneven tone or dullness",
      "Post-inflammatory discoloration",
      "Patients wanting a brighter, even complexion",
    ],
    sessionInfo: "A multi-step plan combining in-clinic sessions with at-home care.",
  },
  {
    id: "skin-rejuvenation",
    slug: "skin-rejuvenation",
    name: "Skin Rejuvenation",
    shortLabel: "Rejuvenation",
    image: { alt: "Skin rejuvenation treatment" },
    summary: "Restore texture, elasticity, and a healthy glow.",
    description:
      "Advanced rejuvenation techniques that work with your skin's natural renewal cycle to visibly refresh texture and tone.",
    benefits: [
      "Improves texture and skin quality",
      "Supports long-term skin health",
      "Combines well with other treatments",
    ],
    suitableFor: [
      "Early signs of aging",
      "Uneven texture",
      "Patients seeking a refreshed, healthy look",
    ],
    sessionInfo: "Recommended as a course, with maintenance sessions thereafter.",
  },
  {
    id: "botox",
    slug: "botox",
    name: "Botox",
    shortLabel: "Botox",
    image: { alt: "Botox treatment" },
    summary: "Soft, natural-looking expression refinement.",
    description:
      "Precise, conservative treatment to soften expression lines while preserving natural movement and facial expressiveness.",
    benefits: [
      "Quick in-clinic procedure",
      "Natural-looking, movement-preserving results",
      "Minimal downtime",
    ],
    suitableFor: [
      "Expression lines and fine wrinkles",
      "Preventative treatment",
      "Patients wanting a subtle refresh",
    ],
    sessionInfo: "Results typically assessed at a follow-up visit within a few weeks.",
  },
];
