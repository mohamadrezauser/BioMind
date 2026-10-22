export interface NavItem {
  href: string;
  label: string;
  icon: string; // emoji used as a lightweight, dependency-free icon
  description: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "learn",
    label: "یادگیری",
    items: [
      { href: "/", label: "خانه", icon: "🏠", description: "داشبورد یادگیری شخصی‌سازی‌شده" },
      { href: "/tutor", label: "معلم تطبیقی", icon: "🧠", description: "آموزش تطبیقی گام‌به‌گام" },
      { href: "/ai-tutor", label: "چت هوشمند", icon: "🤖", description: "گفتگوی زنده با هوش مصنوعی زیست‌شناسی" },
      { href: "/lab/digestive-system", label: "آزمایشگاه گوارش", icon: "🧬", description: "کاوش تعاملی دستگاه گوارش (دو‌بعدی)" },
      { href: "/simulator/food-journey", label: "مسیر غذا", icon: "🍽️", description: "دنبال‌کردن سفر غذا در بدن" },
      { href: "/lab/absorption", label: "جذب مواد مغذی", icon: "🩸", description: "آزمایشگاه پرزهای روده" },
    ],
  },
  {
    id: "practice",
    label: "تمرین و سنجش",
    items: [
      { href: "/quiz", label: "تمرین سریع", icon: "📝", description: "آزمون کوتاه تطبیقی" },
      { href: "/exams", label: "آزمون‌ها", icon: "🧮", description: "آزمون‌های قابل‌تنظیم با زمان‌بندی دلخواه" },
      { href: "/assessment", label: "پیش/پس‌آزمون", icon: "🧪", description: "سنجش قبل و بعد از آموزش" },
    ],
  },
  {
    id: "play",
    label: "بازی‌ها",
    items: [{ href: "/games", label: "بازی‌های آموزشی", icon: "🎮", description: "مرکز بازی‌های آموزشی زیست‌شناسی" }],
  },
  {
    id: "track",
    label: "پیشرفت",
    items: [{ href: "/progress", label: "پیشرفت من", icon: "📊", description: "گزارش کامل یادگیری و دستاوردها" }],
  },
  {
    id: "more",
    label: "بیشتر",
    items: [
      { href: "/teacher", label: "حالت نمایش", icon: "🎓", description: "نمایش برای جشنواره علمی" },
      { href: "/about", label: "درباره پروژه", icon: "ℹ️", description: "معرفی و تیم پروژه" },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

/** Curated subset for the mobile bottom tab bar — the core learning loop. */
export const MOBILE_PRIMARY_HREFS = ["/", "/tutor", "/games", "/quiz", "/progress"];
export const MOBILE_PRIMARY_ITEMS: NavItem[] = MOBILE_PRIMARY_HREFS.map(
  (href) => NAV_ITEMS.find((item) => item.href === href)!
);
