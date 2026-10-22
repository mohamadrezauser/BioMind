import type { ConceptMastery, MasteryLevel, DifficultyLevel } from "@/types";
import { CONCEPTS } from "@/content/concepts";

const DIFFICULTY_WEIGHT: Record<DifficultyLevel, number> = {
  beginner: 8,
  intermediate: 12,
  advanced: 16,
};

export function createInitialMastery(): Record<string, ConceptMastery> {
  const now = new Date().toISOString();
  const map: Record<string, ConceptMastery> = {};
  for (const concept of CONCEPTS) {
    map[concept.id] = {
      conceptId: concept.id,
      score: 0,
      evidenceCount: 0,
      confidence: 0,
      lastUpdated: now,
      history: [],
    };
  }
  return map;
}

export function levelFromScore(score: number, evidenceCount: number): MasteryLevel {
  if (evidenceCount === 0) return "unknown";
  if (score < 35) return "weak";
  if (score < 65) return "developing";
  if (score < 88) return "proficient";
  return "mastered";
}

export function levelLabel(level: MasteryLevel): string {
  switch (level) {
    case "unknown":
      return "هنوز ارزیابی نشده";
    case "weak":
      return "نیازمند تمرین بیشتر";
    case "developing":
      return "در حال پیشرفت";
    case "proficient":
      return "مسلط";
    case "mastered":
      return "کاملاً مسلط";
  }
}

export function levelColor(level: MasteryLevel): string {
  switch (level) {
    case "unknown":
      return "var(--color-muted)";
    case "weak":
      return "var(--color-danger)";
    case "developing":
      return "var(--color-warning)";
    case "proficient":
      return "var(--color-teal)";
    case "mastered":
      return "var(--color-success)";
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Update a concept's mastery given one piece of evidence (an answer, hint use, etc.)
 * Uses a bounded, confidence-weighted update so a single wrong answer never
 * collapses mastery to zero, and confidence grows gradually with evidence
 * (one mistake is not treated as definitive proof of a misconception).
 */
export function applyEvidence(
  mastery: ConceptMastery,
  opts: { correct: boolean; difficulty: DifficultyLevel; usedHint?: boolean; reason: string }
): ConceptMastery {
  const base = DIFFICULTY_WEIGHT[opts.difficulty];
  const hintPenalty = opts.usedHint ? 0.6 : 1;
  const rawDelta = (opts.correct ? base : -base * 0.8) * hintPenalty;

  // Diminish swings as more evidence accumulates (stabilizing estimate)
  const stability = 1 / (1 + mastery.evidenceCount * 0.35);
  const delta = rawDelta * (0.5 + 0.5 * stability);

  const nextScore = clamp(mastery.score + delta, 0, 100);
  const nextEvidence = mastery.evidenceCount + 1;
  const nextConfidence = clamp(1 - 1 / (1 + nextEvidence * 0.6), 0, 0.97);

  return {
    ...mastery,
    score: Math.round(nextScore * 10) / 10,
    evidenceCount: nextEvidence,
    confidence: Math.round(nextConfidence * 100) / 100,
    lastUpdated: new Date().toISOString(),
    history: [
      ...mastery.history.slice(-19),
      { delta: Math.round(delta * 10) / 10, reason: opts.reason, at: new Date().toISOString() },
    ],
  };
}

export function overallProgress(mastery: Record<string, ConceptMastery>): number {
  const values = Object.values(mastery);
  if (values.length === 0) return 0;
  const avg = values.reduce((acc, m) => acc + m.score, 0) / values.length;
  return Math.round(avg);
}

export function weakestConcepts(mastery: Record<string, ConceptMastery>, count = 3): string[] {
  const order: MasteryLevel[] = ["weak", "unknown", "developing", "proficient", "mastered"];
  return Object.values(mastery)
    .slice()
    .sort((a, b) => {
      const la = levelFromScore(a.score, a.evidenceCount);
      const lb = levelFromScore(b.score, b.evidenceCount);
      return order.indexOf(la) - order.indexOf(lb) || a.score - b.score;
    })
    .slice(0, count)
    .map((m) => m.conceptId);
}
