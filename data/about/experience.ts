import type { CredentialItem } from "@/lib/types/content";

// Structured placeholders — no degrees, institutions, years, or awards are
// invented here. Every bracketed value must be replaced with Dr. Doaa's
// real, verified credentials before this section goes live.
export const credentials: CredentialItem[] = [
  {
    id: "credential-1",
    category: "Education",
    period: "[Year]",
    title: "[Medical Degree — e.g. MBBCh / MD]",
    institution: "[Medical School Name]",
    description: "Placeholder entry — replace with Dr. Doaa's verified medical education record.",
  },
  {
    id: "credential-2",
    category: "Certification",
    period: "[Year]",
    title: "[Board Certification in Dermatology]",
    institution: "[Certifying Board / Authority]",
    description: "Placeholder entry — replace with the real certifying body and credential.",
  },
  {
    id: "credential-3",
    category: "Certification",
    period: "[Year]",
    title: "[Advanced Aesthetic Medicine Training]",
    institution: "[Training Institute / Program]",
    description: "Placeholder entry — replace with real, completed specialist training.",
  },
  {
    id: "credential-4",
    category: "Experience",
    period: "[Year] — Present",
    title: "[Clinical Practice in Dermatology & Aesthetic Medicine]",
    institution: "[Clinic / Hospital Name]",
    description: "Placeholder entry — replace with a verified summary of clinical experience.",
  },
  {
    id: "credential-5",
    category: "Certification",
    period: "Ongoing",
    title: "Continued Professional Development",
    institution: "[Conferences, Workshops & Memberships]",
    description: "Placeholder entry — replace with real, ongoing professional development activity.",
  },
];
