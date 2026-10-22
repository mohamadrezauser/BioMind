// Entirely fictional sample data for the teacher / science-fair demonstration
// mode. None of this is tied to real student records.
export interface DemoProfile {
  id: string;
  name: string;
  summary: string;
  masteryHighlights: Array<{ conceptTitle: string; score: number; note: string }>;
  misconceptionsFound: string[];
}

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: "demo_1",
    name: "دانش‌آموز نمونه ۱ (سارا) — داده ساختگی",
    summary: "پس از ۱۲ تلاش، درک خوبی از توالی اندام‌ها دارد اما صفرا را با آنزیم اشتباه می‌گیرد.",
    masteryHighlights: [
      { conceptTitle: "توالی فرآیندهای گوارشی", score: 82, note: "مسلط" },
      { conceptTitle: "نقش صفرا در گوارش چربی", score: 28, note: "نیازمند تمرین" },
    ],
    misconceptionsFound: ["mis_bile_is_enzyme"],
  },
  {
    id: "demo_2",
    name: "دانش‌آموز نمونه ۲ (امیر) — داده ساختگی",
    summary: "در ابتدا گوارش و جذب را یکی می‌دانست؛ بعد از تمرین با شبیه‌ساز مسیر غذا، این برداشت اصلاح شد.",
    masteryHighlights: [
      { conceptTitle: "تفاوت گوارش و جذب", score: 90, note: "بهبودیافته پس از آموزش هدفمند" },
      { conceptTitle: "مسیر انتقال مواد مغذی جذب‌شده", score: 45, note: "در حال پیشرفت" },
    ],
    misconceptionsFound: ["mis_digestion_is_absorption"],
  },
  {
    id: "demo_3",
    name: "دانش‌آموز نمونه ۳ (نگار) — داده ساختگی",
    summary: "در آزمون تطبیقی عملکرد قوی داشته و اکنون روی سؤالات پیشرفته‌تر کار می‌کند.",
    masteryHighlights: [
      { conceptTitle: "آنزیم‌ها و اختصاصی بودن آن‌ها", score: 95, note: "کاملاً مسلط" },
      { conceptTitle: "نقش روده بزرگ", score: 70, note: "مسلط" },
    ],
    misconceptionsFound: [],
  },
];

export const DEMO_TUTOR_TRANSCRIPT = [
  {
    speaker: "tutor" as const,
    text: "سؤال: نقش اصلی روده بزرگ در مقایسه با روده باریک چیست؟",
  },
  {
    speaker: "student" as const,
    text: "روده بزرگ محل اصلی جذب گلوکز و اسید آمینه است.",
  },
  {
    speaker: "tutor" as const,
    text: "این پاسخ با یک برداشت رایج (اشتباه‌گرفتن نقش روده باریک و بزرگ) همخوانی دارد؛ پس راهبرد «اصلاح برداشت نادرست» را انتخاب می‌کنم و مستقیم توضیح می‌دهم که روده باریک محل اصلی جذب است.",
  },
  {
    speaker: "tutor" as const,
    text: "سؤال پیگیری (ساده‌تر): کدام اندام با داشتن پرز و ریزپرز، سطح جذب بسیار بزرگی دارد؟",
  },
  {
    speaker: "student" as const,
    text: "روده باریک",
  },
  {
    speaker: "tutor" as const,
    text: "درست بود! چون در دو تلاش متوالی پاسخ درست دادی، راهبرد را به «مرور کوتاه و سؤال سخت‌تر» تغییر می‌دهم تا یادگیری را به سطح بالاتر ببریم.",
  },
];
