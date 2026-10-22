import type { TeachingStrategy, TeachingStrategyCode } from "@/types";

export const TEACHING_STRATEGIES: Record<TeachingStrategyCode, TeachingStrategy> = {
  simple_explanation: {
    code: "simple_explanation",
    label: "توضیح ساده",
    description: "چون این مفهوم برایت تازه است، یک توضیح ساده و مستقیم ارائه می‌کنم.",
  },
  analogy: {
    code: "analogy",
    label: "تشبیه به زندگی روزمره",
    description: "با یک مثال آشنا از زندگی روزمره، مفهوم را ملموس‌تر می‌کنم.",
  },
  step_by_step: {
    code: "step_by_step",
    label: "توضیح گام‌به‌گام",
    description: "چون سؤال قبلی نشان داد نیاز به جزئیات بیشتری داری، مفهوم را مرحله‌به‌مرحله باز می‌کنم.",
  },
  visual_diagram: {
    code: "visual_diagram",
    label: "راهنمای تصویری",
    description: "برای این مفهوم، نمایش تصویری در آزمایشگاه دستگاه گوارش کمک زیادی می‌کند.",
  },
  guided_simulation: {
    code: "guided_simulation",
    label: "شبیه‌سازی هدایت‌شده",
    description: "پیشنهاد می‌کنم این مفهوم را در یک شبیه‌سازی تعاملی دنبال کنیم تا بهتر جا بیفتد.",
  },
  mini_game: {
    code: "mini_game",
    label: "بازی آموزشی کوتاه",
    description: "یک بازی کوتاه می‌تواند این مفهوم را به شکل سرگرم‌کننده تمرین کند.",
  },
  prerequisite_question: {
    code: "prerequisite_question",
    label: "بازگشت به مفهوم پایه",
    description: "قبل از ادامه، بهتر است یک مفهوم پایه‌ای مرتبط را مرور کنیم.",
  },
  worked_example: {
    code: "worked_example",
    label: "مثال حل‌شده",
    description: "یک مثال کامل را با هم حل می‌کنیم، سپس یک مثال مشابه به تو می‌دهم.",
  },
  comparison_table: {
    code: "comparison_table",
    label: "جدول مقایسه‌ای",
    description: "مقایسه کنار هم دو مفهوم مرتبط، تفاوت آن‌ها را روشن‌تر می‌کند.",
  },
  misconception_correction: {
    code: "misconception_correction",
    label: "اصلاح برداشت نادرست",
    description: "به نظر می‌رسد یک برداشت رایج ولی نادرست وجود دارد؛ آن را مستقیم اصلاح می‌کنیم.",
  },
  review_then_question: {
    code: "review_then_question",
    label: "مرور کوتاه و سؤال جدید",
    description: "عملکرد خوبت نشان می‌دهد آماده‌ای؛ یک مرور کوتاه و سپس یک سؤال سخت‌تر.",
  },
};
