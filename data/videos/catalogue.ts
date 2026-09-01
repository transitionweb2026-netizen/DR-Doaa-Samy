import type { VideoItem } from "@/lib/types/content";

// The full video catalogue. Home's "Featured Videos" teaser shows the
// first three — one shared source, no content duplication. No real video
// files are wired up yet; `videoUrl` stays undefined until footage exists,
// and VideoCard/VideoModal render a clean placeholder in the meantime.
export const videoCatalogue: VideoItem[] = [
  {
    id: "video-1",
    title: "Understanding Skin Rejuvenation",
    category: "Skin Care",
    thumbnail: { alt: "Skin rejuvenation video thumbnail" },
    durationLabel: "0:45",
    description:
      "A short walkthrough of what a skin rejuvenation course actually involves, from first assessment to maintenance.",
  },
  {
    id: "video-2",
    title: "What to Expect From PRP",
    category: "Treatments",
    thumbnail: { alt: "PRP treatment video thumbnail" },
    durationLabel: "1:10",
    description: "Dr. Doaa explains how PRP sessions work, what a typical appointment looks like, and realistic timelines.",
  },
  {
    id: "video-3",
    title: "A Day Inside the Clinic",
    category: "Behind the Scenes",
    thumbnail: { alt: "Clinic behind the scenes video thumbnail" },
    durationLabel: "0:58",
    description: "A glimpse into the clinic environment and the day-to-day rhythm behind every consultation.",
  },
  {
    id: "video-4",
    title: "Hair Loss: Where to Start",
    category: "Hair Care",
    thumbnail: { alt: "Hair loss discussion video thumbnail" },
    durationLabel: "1:22",
    description: "The questions Dr. Doaa asks first when a patient comes in concerned about hair loss or thinning.",
  },
  {
    id: "video-5",
    title: "Fillers vs. Botox — What's the Difference?",
    category: "Injectables",
    thumbnail: { alt: "Fillers versus Botox video thumbnail" },
    durationLabel: "1:05",
    description: "A plain-language explanation of how these two treatments differ and when each is actually appropriate.",
  },
  {
    id: "video-6",
    title: "Your First Consultation, Explained",
    category: "Patient Q&A",
    thumbnail: { alt: "First consultation explainer video thumbnail" },
    durationLabel: "0:52",
    description: "What actually happens at a first visit — no surprises, no pressure, just a clear plan.",
  },
  {
    id: "video-7",
    title: "Why Skin Type Matters",
    category: "Skin Science",
    thumbnail: { alt: "Skin type science video thumbnail" },
    durationLabel: "1:15",
    description: "A closer look at why the same treatment can behave differently from one skin type to another.",
  },
  {
    id: "video-8",
    title: "Caring for Your Skin After a Peel",
    category: "Aftercare",
    thumbnail: { alt: "Post-peel aftercare video thumbnail" },
    durationLabel: "0:49",
    description: "Practical aftercare guidance to help skin recover comfortably following a peel session.",
  },
  {
    id: "video-9",
    title: "Meet Dr. Doaa Samy",
    category: "Meet the Doctor",
    thumbnail: { alt: "Meet Dr. Doaa Samy video thumbnail" },
    durationLabel: "1:40",
    description: "A short introduction to Dr. Doaa's background, philosophy, and approach to dermatology.",
  },
];
