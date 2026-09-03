import type { HeroContent } from "@/lib/types/content";

export const contactHeroContentAr: HeroContent = {
  eyebrow: "تواصل معنا",
  name: "د. دعاء سامي",
  role: "استشارية الأمراض الجلدية",
  headline: "لنحدّد موعداً للحديث.",
  description: "سواء كان لديك مصدر قلق محدد أو تريدين فقط معرفة من أين تبدئين، تواصلي معنا — حجز استشارة هو أسهل خطوة تالية.",
  // في صفحة التواصل نفسها، ينتقل زر "احجز موعدك" إلى النموذج أدناه بدلاً من الرجوع لهذه الصفحة.
  primaryCta: { label: "احجز موعدك", href: "#contact-heading" },
  secondaryCta: { label: "استكشف الخدمات", href: "/ar/services" },
  portrait: {
    src: "/images/hero/doaa-hero.png",
    alt: "صورة الدكتورة دعاء سامي في عيادتها",
  },
};
