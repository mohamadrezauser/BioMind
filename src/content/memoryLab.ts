// Content for "BioMind Memory Lab" — a flip-card matching game that
// reinforces digestion & absorption terminology already taught across the
// app (concepts, organs, enzymes). Every definition below is a short,
// curriculum-aligned restatement of verified content from concepts.ts,
// organs.ts and enzymeMatch.ts — nothing new or unverified is introduced.

export interface MemoryPair {
  id: string;
  term: string;
  definition: string;
}

export interface MemoryDeck {
  id: string;
  title: string;
  description: string;
  pairs: MemoryPair[];
}

export const MEMORY_DECKS: MemoryDeck[] = [
  {
    id: "organs",
    title: "اندام‌های دستگاه گوارش",
    description: "هر اندام را با وظیفه اصلی‌اش جور کن.",
    pairs: [
      { id: "mouth", term: "دهان", definition: "خرد کردن غذا و شروع هضم شیمیایی نشاسته با آمیلاز بزاقی" },
      { id: "esophagus", term: "مری", definition: "انتقال لقمه غذا از حلق به معده با حرکات کرمی" },
      { id: "stomach", term: "معده", definition: "هضم شیمیایی پروتئین در محیط اسیدی به کمک پپسین" },
      { id: "liver", term: "کبد", definition: "تولید صفرا برای امولسیون‌سازی چربی‌ها" },
      { id: "gallbladder", term: "کیسه صفرا", definition: "ذخیره و غلیظ‌کردن صفرای ساخته‌شده در کبد" },
      { id: "pancreas", term: "پانکراس", definition: "ترشح آنزیم‌های گوارشی برای روده باریک" },
      { id: "small_intestine", term: "روده باریک", definition: "محل اصلی تکمیل گوارش و جذب مواد مغذی" },
      { id: "large_intestine", term: "روده بزرگ", definition: "جذب آب و برخی یون‌ها و شکل‌گیری مدفوع" },
    ],
  },
  {
    id: "enzymes",
    title: "آنزیم‌ها و بستر آن‌ها",
    description: "هر آنزیم گوارشی را با مولکولی که روی آن اثر می‌گذارد جور کن.",
    pairs: [
      { id: "amylase", term: "آمیلاز", definition: "نشاسته را به قندهای کوچک‌تر تجزیه می‌کند" },
      { id: "pepsin", term: "پپسین", definition: "پروتئین را در معده به پپتیدهای کوچک‌تر تجزیه می‌کند" },
      { id: "trypsin", term: "تریپسین", definition: "پپتیدها را در روده باریک به اسید آمینه تجزیه می‌کند" },
      { id: "lipase", term: "لیپاز", definition: "چربی امولسیون‌شده را به اسید چرب و مونوگلیسیرید تجزیه می‌کند" },
      { id: "bile", term: "صفرا", definition: "قطرات چربی را امولسیون می‌کند؛ خودش آنزیم نیست" },
    ],
  },
  {
    id: "concepts",
    title: "مفاهیم کلیدی گوارش و جذب",
    description: "واژه‌های مهم فصل را با تعریف درستشان جور کن.",
    pairs: [
      { id: "mechanical_digestion", term: "گوارش مکانیکی", definition: "خرد و مخلوط‌شدن فیزیکی غذا بدون تغییر شیمیایی" },
      { id: "chemical_digestion", term: "گوارش شیمیایی", definition: "شکستن پیوند مولکول‌های بزرگ با کمک آنزیم‌ها" },
      { id: "absorption", term: "جذب", definition: "عبور مولکول‌های کوچک هضم‌شده از دیواره روده به خون یا لنف" },
      { id: "villi", term: "پرز روده", definition: "برآمدگی‌های ریز دیواره روده باریک که سطح جذب را افزایش می‌دهند" },
      { id: "enzyme_specificity", term: "اختصاصی‌بودن آنزیم", definition: "هر آنزیم فقط روی یک نوع بستر خاص اثر می‌کند" },
      { id: "lymph_route", term: "مسیر لنفی", definition: "مسیر اصلی ورود محصولات جذب‌شده چربی به جریان خون" },
    ],
  },
];

export const MEMORY_DECK_MAP: Record<string, MemoryDeck> = Object.fromEntries(
  MEMORY_DECKS.map((d) => [d.id, d])
);
