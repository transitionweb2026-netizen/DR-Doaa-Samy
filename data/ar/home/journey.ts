import type { JourneyStep } from "@/lib/types/content";

export const journeyStepsAr: JourneyStep[] = [
  {
    id: "consultation",
    index: "01",
    title: "الاستشارة",
    description: "حوار هادئ حول بشرتك وتاريخك الطبي وأهدافك.",
  },
  {
    id: "assessment",
    index: "02",
    title: "تقييم البشرة",
    description: "تقييم سريري شامل لفهم ما تحتاجه بشرتك فعلاً.",
  },
  {
    id: "plan",
    index: "03",
    title: "خطة شخصية",
    description: "خارطة علاجية مبنية حول أهدافك وجدولك الزمني وراحتك.",
  },
  {
    id: "treatment",
    index: "04",
    title: "العلاج",
    description: "رعاية دقيقة مبنية على الأدلة العلمية في بيئة عيادية هادئة.",
  },
  {
    id: "follow-up",
    index: "05",
    title: "المتابعة",
    description: "متابعات مستمرة لتتبع التقدم وتعديل الخطة حسب الحاجة.",
  },
];
