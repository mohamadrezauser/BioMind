"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppState } from "@/hooks/useAppState";
import { Card, SectionHeading, ProgressBar, MasteryBadge, EmptyState } from "@/components/ui/Primitives";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { buildAdaptiveQuiz } from "@/assessment/quizEngine";
import { CONCEPT_ORDER, CONCEPT_MAP } from "@/content/concepts";
import { levelFromScore } from "@/learning/mastery";
import type { AnswerResponse } from "@/assessment/quizEngine";
import type { QuizQuestion } from "@/types";
import { toPersianDigits } from "@/utils/cn";

type Stage = "setup" | "running" | "summary";

interface AttemptLog {
  question: QuizQuestion;
  correct: boolean;
  usedHint: boolean;
}

export default function QuizPage() {
  const { state, recordAttempt, completeActivity } = useAppState();
  const [stage, setStage] = useState<Stage>("setup");
  const [count, setCount] = useState(8);
  const [timed, setTimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [log, setLog] = useState<AttemptLog[]>([]);
  const [answeredCurrent, setAnsweredCurrent] = useState(false);

  useEffect(() => {
    if (stage !== "running" || !timed || answeredCurrent) return;
    if (timeLeft <= 0) {
      handleAnswer({ kind: "index", value: -1 }, false, false);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, timed, timeLeft, answeredCurrent]);

  function startQuiz() {
    const qs = buildAdaptiveQuiz(state.mastery, CONCEPT_ORDER, count, state.seenQuestionIds);
    setQuestions(qs);
    setIndex(0);
    setLog([]);
    setStage("running");
    setAnsweredCurrent(false);
    setTimeLeft(40);
  }

  function handleAnswer(response: AnswerResponse, correct: boolean, usedHint: boolean) {
    const question = questions[index];
    if (!question) return;
    setAnsweredCurrent(true);
    recordAttempt({
      question,
      correct,
      usedHint,
      changedAnswer: false,
      mode: "quiz",
      misconceptionId:
        !correct && response.kind === "index" && response.value >= 0
          ? question.misconceptionByOption?.[response.value]
          : undefined,
    });
    setLog((prev) => [...prev, { question, correct, usedHint }]);
  }

  function nextQuestion() {
    if (index + 1 >= questions.length) {
      completeActivity("quiz_completed");
      setStage("summary");
      return;
    }
    setIndex((i) => i + 1);
    setAnsweredCurrent(false);
    setTimeLeft(40);
  }

  const byConceptSummary = useMemo(() => {
    const map: Record<string, { correct: number; total: number }> = {};
    for (const item of log) {
      const c = (map[item.question.conceptId] ??= { correct: 0, total: 0 });
      c.total += 1;
      if (item.correct) c.correct += 1;
    }
    return map;
  }, [log]);

  const scorePct = log.length ? Math.round((log.filter((l) => l.correct).length / log.length) * 100) : 0;

  if (stage === "setup") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="سنجش تطبیقی"
          title="آزمون تطبیقی گوارش و جذب"
          description="سؤالات بر اساس میزان تسلط فعلی تو در هر مفهوم انتخاب می‌شوند؛ مفاهیمی که ضعیف‌تری بیشتر تکرار می‌شوند."
        />
        <Card>
          <p className="text-sm font-bold text-[var(--color-text)]">تعداد سؤالات</p>
          <div className="mt-2 flex gap-2">
            {[5, 8, 12].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={`bm-btn bm-focus text-sm ${count === n ? "bm-btn-primary" : "bm-btn-secondary"}`}
              >
                {toPersianDigits(n)} سؤال
              </button>
            ))}
          </div>

          <p className="mt-5 text-sm font-bold text-[var(--color-text)]">حالت زمان‌دار (اختیاری)</p>
          <label className="mt-2 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <input
              type="checkbox"
              checked={timed}
              onChange={(e) => setTimed(e.target.checked)}
              className="h-4 w-4"
            />
            هر سؤال ۴۰ ثانیه زمان داشته باشد (اگر فعال نکنی، زمان محدودیتی ندارد)
          </label>

          <button type="button" className="bm-btn bm-btn-primary bm-focus mt-6 w-full" onClick={startQuiz}>
            شروع آزمون ←
          </button>
        </Card>
      </div>
    );
  }

  if (stage === "running") {
    const question = questions[index];
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4">
          <ProgressBar value={((index + (answeredCurrent ? 1 : 0)) / questions.length) * 100} label={`سؤال ${toPersianDigits(index + 1)} از ${toPersianDigits(questions.length)}`} />
        </div>
        {timed && !answeredCurrent && (
          <p className="mb-3 text-left text-xs font-bold text-[var(--color-warning)]">⏱ {toPersianDigits(timeLeft)} ثانیه</p>
        )}
        <Card>
          <QuestionCard key={question.id} question={question} onAnswer={handleAnswer} />
          {answeredCurrent && (
            <button type="button" className="bm-btn bm-btn-primary bm-focus mt-4 w-full text-sm" onClick={nextQuestion}>
              {index + 1 >= questions.length ? "مشاهده نتیجه ←" : "سؤال بعدی ←"}
            </button>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="نتیجه" title="گزارش آزمون" description="خلاصه‌ای از عملکرد تو در این آزمون." />
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">درصد پاسخ‌های درست</p>
            <p className="text-3xl font-extrabold text-[var(--color-teal-deep)]">{toPersianDigits(scorePct)}٪</p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="bm-btn bm-btn-secondary bm-focus text-sm" onClick={() => setStage("setup")}>
              آزمون جدید
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {Object.entries(byConceptSummary).map(([conceptId, s]) => {
            const m = state.mastery[conceptId];
            const level = levelFromScore(m?.score ?? 0, m?.evidenceCount ?? 0);
            return (
              <div key={conceptId} className="rounded-xl border border-[var(--color-border)] p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[var(--color-text)]">{CONCEPT_MAP[conceptId].shortTitle}</p>
                  <MasteryBadge level={level} />
                </div>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {toPersianDigits(s.correct)} درست از {toPersianDigits(s.total)}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="mt-6">
        <SectionHeading eyebrow="مرور" title="مرور پاسخ‌های قبلی" />
        {log.length === 0 ? (
          <EmptyState title="موردی نیست" description="هنوز به سؤالی پاسخ نداده‌ای." />
        ) : (
          <div className="space-y-3">
            {log.map((item, i) => (
              <Card key={i} className={item.correct ? "border-[var(--color-success)]/30" : "border-[var(--color-danger)]/30"}>
                <p className="text-sm font-bold text-[var(--color-text)]">{item.question.prompt}</p>
                <p className="mt-2 text-xs leading-6 text-[var(--color-text-muted)]">
                  {item.correct ? item.question.explanationCorrect : item.question.explanationIncorrect}
                </p>
                <div className="mt-2 flex gap-2">
                  <span className={`bm-tag ${item.correct ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
                    {item.correct ? "پاسخ درست" : "پاسخ نادرست"}
                  </span>
                  {item.usedHint && <span className="bm-tag">از راهنمایی استفاده شد</span>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
