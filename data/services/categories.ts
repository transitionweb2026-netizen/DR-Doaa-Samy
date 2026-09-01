import type { TreatmentCategory } from "@/lib/types/content";

/**
 * The full Services catalogue, organized into five categories. Some of
 * Dr. Doaa's broader listed services (Hair Problems Treatment; PRP/Plasma
 * "in its different types") are presented here as the specific concerns and
 * variants they cover — not as additional invented treatments — so the
 * category selector and detailed sections stay genuinely useful for
 * navigation rather than a flat re-listing of service names.
 *
 * `id` doubles as the URL hash anchor the category selector scrolls to
 * (e.g. "hair" → #hair).
 */
export const treatmentCategories: TreatmentCategory[] = [
  {
    id: "hair",
    title: "Hair",
    cardLabel: "Loss, thinning & scalp health",
    description:
      "From hair loss to scalp health, treatments built around why your hair is changing — not just what it looks like.",
    image: { alt: "Hair treatment category" },
    treatments: [
      {
        id: "hair-loss",
        slug: "hair-loss",
        name: "Hair Loss",
        shortDescription: "Understanding why, then treating it.",
        image: { alt: "Hair loss treatment" },
        whatIsIt:
          "Hair loss can stem from genetics, hormones, stress, or scalp health — often more than one factor at once. Treatment starts with identifying which of these is driving your particular pattern.",
        commonConcerns: [
          "Increased shedding",
          "Widening part line",
          "Receding hairline",
          "Patchy or gradual thinning",
        ],
        approach:
          "A clinical assessment of your scalp, hair pattern, and relevant history guides a plan built around the underlying cause rather than a one-size-fits-all protocol.",
        treatmentOptions: [
          "Topical and/or oral therapy where appropriate",
          "PRP / plasma sessions",
          "Scalp-focused supportive care",
        ],
        journey:
          "Most plans begin with an initial assessment, followed by a structured course of sessions and periodic review to track progress over several months.",
        notes:
          "Hair regrowth takes time and individual response varies — results are assessed together at follow-up visits, not promised upfront.",
        bookingLabel: "Book an Appointment",
      },
      {
        id: "weak-thin-hair",
        slug: "weak-thin-hair",
        name: "Weak & Thin Hair",
        shortDescription: "Strengthening hair before loss becomes visible.",
        image: { alt: "Weak and thin hair treatment" },
        whatIsIt:
          "Weak, thinning hair without full loss is often an early signal worth addressing — supporting hair density and strength before the pattern progresses further.",
        commonConcerns: [
          "Reduced volume",
          "Increased breakage",
          "Fine, fragile strands",
          "Slower regrowth after shedding",
        ],
        approach:
          "Focused on strengthening the hair that's there and supporting a healthier growth cycle, tailored to how your hair has been changing.",
        treatmentOptions: [
          "PRP / plasma sessions",
          "Nutrient-focused scalp treatments",
          "Guidance on supportive at-home care",
        ],
        journey: "A short course of sessions, spaced a few weeks apart, with progress reviewed as you go.",
        notes:
          "As with all hair treatments, consistency and realistic expectations matter — this is supportive care, not a guaranteed transformation.",
        bookingLabel: "Book an Appointment",
      },
      {
        id: "scalp-care",
        slug: "scalp-care",
        name: "Scalp Care",
        shortDescription: "A healthy scalp is where healthy hair starts.",
        image: { alt: "Scalp care treatment" },
        whatIsIt:
          "Scalp conditions — irritation, excess oil, flaking, or sensitivity — can quietly undermine hair health long before hair loss becomes obvious.",
        commonConcerns: ["Itching or irritation", "Flaking or dryness", "Excess oiliness", "Scalp sensitivity"],
        approach:
          "An assessment of your scalp condition informs a calming, balancing plan suited to what's actually happening beneath the hair.",
        treatmentOptions: [
          "Targeted scalp treatments",
          "Guidance on product and routine adjustments",
          "Follow-up review of scalp response",
        ],
        journey: "Typically a short series of sessions with scalp comfort assessed along the way.",
        notes:
          "Persistent scalp conditions may benefit from a combined dermatological and hair-care approach, discussed at consultation.",
        bookingLabel: "Book an Appointment",
      },
      {
        id: "prp-hair",
        slug: "prp-for-hair",
        name: "PRP for Hair",
        shortDescription: "Your own plasma, put to work for density.",
        image: { alt: "PRP for hair treatment" },
        whatIsIt:
          "Platelet-rich plasma (PRP) uses growth factors concentrated from your own blood to support the hair follicle environment — a regenerative option with minimal downtime.",
        commonConcerns: ["General thinning", "Slowed hair growth", "Wanting a non-surgical option"],
        approach:
          "Your own plasma is drawn, prepared, and reintroduced to the scalp in a series of sessions, often alongside other hair-focused care.",
        treatmentOptions: ["Standalone PRP course", "Combined with topical or scalp therapy"],
        journey:
          "Delivered as a short course of sessions, spaced several weeks apart, with results building gradually over months.",
        notes:
          "PRP supports the hair growth environment — it works alongside, not instead of, addressing any underlying cause.",
        bookingLabel: "Book an Appointment",
      },
    ],
  },
  {
    id: "skin",
    title: "Skin",
    cardLabel: "Tone, texture & rejuvenation",
    description:
      "Brightening, rejuvenation and clarity — a plan matched to your skin's actual condition, not a generic routine.",
    image: { alt: "Skin treatment category" },
    treatments: [
      {
        id: "skin-brightening",
        slug: "skin-brightening-tone-unification",
        name: "Skin Brightening & Tone Unification",
        shortDescription: "Even, luminous tone through guided care.",
        image: { alt: "Skin brightening treatment" },
        whatIsIt:
          "A protocol addressing dullness and uneven pigmentation, aimed at restoring a more balanced, radiant complexion.",
        commonConcerns: [
          "Dull or tired-looking skin",
          "Uneven pigmentation",
          "Post-breakout discoloration",
          "Sun-related unevenness",
        ],
        approach:
          "A tailored combination of in-clinic sessions and supportive home care, matched to your skin type and tone goals.",
        treatmentOptions: ["Brightening peels", "Mesotherapy", "Targeted topical protocols"],
        journey: "A multi-step plan over several weeks, with tone and texture reviewed as the course progresses.",
        notes: "Pigmentation responds gradually — sun protection is an essential part of maintaining results.",
        bookingLabel: "Book an Appointment",
      },
      {
        id: "skin-rejuvenation",
        slug: "skin-rejuvenation",
        name: "Skin Rejuvenation",
        shortDescription: "Restoring texture, elasticity and glow.",
        image: { alt: "Skin rejuvenation treatment" },
        whatIsIt:
          "A course of treatment designed to work with your skin's natural renewal cycle, refreshing texture and tone over time.",
        commonConcerns: ["Early signs of aging", "Uneven texture", "Loss of natural glow", "Fine lines"],
        approach:
          "Advanced rejuvenation techniques are combined thoughtfully, based on your skin's condition and how it responds along the way.",
        treatmentOptions: ["Rejuvenation sessions", "Mesotherapy", "Combination with Dermapen or peeling where suitable"],
        journey: "Typically delivered as a course, followed by periodic maintenance sessions.",
        notes: "Results build gradually and vary by individual — this is an ongoing process, not a single fix.",
        bookingLabel: "Book an Appointment",
      },
      {
        id: "peeling",
        slug: "peeling",
        name: "Peeling",
        shortDescription: "Guided exfoliation for clearer, calmer skin.",
        image: { alt: "Chemical peel treatment" },
        whatIsIt:
          "A calibrated chemical peel, matched to your skin type, to address congestion, texture, and tone without overworking the skin barrier.",
        commonConcerns: ["Congested or acne-prone skin", "Rough texture", "Dullness", "Uneven tone"],
        approach:
          "Peel strength and type are selected based on your skin's sensitivity and goals, with downtime managed accordingly.",
        treatmentOptions: ["Superficial peels", "Deeper peels where appropriate", "A supporting home-care routine"],
        journey: "Usually delivered as a series of sessions, spaced to allow the skin to recover between each.",
        notes: "Some redness or flaking is expected after treatment; sun protection afterward is essential.",
        bookingLabel: "Book an Appointment",
      },
      {
        id: "mesotherapy",
        slug: "mesotherapy",
        name: "Mesotherapy",
        shortDescription: "Micro-nutrient infusions for tired skin.",
        image: { alt: "Mesotherapy treatment" },
        whatIsIt:
          "Fine, targeted micro-injections deliver hydrating and revitalizing actives directly into the skin, supporting overall skin quality.",
        commonConcerns: ["Dehydrated or dull skin", "Early fatigue signs", "Wanting a pre-event refresh"],
        approach: "An active blend is chosen to match your skin's needs, delivered in a quick in-clinic session.",
        treatmentOptions: ["Standalone mesotherapy course", "Combined with rejuvenation or brightening protocols"],
        journey: "A short course, spaced a few weeks apart, often used alongside other skin treatments.",
        notes: "Mild redness at injection points is common and typically settles quickly.",
        bookingLabel: "Book an Appointment",
      },
    ],
  },
  {
    id: "face",
    title: "Face & Features",
    cardLabel: "Fillers, Botox & smile balance",
    description: "Conservative, natural-looking refinement for facial balance and expression.",
    image: { alt: "Face and features treatment category" },
    treatments: [
      {
        id: "fillers",
        slug: "fillers",
        name: "Fillers",
        shortDescription: "Conservative volume restoration, naturally done.",
        image: { alt: "Facial filler treatment" },
        whatIsIt:
          "Precise, restrained filler placement to soften volume loss and restore facial balance — without changing how you look, only how at ease you feel in it.",
        commonConcerns: ["Volume loss in cheeks or lips", "Deep folds or hollows", "Facial asymmetry"],
        approach: "A conservative technique focused on natural proportion, planned together with you beforehand.",
        treatmentOptions: ["Cheek and mid-face filler", "Lip filler", "Fold and contour softening"],
        journey: "A single in-clinic session, typically with a follow-up review to assess the result together.",
        notes: "Filler is not permanent — results and longevity vary by individual and area treated.",
        bookingLabel: "Book an Appointment",
      },
      {
        id: "botox",
        slug: "botox",
        name: "Botox",
        shortDescription: "Soft, natural-looking expression refinement.",
        image: { alt: "Botox treatment" },
        whatIsIt:
          "A precise, conservative treatment that softens expression lines while preserving natural movement and expressiveness.",
        commonConcerns: ["Expression lines", "Fine wrinkles", "Wanting a preventative approach"],
        approach: "Dosing and placement are kept conservative, aiming for a refreshed look rather than a frozen one.",
        treatmentOptions: ["Upper-face expression lines", "Preventative low-dose treatment"],
        journey: "A quick in-clinic procedure, with full effect assessed at a follow-up visit within a few weeks.",
        notes: "Effects are temporary and gradually fade — maintenance sessions are planned around your response.",
        bookingLabel: "Book an Appointment",
      },
      {
        id: "gum-smile",
        slug: "gum-smile-treatment",
        name: "Gum Smile Treatment",
        shortDescription: "A refined, balanced smile line.",
        image: { alt: "Gummy smile treatment" },
        whatIsIt:
          "A conservative treatment approach to soften an excessive gum display when smiling, aiming for a natural, well-proportioned result.",
        commonConcerns: ["Excess gum show when smiling", "Feeling self-conscious about your smile"],
        approach: "An assessment of your smile line and lip movement guides a measured, reversible-first plan.",
        treatmentOptions: ["Conservative in-clinic treatment", "Review and adjustment at follow-up"],
        journey: "A quick procedure, with results typically reviewed at a follow-up visit.",
        notes: "Results are temporary and individual response varies — discussed fully at consultation.",
        bookingLabel: "Book an Appointment",
      },
    ],
  },
  {
    id: "lips-eyes",
    title: "Lips & Under-Eye",
    cardLabel: "Definition & under-eye care",
    description: "Gentle, targeted care for two of the face's most delicate areas.",
    image: { alt: "Lips and under-eye treatment category" },
    treatments: [
      {
        id: "lip-brightening",
        slug: "lip-brightening-treatment",
        name: "Lip Brightening & Treatment",
        shortDescription: "Gentle tone correction and definition.",
        image: { alt: "Lip brightening treatment" },
        whatIsIt:
          "A gentle approach to lip pigmentation and definition, restoring a naturally healthy color and shape without an overdone result.",
        commonConcerns: ["Uneven lip pigmentation", "Reduced lip definition", "Dry or dull-looking lips"],
        approach: "Treatment is kept subtle and gradual, prioritizing a natural-looking outcome over a dramatic change.",
        treatmentOptions: ["Lip brightening sessions", "Conservative definition treatment"],
        journey: "A short course of sessions, spaced per your treatment plan.",
        notes: "Results build gradually — sun protection helps maintain lip tone over time.",
        bookingLabel: "Book an Appointment",
      },
      {
        id: "dark-circles",
        slug: "dark-circles-treatment",
        name: "Dark Circles Treatment",
        shortDescription: "A plan built around your actual cause.",
        image: { alt: "Under-eye dark circle treatment" },
        whatIsIt:
          "Dark circles can come from pigment, volume loss, or vascularity — often a mix. Treatment starts with identifying which is at play for you.",
        commonConcerns: ["Persistent under-eye darkness", "A tired-looking appearance", "Shadowing from volume loss"],
        approach: "A gentle, diagnosis-led plan suited to the delicate under-eye area, avoiding one-size-fits-all fixes.",
        treatmentOptions: [
          "Targeted topical protocols",
          "Mesotherapy",
          "Conservative filler where volume loss is the cause",
        ],
        journey: "Pacing and treatment choice depend on the underlying cause, set together at consultation.",
        notes:
          "Under-eye skin is delicate — improvement is typically gradual, with realistic expectations set upfront.",
        bookingLabel: "Book an Appointment",
      },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Treatments",
    cardLabel: "Laser, micro-needling & PRP",
    description: "Modern, technology-led treatments for texture, tone and renewal.",
    image: { alt: "Advanced treatment category" },
    treatments: [
      {
        id: "dermapen",
        slug: "dermapen",
        name: "Dermapen",
        shortDescription: "Micro-needling to support skin renewal.",
        image: { alt: "Dermapen microneedling treatment" },
        whatIsIt:
          "Controlled micro-needling stimulates the skin's natural repair process, improving the appearance of texture, fine scarring, and tone.",
        commonConcerns: ["Acne scarring", "Enlarged pores", "Uneven texture", "Early fine lines"],
        approach: "Needle depth and technique are adjusted to your skin's condition and the areas of concern.",
        treatmentOptions: ["Facial micro-needling course", "Combined with mesotherapy actives"],
        journey: "Delivered as a course, spaced to allow full recovery between sessions.",
        notes: "Some redness is expected for a short period after treatment.",
        bookingLabel: "Book an Appointment",
      },
      {
        id: "fractional-laser",
        slug: "fractional-laser",
        name: "Fractional Laser",
        shortDescription: "Advanced resurfacing for texture and tone.",
        image: { alt: "Fractional laser treatment" },
        whatIsIt:
          "A precise, fractionated laser approach that resurfaces skin in a controlled way, improving texture and tone with a planned recovery.",
        commonConcerns: ["Textural irregularities", "Scarring", "Sun-related tone changes"],
        approach:
          "Treatment depth is calibrated to your skin and goals, balancing visible improvement with manageable downtime.",
        treatmentOptions: ["Full-face resurfacing", "Targeted area treatment"],
        journey: "Session count and recovery time depend on treatment depth, set clearly at consultation.",
        notes: "Sun protection after treatment is essential while skin recovers.",
        bookingLabel: "Book an Appointment",
      },
      {
        id: "prp-skin",
        slug: "prp-for-skin",
        name: "PRP for Skin",
        shortDescription: "Regenerative plasma therapy for facial glow.",
        image: { alt: "PRP for skin treatment" },
        whatIsIt:
          "The same regenerative principle as PRP for hair, applied to the face — using your own plasma to support collagen and skin quality.",
        commonConcerns: ["Early signs of skin fatigue", "Wanting a natural, non-filler option", "Dull or uneven texture"],
        approach: "Your own plasma is prepared and reintroduced to the skin, often alongside other rejuvenation treatments.",
        treatmentOptions: ["Standalone facial PRP course", "Combined with mesotherapy or Dermapen"],
        journey: "A short course of sessions, with results building gradually over the following weeks.",
        notes: "As a regenerative treatment, PRP works gradually — it is not an instant-result procedure.",
        bookingLabel: "Book an Appointment",
      },
    ],
  },
];
