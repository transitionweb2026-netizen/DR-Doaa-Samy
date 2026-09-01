import type { ImageAsset } from "@/lib/types/content";

export const aboutIntroVideoContent: {
  eyebrow: string;
  heading: string;
  video: ImageAsset & { durationLabel?: string };
} = {
  eyebrow: "In Her Words",
  heading: "A closer look at how Dr. Doaa works",
  video: {
    alt: "Dr. Doaa Samy introducing her approach to dermatology",
    durationLabel: "2:14",
  },
};
