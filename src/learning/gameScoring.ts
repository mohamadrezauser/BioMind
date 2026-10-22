// Small, pure scoring helpers shared by the educational games. Kept separate
// from React components so the core rules (what counts as a "perfect" run,
// how efficiency is scored, pass thresholds, ...) can be unit tested on
// their own, independent of any UI.

/**
 * BioMind Memory Lab: the minimum possible number of moves to match `n`
 * pairs is exactly `n` (every move either matches or doesn't). Any extra
 * move beyond that is a "mistake". The score rewards efficiency while never
 * going below zero or above the total number of pairs.
 */
export function computeMemoryLabScore(totalMoves: number, totalPairs: number): { score: number; mistakes: number } {
  const safeTotalPairs = Math.max(0, totalPairs);
  const mistakes = Math.max(0, totalMoves - safeTotalPairs);
  const score = Math.max(0, safeTotalPairs - mistakes);
  return { score, mistakes };
}

export function isPerfectMemoryLabRun(totalMoves: number, totalPairs: number): boolean {
  return computeMemoryLabScore(totalMoves, totalPairs).mistakes === 0 && totalPairs > 0;
}

/** Rapid Recall: reaching an 80% success rate on a completed round unlocks the "rapid responder" achievement. */
export const RAPID_RECALL_ACHIEVEMENT_THRESHOLD = 0.8;

export function meetsRapidRecallAchievement(correct: number, total: number): boolean {
  if (total <= 0) return false;
  return correct / total >= RAPID_RECALL_ACHIEVEMENT_THRESHOLD;
}

/** Biology Detective: any correctly-identified error in a session is worth celebrating and unlocks the achievement. */
export function meetsDetectiveAchievement(score: number): boolean {
  return score > 0;
}
