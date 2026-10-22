import type { DifficultyLevel, GameResult } from "@/types";

export interface GameCatalogEntry {
  id: string;
  href: string;
  icon: string;
  gradientClass: string;
  title: string;
  description: string;
  objective: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  topic: string;
  category: "quick" | "sequence" | "match" | "deduction";
  isNew?: boolean;
  /** key into GameResult.gameId used to look up previous scores, if this game records results */
  resultId?: GameResult["gameId"];
}

export const GAMES_CATALOG: GameCatalogEntry[] = [
  {
    id: "pathway",
    href: "/games/pathway",
    icon: "🧭",
    gradientClass: "bm-game-gradient-1",
    title: "ساخت مسیر گوارش",
    description: "اندام‌ها را به ترتیب درست مسیر غذا بچین. با ضربه‌زدن (تپ) قابل انجام است.",
    objective: "درک توالی درست اندام‌های دستگاه گوارش",
    difficulty: "beginner",
    estimatedMinutes: 4,
    topic: "توالی گوارش",
    category: "sequence",
    resultId: "pathway",
  },
  {
    id: "enzyme_match",
    href: "/games/enzyme-match",
    icon: "🧪",
    gradientClass: "bm-game-gradient-6",
    title: "جور کردن آنزیم‌ها",
    description: "هر آنزیم گوارشی را به بستر (ماده‌ای) که روی آن اثر می‌گذارد وصل کن.",
    objective: "یادگیری اختصاصی‌بودن آنزیم‌ها نسبت به بستر خودشان",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    topic: "آنزیم و بستر",
    category: "match",
    resultId: "enzyme_match",
  },
  {
    id: "nutrient_destination",
    href: "/games/nutrient-destination",
    icon: "🚦",
    gradientClass: "bm-game-gradient-3",
    title: "مقصد مواد مغذی",
    description: "مشخص کن هر ماده مغذی جذب‌شده، ابتدا به کدام مسیر (خون یا لنف) می‌رود.",
    objective: "تمایز مسیر انتقال مواد مغذی مختلف پس از جذب",
    difficulty: "advanced",
    estimatedMinutes: 5,
    topic: "جذب و انتقال",
    category: "deduction",
    resultId: "nutrient_destination",
  },
  {
    id: "memory_lab",
    href: "/games/memory-lab",
    icon: "🧠",
    gradientClass: "bm-game-gradient-2",
    title: "آزمایشگاه حافظه زیستی",
    description: "کارت‌ها را برگردان و هر واژه زیستی را به تعریف درستش وصل کن.",
    objective: "تثبیت واژگان و مفاهیم کلیدی گوارش و جذب در حافظه",
    difficulty: "beginner",
    estimatedMinutes: 6,
    topic: "واژگان گوارش و جذب",
    category: "match",
    isNew: true,
    resultId: "memory_match",
  },
  {
    id: "rapid_recall",
    href: "/games/rapid-recall",
    icon: "⚡",
    gradientClass: "bm-game-gradient-5",
    title: "یادآوری سریع",
    description: "به یک سری سؤال کوتاه پاسخ بده؛ می‌توانی حالت زمان‌دار یا بدون‌زمان را انتخاب کنی.",
    objective: "تمرین مرور سریع و بازیابی دانش از بانک سؤال",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    topic: "مرور کلی فصل",
    category: "quick",
    isNew: true,
    resultId: "rapid_recall",
  },
  {
    id: "detective",
    href: "/games/detective",
    icon: "🕵️",
    gradientClass: "bm-game-gradient-4",
    title: "کارآگاه زیست‌شناسی",
    description: "در هر پرونده، یکی از ادعاها نادرست است؛ با استدلال علمی آن را پیدا کن.",
    objective: "تمرین شناسایی برداشت‌های نادرست رایج در فصل گوارش",
    difficulty: "intermediate",
    estimatedMinutes: 7,
    topic: "برداشت‌های نادرست",
    category: "deduction",
    isNew: true,
    resultId: "biology_detective",
  },
];

export const GAME_MAP: Record<string, GameCatalogEntry> = Object.fromEntries(
  GAMES_CATALOG.map((g) => [g.id, g])
);
