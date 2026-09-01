import type { StatItem } from "@/lib/types/content";

// Placeholder figures — replace with verified real numbers before launch.
// `emphasis: "hero"` marks the lead figure in the asymmetric stats strip.
export const statsContent: StatItem[] = [
  { id: "cases", value: 3200, suffix: "+", label: "Successful Cases", emphasis: "hero" },
  { id: "experience", value: 12, suffix: "+", label: "Years of Experience" },
  { id: "patients", value: 5400, suffix: "+", label: "Happy Patients" },
  { id: "treatments", value: 20, suffix: "+", label: "Treatments Offered" },
];
