import type { AppState } from "@/types";
import { overallProgress } from "@/learning/mastery";

// ---------------------------------------------------------------------------
// Central achievement catalog. Every entry here must correspond either to:
//  (a) an explicit `unlockAchievement()` call at the moment a real event
//      happens (e.g. finishing a game perfectly), or
//  (b) a condition evaluated by `getAutoUnlocks()` below against real,
//      already-recorded state (attempts, completed activities, mastery...).
// Nothing in this catalog is ever marked "unlocked" without a matching real
// student action — there is no fabricated progress.
// ---------------------------------------------------------------------------

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** Short, student-facing hint of how to unlock it. */
  hint: string;
}

export const ACHIEVEMENT_CATALOG: AchievementDef[] = [
  {
    id: "first_step",
    title: "اولین قدم",
    description: "اولین فعالیت یادگیری را در BioMind کامل کردی.",
    icon: "🌱",
    hint: "یک فعالیت یادگیری (آزمایشگاه، تمرین، یا معلم تطبیقی) را کامل کن.",
  },
  {
    id: "biology_explorer",
    title: "کاوشگر زیست‌شناسی",
    description: "آزمایشگاه گوارش، آزمایشگاه جذب و شبیه‌ساز مسیر غذا را تجربه کردی.",
    icon: "🧭",
    hint: "هر سه محیط تعاملی (آزمایشگاه گوارش، جذب، و مسیر غذا) را ببین.",
  },
  {
    id: "question_master",
    title: "استاد پرسش",
    description: "به ۲۵ سؤال به‌درستی پاسخ دادی.",
    icon: "🎯",
    hint: "با تمرین سریع، آزمون‌ها یا بازی‌ها، ۲۵ پاسخ درست ثبت کن.",
  },
  {
    id: "mistake_detective",
    title: "کارآگاه برداشت نادرست",
    description: "یک خطای علمی را در بازی کارآگاه زیست‌شناسی درست تشخیص دادی.",
    icon: "🔍",
    hint: "در بازی «کارآگاه زیست‌شناسی» ادعای نادرست را پیدا کن.",
  },
  {
    id: "revision_champion",
    title: "قهرمان مرور",
    description: "یک آزمون کامل را در مرکز آزمون‌ها به پایان رساندی.",
    icon: "🏅",
    hint: "یک آزمون را تا انتها در بخش «آزمون‌ها» تمام کن.",
  },
  {
    id: "concept_master",
    title: "تسلط بر فصل گوارش",
    description: "میانگین تسلط مفهومی تو به ۸۰٪ یا بالاتر رسید.",
    icon: "⭐",
    hint: "با تمرین مستمر، میانگین تسلط مفهومی را به ۸۰٪ برسان.",
  },
  {
    id: "misconception_fixer",
    title: "اصلاح‌گر برداشت نادرست",
    description: "حداقل یک برداشت نادرست شناسایی‌شده را با پاسخ درست بعدی اصلاح کردی.",
    icon: "💡",
    hint: "بعد از یک پاسخ اشتباه، دوباره تلاش کن و همان مفهوم را درست پاسخ بده.",
  },
  {
    id: "game_explorer",
    title: "کاوشگر بازی‌ها",
    description: "حداقل ۳ بازی آموزشی متفاوت را امتحان کردی.",
    icon: "🎮",
    hint: "از مرکز بازی‌ها، سه بازی مختلف را حداقل یک‌بار بازی کن.",
  },
  // Game-specific achievements — unlocked directly from within each game page.
  {
    id: "pathway_perfect",
    title: "استاد مسیر گوارش",
    description: "چیدن کامل و درست مسیر دستگاه گوارش.",
    icon: "🧭",
    hint: "در بازی «ساخت مسیر گوارش» تمام مراحل را درست بچین.",
  },
  {
    id: "enzyme_master",
    title: "متخصص آنزیم‌ها",
    description: "جور کردن درست همه آنزیم‌ها با بستر آن‌ها.",
    icon: "🧪",
    hint: "در بازی «جور کردن آنزیم‌ها» همه جفت‌ها را درست پیدا کن.",
  },
  {
    id: "nutrient_navigator",
    title: "راهبلد مواد مغذی",
    description: "تشخیص درست مسیر همه مواد مغذی.",
    icon: "🚦",
    hint: "در بازی «مقصد مواد مغذی» مسیر همه موارد را درست حدس بزن.",
  },
  {
    id: "memory_champion",
    title: "قهرمان حافظه زیستی",
    description: "همه جفت‌های آزمایشگاه حافظه را با کمترین اشتباه پیدا کردی.",
    icon: "🧠",
    hint: "در «آزمایشگاه حافظه زیستی» تمام جفت‌ها را پیدا کن.",
  },
  {
    id: "rapid_recall_streak",
    title: "پاسخ‌گوی سریع",
    description: "در یک دور «یادآوری سریع» حداقل ۸۰٪ پاسخ‌ها را درست زدی.",
    icon: "⚡",
    hint: "در بازی «یادآوری سریع» حداقل ۸۰٪ سؤال‌ها را درست پاسخ بده.",
  },
];

export const ACHIEVEMENT_MAP: Record<string, AchievementDef> = Object.fromEntries(
  ACHIEVEMENT_CATALOG.map((a) => [a.id, a])
);

const EXPLORER_ACTIVITY_IDS = [
  "lab_digestive_system_visited",
  "lab_absorption_visited",
];

/**
 * Pure function: given the current real app state, returns the list of
 * "auto" achievements (title/description from the catalog) that the student
 * has genuinely earned but may not yet be present in state.achievements.
 * The caller (useAppState) is responsible for merging these in via
 * unlockAchievement(), which itself de-duplicates by id.
 */
export function getAutoUnlocks(state: AppState): Array<{ id: string; title: string; description: string }> {
  const unlocks: Array<{ id: string; title: string; description: string }> = [];
  const byId = (id: string) => ACHIEVEMENT_MAP[id];

  const push = (id: string) => {
    const def = byId(id);
    if (def) unlocks.push({ id: def.id, title: def.title, description: def.description });
  };

  if (state.completedActivities.length >= 1) push("first_step");

  const hasFoodJourney = state.completedActivities.some((id) => id.startsWith("food_journey_"));
  const exploredCount =
    EXPLORER_ACTIVITY_IDS.filter((id) => state.completedActivities.includes(id)).length + (hasFoodJourney ? 1 : 0);
  if (exploredCount >= 3) push("biology_explorer");

  const correctAttempts = state.attempts.filter((a) => a.correct).length;
  if (correctAttempts >= 25) push("question_master");

  if (state.completedActivities.includes("exam_center_completed")) push("revision_champion");

  if (overallProgress(state.mastery) >= 80) push("concept_master");

  const hasResolvedMisconception = Object.values(state.misconceptionLog).some((m) => m.resolvedCount > 0);
  if (hasResolvedMisconception) push("misconception_fixer");

  const distinctGames = new Set(state.gameResults.map((g) => g.gameId));
  if (distinctGames.size >= 3) push("game_explorer");

  return unlocks;
}
