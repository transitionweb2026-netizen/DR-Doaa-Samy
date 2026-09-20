/**
 * The small eyebrow/heading/description bundles that sit above repeatable
 * sections — the Arabic mirror of the literal English defaults baked into
 * each page.tsx / scripts/seed.ts. Centralized here so both the /ar pages
 * and the seed script read the exact same Arabic copy.
 */

export const homeSectionCopyAr = {
  featuredServices: {
    eyebrow: "ما نقدمه",
    heading: "أبرز الخدمات",
    description: "لمحة عن أكثر العلاجات طلباً — والكتالوج الكامل تجدينه في صفحة الخدمات.",
  },
  cases: {
    eyebrow: "نتائج حقيقية",
    heading: "حالات وتحولات",
    description: "نظرة مختارة على نتائج العلاج. اسحبي الفاصل للمقارنة — واضغطي لتوسيع كل حالة.",
  },
  whyDoctor: {
    eyebrow: "الفرق",
    heading: "لماذا د. دعاء",
  },
  journey: {
    eyebrow: "المسار",
    heading: "رحلتك مع د. دعاء",
    description: "مسار مدروس وخطوة بخطوة، من الاستشارة الأولى وحتى النتائج الدائمة.",
  },
  reviews: {
    eyebrow: "آراء المرضى",
    heading: "تقييمات المرضى",
    description: "ما يشاركه المرضى بعد تجربة الاستشارة والعلاج.",
  },
  featuredVideos: {
    eyebrow: "شاهدي وتعلّمي",
    heading: "فيديوهات مختارة",
    description: "لقطات قصيرة وتحريرية عن العلاجات والعناية بالبشرة والحياة داخل العيادة.",
  },
  faq: {
    eyebrow: "يجدر معرفته",
    heading: "الأسئلة الشائعة",
  },
} as const;

export const aboutSectionCopyAr = {
  introVideo: {},
  credentials: {
    eyebrow: "المؤهلات",
    heading: "الخبرة والشهادات",
    description: "مسار مستمر من التدريب السريري والممارسة العملية — الأساس الذي تُبنى عليه كل خطة علاجية.",
  },
  keyAreas: {
    eyebrow: "مجالات رئيسية",
    heading: "علاجات مهمة",
    description: "نظرة موجزة على أبرز المجالات التي تركّز عليها د. دعاء — والكتالوج الكامل في صفحة الخدمات.",
  },
  cases: {
    eyebrow: "حالات مختارة",
    heading: "لمحة عن نتائج حقيقية",
    description: "مجموعة مختارة من الرحلات العلاجية. اسحبي الفاصل للمقارنة — واضغطي لتوسيع كل حالة.",
  },
} as const;

export const servicesSectionCopyAr = {
  categories: {
    eyebrow: "ابدئي من هنا",
    heading: "ما الذي تحتاجين علاجه؟",
    description: "اختاري المجال الأقرب لاهتمامك — سينقلك مباشرة إلى العلاجات ذات الصلة أدناه.",
  },
} as const;

export const patientsSectionCopyAr = {
  cases: {
    eyebrow: "نتائج حقيقية",
    heading: "حالات قبل وبعد",
    description: "نظرة أقرب على رحلات العلاج. اسحبي الفاصل للمقارنة — واضغطي لتوسيع كل حالة.",
  },
  reviews: {
    eyebrow: "آراء المرضى",
    heading: "تقييمات المرضى",
  },
  faq: {
    eyebrow: "يجدر معرفته",
    heading: "أسئلة حول مرضانا وتقييماتهم",
  },
} as const;

export const videosSectionCopyAr = {
  library: {
    eyebrow: "شاهدي وتعلّمي",
    heading: "فيديوهات مختارة",
    description: "لقطات قصيرة وتحريرية عن العلاجات وعلم البشرة والحياة داخل العيادة.",
  },
} as const;

export const contactSectionCopyAr = {
  form: {
    eyebrow: "تواصلي معنا",
    heading: "لنتحدث عن بشرتك.",
    description: "تواصلي معنا مباشرة، أو أرسلي رسالة وسنرد عليكِ — أيهما أسهل بالنسبة لكِ.",
  },
} as const;
