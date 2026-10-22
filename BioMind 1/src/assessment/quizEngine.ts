import type { QuizQuestion, DifficultyLevel, ConceptMastery } from "@/types";
import { QUIZ_BANK } from "@/content/quizBank";
import { levelFromScore } from "@/learning/mastery";

export type AnswerResponse =
  | { kind: "index"; value: number } // mcq / true_false / scenario
  | { kind: "order"; value: number[] } // ordering / labeling
  | { kind: "matching"; value: Record<string, string> } // left -> chosen right
  | { kind: "text"; value: string }; // short answer

export function checkAnswer(question: QuizQuestion, response: AnswerResponse): boolean {
  switch (question.type) {
    case "mcq":
    case "true_false":
    case "scenario":
      return response.kind === "index" && response.value === question.correctIndex;
    case "ordering":
      if (response.kind !== "order" || !question.correctOrder) return false;
      return (
        response.value.length === question.correctOrder.length &&
        response.value.every((v, i) => v === question.correctOrder![i])
      );
    case "labeling":
      // labeling questions in this bank ask the student to select the matching
      // subset of items; order does not matter, so we compare as sets.
      if (response.kind !== "order" || !question.correctOrder) return false;
      return (
        response.value.length === question.correctOrder.length &&
        [...response.value].sort().every((v, i) => v === [...question.correctOrder!].sort()[i])
      );
    case "matching":
      if (response.kind !== "matching" || !question.pairs) return false;
      return question.pairs.every((p) => response.value[p.left] === p.right);
    case "short_answer":
      if (response.kind !== "text" || !question.acceptableAnswers) return false;
      return question.acceptableAnswers.some(
        (ans) => normalize(ans) === normalize(response.value)
      );
    default:
      return false;
  }
}

function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[\u200c\s]+/g, " ")
    .replace(/[.,،؟!]/g, "");
}

export function getQuestionById(id: string): QuizQuestion | undefined {
  return QUIZ_BANK.find((q) => q.id === id);
}

// --- Exam Center question builder -----------------------------------------

export interface ExamBuildOptions {
  conceptIds: string[] | "all";
  difficulty: DifficultyLevel | "any";
  types: QuizQuestion["type"][] | "any";
  count: number;
  excludeSeenIds?: string[];
  prioritizeWeak?: boolean;
  mastery?: Record<string, ConceptMastery>;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Builds a configurable question set for the Exam Center. Respects concept
 * scope, difficulty, question-type filters, and (optionally) prioritizes
 * concepts with weaker mastery first. Falls back gracefully when a filter
 * combination yields too few questions, so the student always gets the
 * requested count whenever the bank has enough material overall.
 */
export function buildExamQuestions(options: ExamBuildOptions): QuizQuestion[] {
  const scopeIds = options.conceptIds === "all" ? null : new Set(options.conceptIds);
  const typeSet = options.types === "any" ? null : new Set(options.types);
  const excluded = new Set(options.excludeSeenIds ?? []);

  let pool = QUIZ_BANK.filter((q) => {
    if (scopeIds && !scopeIds.has(q.conceptId)) return false;
    if (typeSet && !typeSet.has(q.type)) return false;
    if (options.difficulty !== "any" && q.difficulty !== options.difficulty) return false;
    return true;
  });

  const notExcluded = pool.filter((q) => !excluded.has(q.id));
  if (notExcluded.length >= Math.min(options.count, pool.length)) pool = notExcluded;

  if (options.prioritizeWeak && options.mastery) {
    const weight = (conceptId: string) => {
      const m = options.mastery?.[conceptId];
      const level = levelFromScore(m?.score ?? 0, m?.evidenceCount ?? 0);
      return level === "weak" ? 4 : level === "unknown" ? 3 : level === "developing" ? 2 : 1;
    };
    pool = shuffle(pool).sort((a, b) => weight(b.conceptId) - weight(a.conceptId));
  } else {
    pool = shuffle(pool);
  }

  if (pool.length >= options.count) return pool.slice(0, options.count);

  // Not enough matches for the strict filters: progressively relax difficulty,
  // then type, then scope, so the student still gets a full exam.
  const relaxedByDifficulty = QUIZ_BANK.filter((q) => {
    if (scopeIds && !scopeIds.has(q.conceptId)) return false;
    if (typeSet && !typeSet.has(q.type)) return false;
    return true;
  });
  let combined = [...pool, ...shuffle(relaxedByDifficulty).filter((q) => !pool.some((p) => p.id === q.id))];
  if (combined.length >= options.count) return combined.slice(0, options.count);

  const relaxedByType = QUIZ_BANK.filter((q) => (scopeIds ? scopeIds.has(q.conceptId) : true));
  combined = [...combined, ...shuffle(relaxedByType).filter((q) => !combined.some((p) => p.id === q.id))];
  if (combined.length >= options.count) return combined.slice(0, options.count);

  const everything = shuffle(QUIZ_BANK).filter((q) => !combined.some((p) => p.id === q.id));
  return [...combined, ...everything].slice(0, options.count);
}

const DIFFICULTY_RANK: Record<DifficultyLevel, number> = { beginner: 0, intermediate: 1, advanced: 2 };

export function difficultyForMastery(mastery: ConceptMastery | undefined): DifficultyLevel {
  if (!mastery) return "beginner";
  const level = levelFromScore(mastery.score, mastery.evidenceCount);
  if (level === "unknown" || level === "weak") return "beginner";
  if (level === "developing") return "intermediate";
  return "advanced";
}

/**
 * Picks the best next question for a concept, preferring the requested
 * difficulty but falling back to nearby difficulties, and avoiding
 * questions already seen in this session when possible.
 */
export function pickQuestionForConcept(
  conceptId: string,
  preferredDifficulty: DifficultyLevel,
  excludeIds: string[] = []
): QuizQuestion | undefined {
  const pool = QUIZ_BANK.filter((q) => q.conceptId === conceptId);
  if (pool.length === 0) return undefined;

  const notSeen = pool.filter((q) => !excludeIds.includes(q.id));
  const candidates = notSeen.length > 0 ? notSeen : pool;

  candidates.sort(
    (a, b) =>
      Math.abs(DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[preferredDifficulty]) -
      Math.abs(DIFFICULTY_RANK[b.difficulty] - DIFFICULTY_RANK[preferredDifficulty])
  );
  return candidates[0];
}

/**
 * Build an adaptive quiz set: prioritizes concepts the student has not
 * mastered, mixes difficulty according to current mastery, and avoids
 * repeating recently seen questions where the bank allows it.
 */
export function buildAdaptiveQuiz(
  mastery: Record<string, ConceptMastery>,
  conceptOrder: string[],
  count: number,
  seenQuestionIds: string[]
): QuizQuestion[] {
  const weighted = conceptOrder
    .map((id) => {
      const m = mastery[id];
      const level = levelFromScore(m?.score ?? 0, m?.evidenceCount ?? 0);
      const weight = level === "weak" ? 4 : level === "unknown" ? 3 : level === "developing" ? 2 : 1;
      return { id, weight };
    })
    .flatMap((c) => Array(c.weight).fill(c.id));

  const chosen: QuizQuestion[] = [];
  const usedIds = new Set(seenQuestionIds);
  let guard = 0;
  while (chosen.length < count && guard < count * 20) {
    guard++;
    const conceptId = weighted[Math.floor(Math.random() * weighted.length)];
    const diff = difficultyForMastery(mastery[conceptId]);
    const q = pickQuestionForConcept(conceptId, diff, Array.from(usedIds));
    if (q && !chosen.find((c) => c.id === q.id)) {
      chosen.push(q);
      usedIds.add(q.id);
    }
  }
  // Fallback: fill remaining slots from the whole bank if still short
  if (chosen.length < count) {
    for (const q of QUIZ_BANK) {
      if (chosen.length >= count) break;
      if (!chosen.find((c) => c.id === q.id)) chosen.push(q);
    }
  }
  return chosen;
}
