import type { MisconceptionDefinition } from "@/types";

export const MISCONCEPTIONS: MisconceptionDefinition[] = [
  {
    id: "mis_digestion_is_absorption",
    conceptId: "digestion_vs_absorption",
    title: "یکی‌دانستن گوارش و جذب",
    belief: "دانش‌آموز فکر می‌کند «گوارش» و «جذب» دقیقاً یک فرآیند هستند.",
    evidenceHints: [
      "پاسخ اشتباه به سؤال تفاوت گوارش و جذب",
      "استفاده از دو واژه به‌جای هم در توضیحات",
    ],
    diagnosticQuestionId: "q_da_1",
    targetedExplanation:
      "گوارش یعنی خرد و تجزیه شدن غذا (مکانیکی یا شیمیایی) به مولکول‌های کوچک‌تر. جذب یعنی عبور همان مولکول‌های کوچک از دیواره روده به خون یا لنف. یک ماده باید ابتدا هضم شود تا قابل جذب باشد؛ پس این دو، دو مرحله پیاپی و جدا هستند، نه یک فرآیند.",
    followUpQuestionId: "q_da_2",
  },
  {
    id: "mis_bile_is_enzyme",
    conceptId: "bile_role",
    title: "آنزیم فرض‌کردن صفرا",
    belief: "دانش‌آموز فکر می‌کند صفرا یک آنزیم است که چربی را تجزیه شیمیایی می‌کند.",
    evidenceHints: ["پاسخ اشتباه به سؤال نقش صفرا", "گفتن اینکه صفرا پیوند شیمیایی چربی را می‌شکند"],
    diagnosticQuestionId: "q_bile_1",
    targetedExplanation:
      "صفرا آنزیم نیست و هیچ پیوند شیمیایی‌ای را نمی‌شکند. وظیفه آن امولسیون‌سازی است: خرد کردن قطرات بزرگ چربی به قطرات ریزتر تا سطح تماس چربی با آنزیم لیپاز (که واقعاً چربی را تجزیه شیمیایی می‌کند) افزایش یابد.",
    followUpQuestionId: "q_bile_2",
  },
  {
    id: "mis_all_absorption_in_stomach",
    conceptId: "villi_role",
    title: "تصور جذب در معده",
    belief: "دانش‌آموز فکر می‌کند بیشتر مواد مغذی در معده جذب می‌شوند.",
    evidenceHints: ["پاسخ اشتباه درباره محل اصلی جذب", "اشاره به معده به‌عنوان محل جذب گلوکز یا اسید آمینه"],
    diagnosticQuestionId: "q_abs_1",
    targetedExplanation:
      "معده عمدتاً محل هضم شیمیایی پروتئین‌هاست، نه جذب گسترده مواد مغذی. محل اصلی جذب مواد مغذی، روده باریک است؛ زیرا دیواره آن با پرز و ریزپرز، سطح تماس بسیار زیادی برای جذب فراهم می‌کند.",
    followUpQuestionId: "q_abs_2",
  },
  {
    id: "mis_small_large_confusion",
    conceptId: "large_intestine_role",
    title: "اشتباه‌گرفتن نقش روده باریک و روده بزرگ",
    belief: "دانش‌آموز نقش اصلی جذب مواد مغذی را به روده بزرگ نسبت می‌دهد.",
    evidenceHints: ["پاسخ اشتباه درباره محل جذب گلوکز یا اسید آمینه", "اشتباه در توالی اندام‌ها"],
    diagnosticQuestionId: "q_intestine_1",
    targetedExplanation:
      "روده باریک محل اصلی تکمیل گوارش و جذب مواد مغذی (گلوکز، اسید آمینه، محصولات چربی) است. روده بزرگ عمدتاً آب و برخی یون‌ها را از مواد باقی‌مانده جذب می‌کند و مدفوع را شکل می‌دهد؛ گوارش شیمیایی قابل‌توجهی در آن رخ نمی‌دهد.",
    followUpQuestionId: "q_intestine_2",
  },
  {
    id: "mis_same_transport_route",
    conceptId: "nutrient_transport",
    title: "یکسان‌دانستن مسیر انتقال همه مواد مغذی",
    belief: "دانش‌آموز فکر می‌کند همه مواد مغذی جذب‌شده (از جمله چربی‌ها) مستقیماً و با یک مسیر یکسان وارد خون می‌شوند.",
    evidenceHints: ["پاسخ اشتباه درباره مقصد اولیه محصولات گوارش چربی", "نادیده گرفتن نقش سامانه لنفی"],
    diagnosticQuestionId: "q_transport_1",
    targetedExplanation:
      "گلوکز و اسیدهای آمینه مستقیماً وارد مویرگ‌های خونی پرز می‌شوند. اما بیشتر محصولات هضم چربی، پس از جذب، ابتدا در سلول‌های پرز بازسازی و وارد مویرگ‌های لنفی (لاکتیل) می‌شوند و بعداً از طریق سامانه لنفی به جریان خون می‌پیوندند. پس مسیر اولیه یکسان نیست.",
    followUpQuestionId: "q_transport_2",
  },
  {
    id: "mis_enzyme_everything",
    conceptId: "enzymes_substrates",
    title: "تصور اثر یک آنزیم بر همه مواد",
    belief: "دانش‌آموز فکر می‌کند یک آنزیم گوارشی می‌تواند روی هر نوع ماده غذایی (قند، پروتئین، چربی) اثر بگذارد.",
    evidenceHints: ["پاسخ اشتباه درباره بستر اختصاصی یک آنزیم", "اشتباه در تطبیق آنزیم با نوع مولکول"],
    diagnosticQuestionId: "q_enzyme_1",
    targetedExplanation:
      "هر آنزیم گوارشی معمولاً فقط روی یک دسته خاص از مولکول‌ها (بستر اختصاصی خودش) اثر می‌کند. مثلاً آمیلاز فقط نشاسته، پپسین و تریپسین فقط پروتئین، و لیپاز فقط چربی را تجزیه می‌کنند. این ویژگی را «اختصاصی بودن آنزیم» می‌نامند.",
    followUpQuestionId: "q_enzyme_2",
  },
];

export const MISCONCEPTION_MAP: Record<string, MisconceptionDefinition> = Object.fromEntries(
  MISCONCEPTIONS.map((m) => [m.id, m])
);
