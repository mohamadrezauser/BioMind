import type { OrganDefinition } from "@/types";

// Verified against standard Grade 10 (Iran) biology curriculum topics for
// digestion & absorption. Content kept general and curriculum-aligned;
// flagged with sourceNote where exact textbook wording could not be verified.
export const ORGANS: OrganDefinition[] = [
  {
    id: "mouth",
    name: "دهان",
    scientificName: "Mouth",
    summary:
      "ورودی دستگاه گوارش. در دهان، دندان‌ها غذا را خرد می‌کنند (گوارش مکانیکی) و بزاق حاوی آنزیم آمیلاز بزاقی، نشاسته را شروع به تجزیه می‌کند (گوارش شیمیایی).",
    processes: ["mechanical", "chemical"],
    secretions: ["بزاق (آب، موکوس، آمیلاز بزاقی)"],
    enzymes: ["آمیلاز بزاقی (روی نشاسته اثر می‌کند)"],
    incoming: ["غذای جویده‌نشده"],
    outgoing: ["لقمه غذا (بولوس) به سمت حلق و مری"],
    order: 1,
  },
  {
    id: "teeth_tongue",
    name: "دندان‌ها و زبان",
    scientificName: "Teeth & Tongue",
    summary:
      "دندان‌ها غذا را می‌برند، می‌شکنند و آسیاب می‌کنند. زبان غذا را می‌چرخاند، با بزاق مخلوط می‌کند و به شکل لقمه (بولوس) درمی‌آورد تا بلع آسان شود.",
    processes: ["mechanical"],
    secretions: [],
    enzymes: [],
    incoming: ["تکه‌های بزرگ غذا"],
    outgoing: ["لقمه نرم و مرطوب"],
    order: 1,
  },
  {
    id: "salivary_glands",
    name: "غدد بزاقی",
    scientificName: "Salivary Glands",
    summary:
      "غدد بزاقی بزاق ترشح می‌کنند که غذا را مرطوب و لغزنده می‌کند و حاوی آنزیم آمیلاز بزاقی برای شروع گوارش شیمیایی نشاسته است.",
    processes: ["chemical"],
    secretions: ["بزاق"],
    enzymes: ["آمیلاز بزاقی"],
    incoming: ["—"],
    outgoing: ["بزاق به داخل دهان"],
    order: 1,
  },
  {
    id: "pharynx",
    name: "حلق",
    scientificName: "Pharynx",
    summary:
      "حلق مسیر مشترک عبور غذا و هوا است. هنگام بلع، مسیر هوا موقتاً بسته می‌شود تا لقمه غذا با ایمنی وارد مری شود.",
    processes: ["mechanical"],
    secretions: [],
    enzymes: [],
    incoming: ["لقمه غذا از دهان"],
    outgoing: ["لقمه غذا به مری"],
    order: 2,
  },
  {
    id: "esophagus",
    name: "مری",
    scientificName: "Esophagus",
    summary:
      "لوله‌ای عضلانی که با حرکات موجی (پریستالسیس) لقمه غذا را از حلق به معده می‌راند. در مری گوارش شیمیایی رخ نمی‌دهد.",
    processes: ["mechanical"],
    secretions: ["موکوس (برای لغزندگی)"],
    enzymes: [],
    incoming: ["لقمه غذا از حلق"],
    outgoing: ["غذا به معده"],
    order: 3,
  },
  {
    id: "stomach",
    name: "معده",
    scientificName: "Stomach",
    summary:
      "کیسه‌ای عضلانی که با انقباض دیواره‌ها غذا را می‌ورزد (مکانیکی) و شیره معده حاوی اسید کلریدریک (HCl) و آنزیم پپسین، پروتئین‌ها را تجزیه می‌کند (شیمیایی). اسید معده، آنزیم نیست؛ محیط اسیدی لازم برای فعالیت پپسین را فراهم می‌کند و بسیاری از میکروب‌ها را از بین می‌برد.",
    processes: ["mechanical", "chemical"],
    secretions: ["اسید کلریدریک (HCl)", "موکوس", "پپسینوژن (پیش‌ساز پپسین)"],
    enzymes: ["پپسین (روی پروتئین‌ها اثر می‌کند)"],
    incoming: ["غذا از مری"],
    outgoing: ["کیموس (غذای نیمه‌هضم‌شده) به روده باریک"],
    order: 4,
  },
  {
    id: "liver",
    name: "کبد",
    scientificName: "Liver",
    summary:
      "کبد صفرا را می‌سازد؛ صفرا یک آنزیم نیست، بلکه ماده‌ای است که چربی‌های درشت را به قطره‌های ریزتر می‌شکند (امولسیون‌سازی) تا سطح تماس آن‌ها با آنزیم‌های چربی بیشتر شود.",
    processes: ["chemical"],
    secretions: ["صفرا (غیر آنزیمی، امولسیون‌کننده چربی)"],
    enzymes: [],
    incoming: ["—"],
    outgoing: ["صفرا به کیسه صفرا و سپس روده باریک"],
    order: 5,
  },
  {
    id: "gallbladder",
    name: "کیسه صفرا",
    scientificName: "Gallbladder",
    summary: "کیسه صفرا، صفرای ساخته‌شده توسط کبد را ذخیره و غلیظ می‌کند و در زمان مناسب آن را به روده باریک می‌فرستد.",
    processes: ["chemical"],
    secretions: ["صفرای ذخیره‌شده"],
    enzymes: [],
    incoming: ["صفرا از کبد"],
    outgoing: ["صفرا به روده باریک (دوازدهه)"],
    order: 5,
  },
  {
    id: "pancreas",
    name: "پانکراس (لوزالمعده)",
    scientificName: "Pancreas",
    summary:
      "پانکراس آنزیم‌های گوارشی قوی (برای نشاسته، پروتئین و چربی) و بی‌کربنات را به روده باریک می‌فرستد. بی‌کربنات، اسید معده را خنثی می‌کند تا آنزیم‌های روده‌ای بتوانند در محیطی مناسب فعالیت کنند.",
    processes: ["chemical"],
    secretions: ["بی‌کربنات (خنثی‌کننده اسید)", "آمیلاز پانکراسی", "تریپسین", "لیپاز پانکراسی"],
    enzymes: ["آمیلاز پانکراسی", "تریپسین (روی پروتئین)", "لیپاز پانکراسی (روی چربی)"],
    incoming: ["—"],
    outgoing: ["آنزیم‌ها و بی‌کربنات به روده باریک"],
    order: 5,
  },
  {
    id: "small_intestine",
    name: "روده باریک",
    scientificName: "Small Intestine",
    summary:
      "محل اصلی تکمیل گوارش شیمیایی و مهم‌ترین محل جذب مواد مغذی است. دیواره داخلی آن پر از برآمدگی‌های انگشتی‌شکل به نام پُرز (villus) است که همراه با ریزپرزها (microvilli) سطح جذب را به‌شدت افزایش می‌دهند.",
    processes: ["chemical", "absorption"],
    secretions: ["آنزیم‌های روده‌ای (روی سطح پرزها)"],
    enzymes: ["آنزیم‌های روده‌ای تکمیلی (مثل دی‌ساکارازها، پپتیدازها)"],
    incoming: ["کیموس از معده", "صفرا از کیسه صفرا", "آنزیم و بی‌کربنات از پانکراس"],
    outgoing: ["مواد مغذی جذب‌شده به خون و لنف", "مواد هضم‌نشده به روده بزرگ"],
    order: 6,
  },
  {
    id: "large_intestine",
    name: "روده بزرگ",
    scientificName: "Large Intestine",
    summary:
      "روده بزرگ عمدتاً آب و برخی یون‌ها را از مواد باقی‌مانده جذب می‌کند و محتویات را به مدفوع تبدیل می‌کند. گوارش شیمیایی قابل‌توجهی در آن رخ نمی‌دهد و جذب مواد مغذی اصلی (مثل گلوکز و اسیدهای آمینه) در آن انجام نمی‌شود.",
    processes: ["absorption", "elimination"],
    secretions: ["موکوس (برای لغزندگی مدفوع)"],
    enzymes: [],
    incoming: ["مواد هضم‌نشده و آب از روده باریک"],
    outgoing: ["مدفوع به راست روده"],
    order: 7,
  },
  {
    id: "rectum",
    name: "راست روده",
    scientificName: "Rectum",
    summary: "راست روده محل ذخیره موقت مدفوع پیش از دفع است.",
    processes: ["elimination"],
    secretions: [],
    enzymes: [],
    incoming: ["مدفوع از روده بزرگ"],
    outgoing: ["مدفوع به مقعد"],
    order: 8,
  },
  {
    id: "anus",
    name: "مقعد",
    scientificName: "Anus",
    summary: "خروجی دستگاه گوارش که دفع مدفوع از طریق آن و با کنترل ارادی اسفنکترها انجام می‌شود.",
    processes: ["elimination"],
    secretions: [],
    enzymes: [],
    incoming: ["مدفوع از راست روده"],
    outgoing: ["دفع از بدن"],
    order: 9,
  },
];

export const ORGAN_MAP: Record<string, OrganDefinition> = Object.fromEntries(
  ORGANS.map((o) => [o.id, o])
);

// Ordered pathway for "guided tour" (main tube organs only, glands shown as branches)
export const MAIN_PATHWAY_ORDER = [
  "mouth",
  "pharynx",
  "esophagus",
  "stomach",
  "small_intestine",
  "large_intestine",
  "rectum",
  "anus",
];

export const ACCESSORY_ORGANS = ["teeth_tongue", "salivary_glands", "liver", "gallbladder", "pancreas"];
