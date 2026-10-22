import type { NutrientAbsorptionCase } from "@/types";

export const NUTRIENT_CASES: NutrientAbsorptionCase[] = [
  {
    id: "glucose",
    nutrient: "گلوکز (حاصل از هضم نشاسته)",
    source: "محصول نهایی گوارش کربوهیدرات‌ها",
    route: "blood_capillary",
    explanation:
      "گلوکز مولکولی محلول در آب است. پس از جذب توسط سلول‌های پرز، مستقیماً وارد مویرگ‌های خونی داخل پرز می‌شود و از طریق سیاهرگ باب به کبد می‌رسد.",
    checkpointQuestion: "گلوکز پس از جذب توسط سلول‌های پرز، ابتدا وارد کدام مسیر می‌شود؟",
    checkpointOptions: ["مویرگ خونی", "مویرگ لنفی (لاکتیل)"],
    correctIndex: 0,
  },
  {
    id: "amino_acid",
    nutrient: "اسید آمینه (حاصل از هضم پروتئین)",
    source: "محصول نهایی گوارش پروتئین‌ها",
    route: "blood_capillary",
    explanation:
      "اسیدهای آمینه نیز مانند گلوکز محلول در آب‌اند و مستقیماً از سلول‌های پرز وارد مویرگ‌های خونی می‌شوند.",
    checkpointQuestion: "اسید آمینه پس از جذب، ابتدا وارد کدام مسیر می‌شود؟",
    checkpointOptions: ["مویرگ خونی", "مویرگ لنفی (لاکتیل)"],
    correctIndex: 0,
  },
  {
    id: "fatty_acid",
    nutrient: "اسید چرب و مونوگلیسیرید (حاصل از هضم چربی)",
    source: "محصول نهایی گوارش چربی‌ها (پس از عمل صفرا و لیپاز)",
    route: "lymph",
    explanation:
      "اسید چرب و مونوگلیسیرید پس از ورود به سلول‌های پرز، دوباره به ذرات چربی بازسازی می‌شوند. این ذرات به‌دلیل اندازه و ماهیت چربی‌دوست، عمدتاً وارد مویرگ لنفی مرکزی هر پرز (لاکتیل) می‌شوند و سپس از طریق سامانه لنفی سرانجام به جریان خون می‌پیوندند.",
    checkpointQuestion: "محصولات جذب‌شده هضم چربی، ابتدا وارد کدام مسیر می‌شوند؟",
    checkpointOptions: ["مویرگ خونی", "مویرگ لنفی (لاکتیل)"],
    correctIndex: 1,
  },
  {
    id: "water_ion",
    nutrient: "آب و برخی یون‌ها",
    source: "آب موجود در غذا و نوشیدنی‌ها و ترشحات گوارشی",
    route: "blood_capillary",
    explanation:
      "آب و یون‌ها بدون نیاز به گوارش شیمیایی، در روده باریک و همچنین روده بزرگ جذب و مستقیماً وارد مویرگ‌های خونی می‌شوند.",
    checkpointQuestion: "آب جذب‌شده از روده، ابتدا وارد کدام مسیر می‌شود؟",
    checkpointOptions: ["مویرگ خونی", "مویرگ لنفی (لاکتیل)"],
    correctIndex: 0,
  },
];

export const NUTRIENT_MAP: Record<string, NutrientAbsorptionCase> = Object.fromEntries(
  NUTRIENT_CASES.map((n) => [n.id, n])
);
