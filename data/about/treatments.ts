import type { ServiceItem } from "@/lib/types/content";

// A curated set of Dr. Doaa's key treatment areas for the About page — a
// concise overview, not the full catalogue (that lives on /services).
// Deliberately distinct from the Home page's featured five.
export const keyTreatmentAreas: ServiceItem[] = [
  {
    id: "mesotherapy",
    slug: "mesotherapy",
    name: "Mesotherapy",
    shortLabel: "Mesotherapy",
    image: { alt: "Mesotherapy treatment" },
    summary: "Micro-nutrient infusions for tired, dehydrated skin.",
    description:
      "Fine, targeted micro-injections deliver vitamins and actives directly where skin needs them, supporting hydration and overall skin quality.",
    benefits: ["Improves hydration and skin vitality", "Customized active blend", "Minimal downtime"],
    suitableFor: ["Dull or dehydrated skin", "Early signs of fatigue", "A refresh before an event"],
    sessionInfo: "Usually delivered as a short course, spaced a few weeks apart.",
  },
  {
    id: "fillers",
    slug: "fillers",
    name: "Fillers",
    shortLabel: "Fillers",
    image: { alt: "Facial filler treatment" },
    summary: "Conservative volume restoration with a natural result.",
    description:
      "Precise, restrained filler placement to soften volume loss and restore balance — without changing how you look, only how you feel about it.",
    benefits: ["Natural-looking volume restoration", "Precise, conservative technique", "Result assessed together with you"],
    suitableFor: ["Volume loss in cheeks or lips", "Softening deep folds", "Balancing facial proportions"],
    sessionInfo: "A single in-clinic session; a follow-up review is typically scheduled after.",
  },
  {
    id: "peeling",
    slug: "peeling",
    name: "Peeling",
    shortLabel: "Peeling",
    image: { alt: "Chemical peel treatment" },
    summary: "Guided exfoliation for clearer, more even skin.",
    description:
      "A calibrated chemical peel protocol matched to your skin type, addressing texture, congestion, and tone without overworking the skin barrier.",
    benefits: ["Improves texture and clarity", "Calibrated to your skin type", "Supports an even tone over time"],
    suitableFor: ["Congested or acne-prone skin", "Rough texture", "Dull, uneven complexion"],
    sessionInfo: "Typically a series of sessions with recovery time built into the plan.",
  },
  {
    id: "dark-circles",
    slug: "dark-circles-treatment",
    name: "Dark Circles Treatment",
    shortLabel: "Dark Circles",
    image: { alt: "Under-eye dark circle treatment" },
    summary: "A tailored plan for the delicate under-eye area.",
    description:
      "Dark circles have several possible causes — pigment, volume, or vascularity. Treatment starts with identifying which is at play for you.",
    benefits: ["Diagnosis-led treatment selection", "Gentle protocols for delicate skin", "Realistic, gradual improvement"],
    suitableFor: ["Persistent under-eye darkness", "A tired-looking appearance", "Shadowing from volume loss"],
    sessionInfo: "Plan and pacing depend on the underlying cause, set at consultation.",
  },
  {
    id: "lip-treatment",
    slug: "lip-brightening-treatment",
    name: "Lip Brightening & Treatment",
    shortLabel: "Lips",
    image: { alt: "Lip brightening treatment" },
    summary: "Refinement and tone correction for the lips.",
    description:
      "A gentle approach to lip pigmentation and definition, restoring a naturally healthy color and shape without an overdone result.",
    benefits: ["Addresses pigmentation gently", "Subtle definition, never overdone", "Comfortable, quick sessions"],
    suitableFor: ["Uneven lip pigmentation", "Reduced lip definition", "Patients wanting a natural refresh"],
    sessionInfo: "A short course of sessions, spaced per the treatment plan.",
  },
  {
    id: "dermapen",
    slug: "dermapen",
    name: "Dermapen",
    shortLabel: "Dermapen",
    image: { alt: "Dermapen microneedling treatment" },
    summary: "Micro-needling to support the skin's own renewal.",
    description:
      "Controlled micro-needling stimulates the skin's natural repair process, improving texture, tone, and the appearance of fine lines and scarring.",
    benefits: ["Improves texture and fine scarring", "Stimulates natural collagen renewal", "Works on face and body"],
    suitableFor: ["Acne scarring", "Enlarged pores", "Early fine lines"],
    sessionInfo: "Delivered as a course, with spacing to allow full recovery between sessions.",
  },
  {
    id: "fractional-laser",
    slug: "fractional-laser",
    name: "Fractional Laser",
    shortLabel: "Fractional Laser",
    image: { alt: "Fractional laser treatment" },
    summary: "Advanced resurfacing for texture and tone.",
    description:
      "A precise, fractionated laser approach that resurfaces the skin in a controlled way — improving texture and tone with a planned, manageable recovery.",
    benefits: ["Meaningful texture improvement", "Precisely controlled treatment depth", "Plan includes recovery guidance"],
    suitableFor: ["Textural irregularities", "Scarring", "Sun-related tone changes"],
    sessionInfo: "Session count and downtime depend on treatment depth, set at consultation.",
  },
  {
    id: "gum-smile",
    slug: "gum-smile-treatment",
    name: "Gum Smile Treatment",
    shortLabel: "Gum Smile",
    image: { alt: "Gummy smile treatment" },
    summary: "A refined, balanced smile line.",
    description:
      "A conservative treatment approach to soften an excessive gum display when smiling, aiming for a natural, well-proportioned result.",
    benefits: ["Conservative, reversible approach", "Focused on natural proportion", "Quick in-clinic procedure"],
    suitableFor: ["Excess gum show when smiling", "Patients wanting a balanced smile line"],
    sessionInfo: "Results are typically reviewed at a follow-up visit.",
  },
];
