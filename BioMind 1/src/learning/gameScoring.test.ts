import { describe, expect, it } from "vitest";
import {
  computeMemoryLabScore,
  isPerfectMemoryLabRun,
  meetsRapidRecallAchievement,
  meetsDetectiveAchievement,
  RAPID_RECALL_ACHIEVEMENT_THRESHOLD,
} from "./gameScoring";

describe("computeMemoryLabScore", () => {
  it("awards full score for a perfect run (moves === pairs)", () => {
    expect(computeMemoryLabScore(6, 6)).toEqual({ score: 6, mistakes: 0 });
  });

  it("subtracts one point per mistake beyond the minimum number of moves", () => {
    expect(computeMemoryLabScore(9, 6)).toEqual({ score: 3, mistakes: 3 });
  });

  it("never returns a negative score even with many mistakes", () => {
    expect(computeMemoryLabScore(100, 4)).toEqual({ score: 0, mistakes: 96 });
  });

  it("handles zero pairs safely", () => {
    expect(computeMemoryLabScore(0, 0)).toEqual({ score: 0, mistakes: 0 });
  });
});

describe("isPerfectMemoryLabRun", () => {
  it("is true only when moves equal the number of pairs", () => {
    expect(isPerfectMemoryLabRun(6, 6)).toBe(true);
    expect(isPerfectMemoryLabRun(7, 6)).toBe(false);
  });

  it("is false when there are no pairs at all", () => {
    expect(isPerfectMemoryLabRun(0, 0)).toBe(false);
  });
});

describe("meetsRapidRecallAchievement", () => {
  it("requires at least the configured threshold of correct answers", () => {
    expect(meetsRapidRecallAchievement(8, 10)).toBe(true);
    expect(meetsRapidRecallAchievement(7, 10)).toBe(false);
  });

  it("matches the exported threshold constant exactly at the boundary", () => {
    const total = 20;
    const correct = Math.ceil(total * RAPID_RECALL_ACHIEVEMENT_THRESHOLD);
    expect(meetsRapidRecallAchievement(correct, total)).toBe(true);
  });

  it("returns false for an empty round", () => {
    expect(meetsRapidRecallAchievement(0, 0)).toBe(false);
  });
});

describe("meetsDetectiveAchievement", () => {
  it("is true as soon as at least one case is solved correctly", () => {
    expect(meetsDetectiveAchievement(1)).toBe(true);
    expect(meetsDetectiveAchievement(0)).toBe(false);
  });
});
