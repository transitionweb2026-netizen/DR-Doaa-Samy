import type { HeroContent } from "@/lib/types/content";

export const aboutHeroContentAr: HeroContent = {
  eyebrow: "عن د. دعاء",
  name: "د. دعاء سامي",
  role: "استشارية الأمراض الجلدية",
  headline: "رعاية تبدأ بالإصغاء، لا بقائمة إجراءات.",
  description:
    "ممارسة جلدية مبنية على فكرة بسيطة: لبشرتك قصتها الخاصة، وأي خطة جيدة تبدأ بفهمها — لا باللجوء لأحدث صيحة.",
  primaryCta: { label: "احجز موعدك", href: "/ar/contact" },
  secondaryCta: { label: "استكشف الخدمات", href: "/ar/services" },
  portrait: {
    src: "/images/hero/doaa-hero.png",
    alt: "صورة الدكتورة دعاء سامي في عيادتها",
  },
};
