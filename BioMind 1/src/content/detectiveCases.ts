// Content for "کارآگاه زیست‌شناسی" (Biology Detective). Each case presents a
// short scenario with several statements — exactly one is a well-documented
// student misconception (deliberately false), the rest are true and verified
// against the same curriculum content already used across BioMind
// (see src/content/concepts.ts and src/content/misconceptions.ts).
// The student must find the incorrect statement and read the reasoning.

import type { DifficultyLevel } from "@/types";

export interface DetectiveStatement {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface DetectiveCase {
  id: string;
  misconceptionId: string;
  difficulty: DifficultyLevel;
  scenario: string;
  statements: DetectiveStatement[];
  explanation: string;
}

export const DETECTIVE_CASES: DetectiveCase[] = [
  {
    id: "case_digestion_absorption",
    misconceptionId: "mis_digestion_is_absorption",
    difficulty: "beginner",
    scenario:
      "یک دانش‌آموز در گزارش آزمایشگاهی خود درباره سرنوشت یک لقمه نان نوشته است. یکی از جمله‌های او با علم زیست‌شناسی هم‌خوانی ندارد.",
    statements: [
      { id: "s1", text: "گوارش یعنی خرد شدن مولکول‌های بزرگ غذا به مولکول‌های کوچک‌تر.", isCorrect: true },
      { id: "s2", text: "گوارش و جذب دقیقاً یک فرآیند هستند و تفاوتی ندارند.", isCorrect: false },
      { id: "s3", text: "جذب یعنی عبور مولکول‌های کوچک از دیواره روده به خون یا لنف.", isCorrect: true },
      { id: "s4", text: "ماده غذایی باید ابتدا هضم شود تا قابلیت جذب پیدا کند.", isCorrect: true },
    ],
    explanation:
      "گوارش و جذب دو مرحله پیاپی اما جدا از هم‌اند: گوارش یعنی تجزیه‌شدن غذا به مولکول‌های کوچک، و جذب یعنی عبور همان مولکول‌ها از دیواره روده به خون یا لنف. یکی‌دانستن این دو، رایج‌ترین برداشت نادرست در این فصل است.",
  },
  {
    id: "case_bile",
    misconceptionId: "mis_bile_is_enzyme",
    difficulty: "intermediate",
    scenario:
      "در یک بحث کلاسی درباره هضم چربی، چند دانش‌آموز نظرات متفاوتی درباره نقش صفرا مطرح کرده‌اند. فقط یکی از ادعاها نادرست است.",
    statements: [
      { id: "s1", text: "صفرا در کبد ساخته و در کیسه صفرا ذخیره می‌شود.", isCorrect: true },
      { id: "s2", text: "صفرا یک آنزیم است که مستقیماً پیوند شیمیایی چربی را می‌شکند.", isCorrect: false },
      { id: "s3", text: "صفرا با امولسیون‌سازی، سطح تماس چربی با لیپاز را افزایش می‌دهد.", isCorrect: true },
      { id: "s4", text: "تجزیه شیمیایی واقعی چربی را آنزیم لیپاز انجام می‌دهد، نه صفرا.", isCorrect: true },
    ],
    explanation:
      "صفرا آنزیم نیست و هیچ پیوند شیمیایی‌ای را نمی‌شکند؛ فقط قطرات بزرگ چربی را به قطرات ریزتر تبدیل می‌کند (امولسیون‌سازی) تا لیپاز بتواند سریع‌تر و مؤثرتر عمل کند.",
  },
  {
    id: "case_stomach_absorption",
    misconceptionId: "mis_all_absorption_in_stomach",
    difficulty: "intermediate",
    scenario:
      "یک جزوه دانش‌آموزی درباره محل جذب مواد مغذی نوشته شده، اما یکی از جمله‌ها محل اصلی جذب را اشتباه معرفی کرده است.",
    statements: [
      { id: "s1", text: "معده عمدتاً محل هضم شیمیایی پروتئین در محیط اسیدی است.", isCorrect: true },
      { id: "s2", text: "بیشتر مواد مغذی مثل گلوکز و اسید آمینه در معده جذب می‌شوند.", isCorrect: false },
      { id: "s3", text: "روده باریک به دلیل داشتن پرز و ریزپرز، سطح جذب بسیار زیادی دارد.", isCorrect: true },
      { id: "s4", text: "محل اصلی جذب گسترده مواد مغذی، روده باریک است.", isCorrect: true },
    ],
    explanation:
      "معده بیشتر محل هضم شیمیایی پروتئین‌هاست، نه جذب گسترده. پرز و ریزپرزهای روده باریک سطح تماس را چندین برابر می‌کنند و آن را به محل اصلی جذب مواد مغذی تبدیل می‌کنند.",
  },
  {
    id: "case_intestines",
    misconceptionId: "mis_small_large_confusion",
    difficulty: "beginner",
    scenario: "در مقایسه روده باریک و روده بزرگ، یکی از ادعاهای زیر نقش این دو اندام را جابه‌جا کرده است.",
    statements: [
      { id: "s1", text: "روده باریک محل اصلی تکمیل گوارش و جذب مواد مغذی است.", isCorrect: true },
      { id: "s2", text: "روده بزرگ محل اصلی جذب گلوکز و اسید آمینه است.", isCorrect: false },
      { id: "s3", text: "روده بزرگ عمدتاً آب و برخی یون‌ها را جذب می‌کند.", isCorrect: true },
      { id: "s4", text: "در روده بزرگ، گوارش شیمیایی قابل‌توجهی رخ نمی‌دهد.", isCorrect: true },
    ],
    explanation:
      "روده باریک محل اصلی تکمیل گوارش و جذب مواد مغذی (گلوکز، اسید آمینه، محصولات چربی) است؛ روده بزرگ عمدتاً آب و یون جذب کرده و مدفوع را شکل می‌دهد.",
  },
  {
    id: "case_transport_route",
    misconceptionId: "mis_same_transport_route",
    difficulty: "advanced",
    scenario:
      "یک گزارش دانش‌آموزی مسیر ورود مواد مغذی جذب‌شده به بدن را توضیح داده است؛ اما یکی از جمله‌ها مسیر چربی‌ها را نادیده گرفته.",
    statements: [
      { id: "s1", text: "گلوکز و اسیدهای آمینه مستقیماً وارد مویرگ‌های خونی پرز می‌شوند.", isCorrect: true },
      { id: "s2", text: "همه مواد مغذی جذب‌شده، از جمله چربی‌ها، دقیقاً با یک مسیر یکسان وارد خون می‌شوند.", isCorrect: false },
      { id: "s3", text: "بیشتر محصولات هضم چربی ابتدا وارد مویرگ‌های لنفی می‌شوند.", isCorrect: true },
      { id: "s4", text: "سامانه لنفی سرانجام محصولات چربی را به جریان خون می‌رساند.", isCorrect: true },
    ],
    explanation:
      "گلوکز و اسید آمینه مستقیم وارد مویرگ خونی می‌شوند، اما محصولات چربی ابتدا در سلول‌های پرز بازسازی و وارد مویرگ‌های لنفی می‌شوند؛ پس مسیر اولیه همه مواد مغذی یکسان نیست.",
  },
  {
    id: "case_enzyme_specificity",
    misconceptionId: "mis_enzyme_everything",
    difficulty: "beginner",
    scenario: "در توضیح یک دانش‌آموز درباره عملکرد آنزیم‌های گوارشی، یکی از جمله‌ها اختصاصی‌بودن آنزیم را نادیده گرفته است.",
    statements: [
      { id: "s1", text: "آمیلاز فقط روی نشاسته اثر می‌کند.", isCorrect: true },
      { id: "s2", text: "یک آنزیم گوارشی می‌تواند روی هر نوع ماده غذایی (قند، پروتئین، چربی) اثر بگذارد.", isCorrect: false },
      { id: "s3", text: "پپسین و تریپسین مخصوص تجزیه پروتئین‌ها هستند.", isCorrect: true },
      { id: "s4", text: "لیپاز فقط چربی را تجزیه می‌کند.", isCorrect: true },
    ],
    explanation:
      "هر آنزیم گوارشی فقط روی بستر اختصاصی خودش اثر می‌کند؛ این ویژگی «اختصاصی‌بودن آنزیم» نام دارد و یک آنزیم نمی‌تواند جایگزین آنزیم دیگر شود.",
  },
];

export const DETECTIVE_CASE_MAP: Record<string, DetectiveCase> = Object.fromEntries(
  DETECTIVE_CASES.map((c) => [c.id, c])
);
