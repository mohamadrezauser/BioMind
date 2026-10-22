import { describe, expect, it } from "vitest";
import { applyEvidence, levelFromScore, overallProgress, weakestConcepts, createInitialMastery } from "./mastery";
import type { ConceptMastery } from "@/types";

function freshMastery(conceptId: string): ConceptMastery {
  return {
    conceptId,
    score: 0,
    evidenceCount: 0,
    confidence: 0,
    lastUpdated: new Date().toISOString(),
    history: [],
  };
}

describe("levelFromScore", () => {
  it("returns 'unknown' when there is no evidence yet, regardless of score", () => {
    expect(levelFromScore(90, 0)).toBe("unknown");
  });

  it("buckets scores into the expected mastery levels", () => {
    expect(levelFromScore(10, 1)).toBe("weak");
    expect(levelFromScore(50, 1)).toBe("developing");
    expect(levelFromScore(70, 1)).toBe("proficient");
    expect(levelFromScore(95, 1)).toBe("mastered");
  });
});

describe("applyEvidence", () => {
  it("increases the score on a correct answer and keeps it within [0, 100]", () => {
    const m = freshMastery("c1");
    const next = applyEvidence(m, { correct: true, difficulty: "beginner", reason: "test" });
    expect(next.score).toBeGreaterThan(m.score);
    expect(next.score).toBeLessThanOrEqual(100);
    expect(next.evidenceCount).toBe(1);
  });

  it("decreases the score on an incorrect answer but never collapses it below zero", () => {
    const m = freshMastery("c1");
    const next = applyEvidence(m, { correct: false, difficulty: "advanced", reason: "test" });
    expect(next.score).toBeLessThanOrEqual(m.score);
    expect(next.score).toBeGreaterThanOrEqual(0);
  });

  it("applies a smaller reward when a hint was used", () => {
    const m = freshMastery("c1");
    const withHint = applyEvidence(m, { correct: true, difficulty: "intermediate", usedHint: true, reason: "x" });
    const withoutHint = applyEvidence(m, { correct: true, difficulty: "intermediate", usedHint: false, reason: "x" });
    expect(withHint.score).toBeLessThan(withoutHint.score);
  });

  it("stabilizes swings as more evidence accumulates", () => {
    let m = freshMastery("c1");
    for (let i = 0; i < 10; i++) {
      m = applyEvidence(m, { correct: true, difficulty: "beginner", reason: "x" });
    }
    const beforeDelta = m.history[m.history.length - 1].delta;
    const next = applyEvidence(m, { correct: true, difficulty: "beginner", reason: "x" });
    const afterDelta = next.history[next.history.length - 1].delta;
    expect(Math.abs(afterDelta)).toBeLessThanOrEqual(Math.abs(beforeDelta) + 0.01);
  });
});

describe("overallProgress", () => {
  it("returns 0 for an empty mastery map", () => {
    expect(overallProgress({})).toBe(0);
  });

  it("averages the mastery scores of all concepts", () => {
    const mastery = {
      a: { ...freshMastery("a"), score: 50 },
      b: { ...freshMastery("b"), score: 100 },
    };
    expect(overallProgress(mastery)).toBe(75);
  });
});

describe("weakestConcepts", () => {
  it("returns the concepts with the lowest mastery first", () => {
    const mastery = {
      strong: { ...freshMastery("strong"), score: 95, evidenceCount: 5 },
      weak: { ...freshMastery("weak"), score: 10, evidenceCount: 5 },
      mid: { ...freshMastery("mid"), score: 50, evidenceCount: 5 },
    };
    const result = weakestConcepts(mastery, 2);
    expect(result[0]).toBe("weak");
    expect(result).toHaveLength(2);
  });
});

describe("createInitialMastery", () => {
  it("creates a zeroed mastery entry for every known concept", () => {
    const initial = createInitialMastery();
    expect(Object.keys(initial).length).toBeGreaterThan(0);
    for (const entry of Object.values(initial)) {
      expect(entry.score).toBe(0);
      expect(entry.evidenceCount).toBe(0);
    }
  });
});
