"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QUIZ_BANK } from "@/content/quizBank";
import { CONCEPT_MAP } from "@/content/concepts";
import { checkAnswer } from "@/assessment/quizEngine";
import { Card, SectionHeading, Callout, Chip, FilterPill, ProgressBar } from "@/components/ui/Primitives";
import { useAppState } from "@/hooks/useAppState";
import { cn, toPersianDigits } from "@/utils/cn";
import type { QuizQuestion } from "@/types";
import { meetsRapidRecallAchievement } from "@/learning/gameScoring";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const LENGTH_OPTIONS = [6, 10, 15] as const;
const TIME_PER_QUESTION = 20;

type Phase = "setup" | "playing" | "summary";

export default function RapidRecallPage() {
  const { recordAttempt, addGameResult, unlockAchievement } = useAppState();
  const [length, setLength] = useState<(typeof LENGTH_OPTIONS)[number]>(10);
  const [timedMode, setTimedMode] = useState(true);
  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIME_PER_QUESTION);
  const [results, setResults] = useState<Array<{ question: QuizQuestion; correct: boolean; timedOut: boolean }>>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = questions[index];

  function startGame() {
    const pool = shuffle(QUIZ_BANK.filter((q) => q.type === "mcq" || q.type === "true_false")).slice(0, length);
    setQuestions(pool);
    setIndex(0);
    setResults([]);
    setSelected(null);
    setAnswered(false);
    setSecondsLeft(TIME_PER_QUESTION);
    setPhase("playing");
  }

  const submit = useMemo(
    () =>
      function submitAnswer(choiceIndex: number | null, timedOut = false) {
        if (!current || answered) return;
        setAnswered(true);
        const correct = choiceIndex !== null && checkAnswer(current, { kind: "index", value: choiceIndex });
        setResults((prev) => [...prev, { question: current, correct, timedOut }]);
        recordAttempt({
          question: current,
          correct,
          usedHint: false,
          changedAnswer: false,
          mode: "game",
          misconceptionId: !correct && choiceIndex !== null ? current.misconceptionByOption?.[choiceIndex] : undefined,
        });
      },
    [current, answered, recordAttempt]
  );

  useEffect(() => {
    if (phase !== "playing" || !timedMode || answered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setSecondsLeft(TIME_PER_QUESTION);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          submit(null, true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, timedMode]);

  function next() {
    if (index + 1 >= questions.length) {
      finishGame();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setAnswered(false);
  }

  function finishGame() {
    const finalResults = results;
    const score = finalResults.filter((r) => r.correct).length;
    addGameResult({ gameId: "rapid_recall", score, total: questions.length, completedAt: new Date().toISOString() });
    if (meetsRapidRecallAchievement(score, questions.length)) {
      unlockAchievement("rapid_recall_streak", "پاسخ‌گوی سریع", "رسیدن به حداقل ۸۰٪ پاسخ درست در یک دور یادآوری سریع");
    }
    setPhase("summary");
  }

  // Handle the transition to summary once the last answer is recorded.
  useEffect(() => {
    if (phase === "playing" && answered && index + 1 >= questions.length && results.length === questions.length) {
      // small delay handled by the explicit "next" button so students can read feedback first
    }
  }, [answered, index, questions.length, results.length, phase]);

  const byConcept = useMemo(() => {
    const map: Record<string, { correct: number; total: number }> = {};
    for (const r of results) {
      const entry = (map[r.question.conceptId] ??= { correct: 0, total: 0 });
      entry.total += 1;
      if (r.correct) entry.correct += 1;
    }
    return map;
  }, [results]);

  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="بازی آموزشی"
          title="یادآوری سریع"
          description="یک سری سؤال کوتاه از کل فصل گوارش و جذب را مرور کن. می‌توانی حالت زمان‌دار یا کاملاً بدون‌زمان را انتخاب کنی — سرعت تنها معیار یادگیری نیست."
        />
        <Card>
          <p className="text-sm font-bold text-[var(--color-text)]">تعداد سؤال‌ها</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {LENGTH_OPTIONS.map((n) => (
              <FilterPill key={n} active={length === n} onClick={() => setLength(n)}>
                {toPersianDigits(n)} سؤال
              </FilterPill>
            ))}
          </div>

          <p className="mt-5 text-sm font-bold text-[var(--color-text)]">حالت بازی</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <FilterPill active={timedMode} onClick={() => setTimedMode(true)}>
              ⏱️ زمان‌دار ({toPersianDigits(TIME_PER_QUESTION)} ثانیه برای هر سؤال)
            </FilterPill>
            <FilterPill active={!timedMode} onClick={() => setTimedMode(false)}>
              🧘 بدون زمان (تمرین آرام)
            </FilterPill>
          </div>

          <button type="button" className="bm-btn bm-btn-primary bm-focus mt-6 w-full" onClick={startGame}>
            شروع بازی ←
          </button>
        </Card>
      </div>
    );
  }

  if (phase === "summary") {
    const score = results.filter((r) => r.correct).length;
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="نتیجه بازی" title="یادآوری سریع — خلاصه عملکرد" />
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">امتیاز نهایی</p>
              <p className="mt-1 text-4xl font-extrabold text-[var(--color-teal-deep)]">
                {toPersianDigits(score)} / {toPersianDigits(questions.length)}
              </p>
            </div>
            <span className="text-5xl" aria-hidden="true">
              {score / Math.max(1, questions.length) >= 0.8 ? "🏆" : score / Math.max(1, questions.length) >= 0.5 ? "👍" : "🌱"}
            </span>
          </div>

          <div className="mt-5 space-y-2">
            {Object.entries(byConcept).map(([conceptId, v]) => (
              <div key={conceptId}>
                <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                  <span>{CONCEPT_MAP[conceptId]?.shortTitle ?? conceptId}</span>
                  <span>
                    {toPersianDigits(v.correct)} از {toPersianDigits(v.total)}
                  </span>
                </div>
                <ProgressBar value={(v.correct / v.total) * 100} showValue={false} />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" className="bm-btn bm-btn-primary bm-focus" onClick={() => setPhase("setup")}>
              ↻ دور جدید
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="یادآوری سریع" title={`سؤال ${toPersianDigits(index + 1)} از ${toPersianDigits(questions.length)}`} />
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Chip>{CONCEPT_MAP[current.conceptId]?.shortTitle ?? "مفهوم"}</Chip>
          {timedMode && (
            <Chip tone={secondsLeft <= 5 ? "advanced" : "neutral"}>⏱️ {toPersianDigits(secondsLeft)} ثانیه</Chip>
          )}
        </div>
        <p className="mt-4 text-base font-bold text-[var(--color-text)]">{current.prompt}</p>
        <div className="mt-4 flex flex-col gap-2">
          {current.options?.map((opt, idx) => {
            const isCorrect = idx === current.correctIndex;
            const isSelected = idx === selected;
            return (
              <button
                key={idx}
                type="button"
                disabled={answered}
                onClick={() => {
                  setSelected(idx);
                  submit(idx);
                }}
                className={cn(
                  "bm-focus rounded-lg border px-3 py-2.5 text-right text-sm transition-colors",
                  answered && isCorrect
                    ? "bm-correct-ring border-[var(--color-success)] bg-[var(--color-success)]/10"
                    : answered && isSelected && !isCorrect
                      ? "bm-incorrect-ring border-[var(--color-danger)] bg-[var(--color-danger)]/10"
                      : "border-[var(--color-border)] hover:border-[var(--color-teal)]"
                )}
              >
                {opt} {answered && isCorrect && " ✓"}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-4 space-y-3">
            <Callout tone={results[results.length - 1]?.correct ? "success" : "warning"} title={results[results.length - 1]?.correct ? "درست بود! ✓" : "دقت کن"}>
              {results[results.length - 1]?.correct ? current.explanationCorrect : current.explanationIncorrect}
            </Callout>
            <button type="button" className="bm-btn bm-btn-primary bm-focus w-full" onClick={next}>
              {index + 1 >= questions.length ? "مشاهده نتیجه نهایی ←" : "سؤال بعدی ←"}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
