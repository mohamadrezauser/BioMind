// Deterministic, provider-independent adaptive tutor engine.
// This is the "no-API demo" brain described in the product spec: it genuinely
// adapts (question difficulty, teaching strategy, next concept) based on the
// student's actual answers — it does not just repeat a canned script.
import type {
  ConceptMastery,
  QuizQuestion,
  TeachingStrategyCode,
  DifficultyLevel,
} from "@/types";
import { CONCEPT_MAP, CONCEPT_ORDER } from "@/content/concepts";
import { MISCONCEPTION_MAP } from "@/content/misconceptions";
import { TEACHING_STRATEGIES } from "@/content/strategies";
import { levelFromScore } from "@/learning/mastery";
import { difficultyForMastery, pickQuestionForConcept } from "@/assessment/quizEngine";

export interface TutorStrategyChoice {
  strategy: TeachingStrategyCode;
  rationale: string;
  misconceptionId?: string;
}

export interface TeachingContent {
  heading: string;
  body: string;
  activityLabel?: string;
  activityHref?: string;
}

/** Choose which concept the tutor should focus on next. */
export function selectTutorConcept(
  mastery: Record<string, ConceptMastery>,
  justFinishedConceptId?: string
): string {
  // 1) concepts with evidence showing real weakness come first
  const weakWithEvidence = CONCEPT_ORDER.filter((id) => {
    const m = mastery[id];
    return m && m.evidenceCount > 0 && levelFromScore(m.score, m.evidenceCount) === "weak";
  });
  if (weakWithEvidence.length > 0) {
    const notRepeat = weakWithEvidence.filter((id) => id !== justFinishedConceptId);
    return notRepeat[0] ?? weakWithEvidence[0];
  }

  // 2) never-assessed concepts whose prerequisites are reasonably known
  const unknown = CONCEPT_ORDER.filter((id) => !mastery[id] || mastery[id].evidenceCount === 0);
  for (const id of unknown) {
    const prereqs = CONCEPT_MAP[id].prerequisites;
    const prereqsOk = prereqs.every((p) => (mastery[p]?.score ?? 0) >= 40 || !mastery[p]);
    if (prereqsOk) return id;
  }
  if (unknown.length > 0) return unknown[0];

  // 3) developing concepts
  const developing = CONCEPT_ORDER.filter(
    (id) => mastery[id] && levelFromScore(mastery[id].score, mastery[id].evidenceCount) === "developing"
  );
  if (developing.length > 0) return developing[0];

  // 4) everything mastered → pick something for transfer/review, avoid immediate repeat
  const candidates = CONCEPT_ORDER.filter((id) => id !== justFinishedConceptId);
  return candidates[Math.floor(Math.random() * candidates.length)] ?? CONCEPT_ORDER[0];
}

export function pickDiagnosticQuestion(
  conceptId: string,
  mastery: Record<string, ConceptMastery>,
  seenIds: string[]
): QuizQuestion | undefined {
  const difficulty = difficultyForMastery(mastery[conceptId]);
  return pickQuestionForConcept(conceptId, difficulty, seenIds);
}

export function pickFollowupQuestion(
  conceptId: string,
  mastery: Record<string, ConceptMastery>,
  seenIds: string[],
  direction: "harder" | "same" | "easier"
): QuizQuestion | undefined {
  const base = difficultyForMastery(mastery[conceptId]);
  const order: DifficultyLevel[] = ["beginner", "intermediate", "advanced"];
  let idx = order.indexOf(base);
  if (direction === "harder") idx = Math.min(idx + 1, 2);
  if (direction === "easier") idx = Math.max(idx - 1, 0);
  return pickQuestionForConcept(conceptId, order[idx], seenIds);
}

/** Detect a likely misconception from the chosen (wrong) option, using the
 * question's authored mapping rather than naive keyword matching. */
export function detectMisconceptionFromAnswer(
  question: QuizQuestion,
  selectedIndex: number | undefined
): string | undefined {
  if (selectedIndex === undefined || !question.misconceptionByOption) return undefined;
  return question.misconceptionByOption[selectedIndex];
}

export interface StrategyContext {
  conceptId: string;
  mastery: ConceptMastery | undefined;
  wasCorrect: boolean;
  usedHint: boolean;
  misconceptionId?: string;
  attemptsThisSession: number; // how many questions already asked on this concept in this session
  streakCorrect: number;
}

/** Core adaptive decision: pick a teaching strategy and explain, in Persian, why. */
export function chooseStrategy(ctx: StrategyContext): TutorStrategyChoice {
  const concept = CONCEPT_MAP[ctx.conceptId];
  const level = levelFromScore(ctx.mastery?.score ?? 0, ctx.mastery?.evidenceCount ?? 0);

  if (ctx.misconceptionId) {
    return {
      strategy: "misconception_correction",
      misconceptionId: ctx.misconceptionId,
      rationale:
        "پاسخت با یک برداشت نادرست رایج در میان دانش‌آموزان همخوانی دارد؛ پس مستقیم همان برداشت را اصلاح می‌کنم.",
    };
  }

  if (!ctx.wasCorrect) {
    const prereqNotReady = concept.prerequisites.some((p) => (ctx.mastery?.score ?? 0) < 40 && p);
    if (prereqNotReady && ctx.attemptsThisSession <= 1) {
      return {
        strategy: "prerequisite_question",
        rationale: "پیش از ادامه این مفهوم، بهتر است مطمئن شویم مفهوم پایه‌ای مرتبط را خوب می‌دانی.",
      };
    }
    if (ctx.attemptsThisSession === 0) {
      return {
        strategy: "analogy",
        rationale: "چون این اولین تلاشت روی این مفهوم بود، با یک مثال آشنا از زندگی روزمره شروع می‌کنیم.",
      };
    }
    if (ctx.attemptsThisSession === 1) {
      return {
        strategy: "step_by_step",
        rationale: "چون هنوز جا نیفتاده، این بار مفهوم را قدم‌به‌قدم و دقیق‌تر توضیح می‌دهم.",
      };
    }
    if (ctx.attemptsThisSession === 2) {
      return {
        strategy: "visual_diagram",
        rationale: "برای این مفهوم، دیدن تصویر واقعی اندام‌ها در آزمایشگاه دستگاه گوارش خیلی کمک می‌کند.",
      };
    }
    return {
      strategy: "guided_simulation",
      rationale: "بیا این بار با یک شبیه‌سازی تعاملی مفهوم را دنبال کنیم تا با دیدن روند، بهتر درک شود.",
    };
  }

  // Correct answer
  if (ctx.usedHint) {
    return {
      strategy: "worked_example",
      rationale: "پاسخت درست بود ولی با راهنمایی؛ یک مثال حل‌شده مرور می‌کنیم تا بدون راهنما هم مطمئن باشی.",
    };
  }
  if (ctx.streakCorrect >= 2 && (level === "proficient" || level === "mastered")) {
    return {
      strategy: "review_then_question",
      rationale: "عملکردت در این مفهوم خیلی خوب بوده؛ یک مرور کوتاه و سپس یک سؤال سخت‌تر برای انتقال یادگیری می‌دهم.",
    };
  }
  if (ctx.streakCorrect >= 1) {
    return {
      strategy: "comparison_table",
      rationale: "چون پاسخ درست دادی، با مقایسه این مفهوم با مفهومی مشابه، درک را عمیق‌تر می‌کنیم.",
    };
  }
  return {
    strategy: "simple_explanation",
    rationale: "پاسخت درست بود؛ یک جمع‌بندی ساده می‌دهم تا این مفهوم کاملاً تثبیت شود.",
  };
}

export function buildTeachingContent(
  conceptId: string,
  strategy: TeachingStrategyCode,
  misconceptionId?: string
): TeachingContent {
  const concept = CONCEPT_MAP[conceptId];
  const strategyMeta = TEACHING_STRATEGIES[strategy];

  if (strategy === "misconception_correction" && misconceptionId) {
    const mis = MISCONCEPTION_MAP[misconceptionId];
    return {
      heading: `اصلاح یک برداشت رایج: ${mis.title}`,
      body: mis.targetedExplanation,
    };
  }

  switch (strategy) {
    case "analogy":
      return {
        heading: `${concept.title} — با یک مثال آشنا`,
        body: concept.analogy ?? concept.explanation,
      };
    case "step_by_step":
      return {
        heading: `${concept.title} — گام‌به‌گام`,
        body: concept.explanation,
      };
    case "visual_diagram":
      return {
        heading: `${concept.title} — مشاهده تصویری`,
        body: concept.explanation,
        activityLabel: "باز کردن آزمایشگاه دستگاه گوارش",
        activityHref: `/lab/digestive-system?organ=${concept.relatedOrgans[0] ?? ""}`,
      };
    case "guided_simulation":
      return {
        heading: `${concept.title} — شبیه‌سازی هدایت‌شده`,
        body: concept.explanation,
        activityLabel: "رفتن به شبیه‌ساز مسیر غذا",
        activityHref: "/simulator/food-journey",
      };
    case "mini_game":
      return {
        heading: `${concept.title} — تمرین با بازی`,
        body: concept.explanation,
        activityLabel: "رفتن به بازی‌های آموزشی",
        activityHref: "/games",
      };
    case "prerequisite_question":
      return {
        heading: "مرور یک مفهوم پایه",
        body: concept.prerequisites.length
          ? CONCEPT_MAP[concept.prerequisites[0]].explanation
          : concept.explanation,
      };
    case "worked_example":
      return {
        heading: `${concept.title} — یک مثال حل‌شده`,
        body: concept.explanation,
      };
    case "comparison_table":
      return {
        heading: `${concept.title} — مقایسه مفاهیم`,
        body: concept.explanation,
      };
    case "review_then_question":
      return {
        heading: `${concept.title} — مرور کوتاه`,
        body: concept.explanation,
      };
    case "simple_explanation":
    default:
      return {
        heading: concept.title,
        body: concept.explanation,
        activityLabel: strategyMeta.label,
      };
  }
}
