import type { ImageAsset } from "@/lib/types/content";

export const aboutIntroVideoContentAr: {
  eyebrow: string;
  heading: string;
  video: ImageAsset & { durationLabel?: string };
} = {
  eyebrow: "بكلماتها",
  heading: "نظرة أقرب على أسلوب عمل د. دعاء",
  video: {
    alt: "د. دعاء سامي تقدّم منهجها في طب الجلدية",
    durationLabel: "2:14",
  },
};
