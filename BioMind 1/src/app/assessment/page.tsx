"use client";

import { useMemo, useState } from "react";
import { useAppState } from "@/hooks/useAppState";
import { Card, SectionHeading, ProgressBar, EmptyState, Callout } from "@/components/ui/Primitives";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { CONCEPT_ORDER, CONCEPT_MAP } from "@/content/concepts";
import { QUIZ_BANK } from "@/content/quizBank";
import type { QuizQuestion, PreOrPostTestResult } from "@/types";
import { toPersianDigits, formatPersianDate } from "@/utils/cn";

function buildFixedAssessment(kind: "pretest" | "posttest"): QuizQuestion[] {
  const preferredDifficulty = kind === "pretest" ? "beginner" : "intermediate";
  return CONCEPT_ORDER.map((conceptId) => {
    const pool = QUIZ_BANK.filter((q) => q.conceptId === conceptId && q.type !== "short_answer");
    const preferred = pool.find((q) => q.difficulty === preferredDifficulty);
    return preferred ?? pool[0];
  }).filter(Boolean) as QuizQuestion[];
}

export default function AssessmentPage() {
  const { state, recordAttempt, setAssessmentResult } = useAppState();
  const [active, setActive] = useState<"pretest" | "posttest" | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [byConcept, setByConcept] = useState<Record<string, { correct: number; total: number }>>({});
  const [done, setDone] = useState(false);
  const [lastResult, setLastResult] = useState<PreOrPostTestResult | null>(null);
  const [answered, setAnswered] = useState(false);

  function start(kind: "pretest" | "posttest") {
    setActive(kind);
    setQuestions(buildFixedAssessment(kind));
    setIndex(0);
    setByConcept({});
    setDone(false);
    setLastResult(null);
    setAnswered(false);
  }

  function handleAnswer(correct: boolean) {
    const q = questions[index];
    setByConcept((prev) => {
      const c = { ...(prev[q.conceptId] ?? { correct: 0, total: 0 }) };
      c.total += 1;
      if (correct) c.correct += 1;
      return { ...prev, [q.conceptId]: c };
    });
    recordAttempt({
      question: q,
      correct,
      usedHint: false,
      changedAnswer: false,
      mode: active === "pretest" ? "pretest" : "posttest",
    });
    setAnswered(true);
  }

  function next(finalByConcept: Record<string, { correct: number; total: number }>) {
    setAnswered(false);
    if (index + 1 >= questions.length) {
      const totalCorrect = Object.values(finalByConcept).reduce((a, c) => a + c.correct, 0);
      const totalCount = Object.values(finalByConcept).reduce((a, c) => a + c.total, 0);
      const result: PreOrPostTestResult = {
        kind: active!,
        byConcept: finalByConcept,
        overallScore: totalCount ? Math.round((totalCorrect / totalCount) * 100) : 0,
        completedAt: new Date().toISOString(),
      };
      setAssessmentResult(result);
      setLastResult(result);
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
  }

  if (!active) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="سنجش قبل و بعد از آموزش"
          title="پیش‌آزمون و پس‌آزمون"
          description="پیش از شروع یادگیری، یک پیش‌آزمون کوتاه بده تا دانش اولیه‌ات ثبت شود. بعد از تمرین با آزمایشگاه‌ها، شبیه‌سازها و معلم هوشمند، پس‌آزمون را بده تا پیشرفتت را ببینی."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="font-extrabold text-[var(--color-text)]">پیش‌آزمون</p>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {toPersianDigits(CONCEPT_ORDER.length)} سؤال پایه، یکی از هر مفهوم اصلی.
            </p>
            {state.pretest && (
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                آخرین نتیجه: {toPersianDigits(state.pretest.overallScore)}٪ در {formatPersianDate(state.pretest.completedAt)}
              </p>
            )}
            <button type="button" className="bm-btn bm-btn-primary bm-focus mt-4 w-full text-sm" onClick={() => start("pretest")}>
              {state.pretest ? "اجرای دوباره پیش‌آزمون" : "شروع پیش‌آزمون"}
            </button>
          </Card>
          <Card>
            <p className="font-extrabold text-[var(--color-text)]">پس‌آزمون</p>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {toPersianDigits(CONCEPT_ORDER.length)} سؤال با سطح کمی بالاتر، برای سنجش پیشرفت.
            </p>
            {state.posttest && (
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                آخرین نتیجه: {toPersianDigits(state.posttest.overallScore)}٪ در {formatPersianDate(state.posttest.completedAt)}
              </p>
            )}
            <button type="button" className="bm-btn bm-btn-primary bm-focus mt-4 w-full text-sm" onClick={() => start("posttest")}>
              {state.posttest ? "اجرای دوباره پس‌آزمون" : "شروع پس‌آزمون"}
            </button>
          </Card>
        </div>

        {state.pretest && state.posttest && (
          <div className="mt-6">
            <Callout tone="info" title="مقایسه آخرین نتایج">
              پیش‌آزمون: {toPersianDigits(state.pretest.overallScore)}٪ ← پس‌آزمون: {toPersianDigits(state.posttest.overallScore)}٪.
              برای مشاهده جزئیات بیشتر به صفحه «پیشرفت من» برو.
            </Callout>
          </div>
        )}
      </div>
    );
  }

  if (!done) {
    const q = questions[index];
    if (!q) return <EmptyState title="سؤالی یافت نشد" description="لطفاً دوباره تلاش کن." />;
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={active === "pretest" ? "پیش‌آزمون" : "پس‌آزمون"} title={CONCEPT_MAP[q.conceptId].shortTitle ?? ""} />
        <div className="mb-4">
          <ProgressBar value={(index / questions.length) * 100} label={`سؤال ${toPersianDigits(index + 1)} از ${toPersianDigits(questions.length)}`} />
        </div>
        <Card>
          <QuestionCard
            key={q.id}
            question={q}
            onAnswer={(_response, correct) => {
              handleAnswer(correct);
            }}
          />
          {answered && <AssessmentNextButton onNext={() => next(byConcept)} isLast={index + 1 >= questions.length} />}
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="نتیجه" title={active === "pretest" ? "نتیجه پیش‌آزمون" : "نتیجه پس‌آزمون"} />
      <Card>
        <p className="text-sm text-[var(--color-text-muted)]">درصد کلی</p>
        <p className="text-4xl font-extrabold text-[var(--color-teal-deep)]">{toPersianDigits(lastResult?.overallScore ?? 0)}٪</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {Object.entries(byConcept).map(([id, c]) => (
            <div key={id} className="rounded-lg border border-[var(--color-border)] p-3 text-sm">
              <p className="font-bold text-[var(--color-text)]">{CONCEPT_MAP[id].shortTitle}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {toPersianDigits(c.correct)} درست از {toPersianDigits(c.total)}
              </p>
            </div>
          ))}
        </div>
        <button type="button" className="bm-btn bm-btn-secondary bm-focus mt-5 text-sm" onClick={() => setActive(null)}>
          بازگشت
        </button>
      </Card>
    </div>
  );
}

function AssessmentNextButton({ onNext, isLast }: { onNext: () => void; isLast: boolean }) {
  return (
    <button type="button" className="bm-btn bm-btn-primary bm-focus mt-4 w-full text-sm" onClick={onNext}>
      {isLast ? "مشاهده نتیجه ←" : "سؤال بعدی ←"}
    </button>
  );
}
