import type { JourneyStep } from "@/lib/types/content";

export const journeySteps: JourneyStep[] = [
  {
    id: "consultation",
    index: "01",
    title: "Consultation",
    description: "An unhurried conversation about your skin, your history, and your goals.",
  },
  {
    id: "assessment",
    index: "02",
    title: "Skin Assessment",
    description: "A thorough clinical evaluation to understand what your skin actually needs.",
  },
  {
    id: "plan",
    index: "03",
    title: "Personalized Plan",
    description: "A treatment roadmap built around your goals, timeline, and comfort.",
  },
  {
    id: "treatment",
    index: "04",
    title: "Treatment",
    description: "Precise, evidence-based care delivered in a calm clinical setting.",
  },
  {
    id: "follow-up",
    index: "05",
    title: "Follow-Up",
    description: "Ongoing check-ins to track progress and refine the plan as needed.",
  },
];
