"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FOOD_JOURNEYS } from "@/content/foodJourneys";
import { ORGAN_MAP } from "@/content/organs";
import { getQuestionById, checkAnswer } from "@/assessment/quizEngine";
import { Card, SectionHeading, ProgressBar, Callout } from "@/components/ui/Primitives";
import { useAppState } from "@/hooks/useAppState";
import { cn } from "@/utils/cn";

const MACRO_LABEL: Record<string, string> = {
  carbohydrate: "کربوهیدرات",
  protein: "پروتئین",
  lipid: "چربی",
  mixed: "ترکیبی",
};

export default function FoodJourneySimulatorPage() {
  const { recordAttempt, completeActivity } = useAppState();
  const [foodId, setFoodId] = useState(FOOD_JOURNEYS[0].id);
  const [stageIndex, setStageIndex] = useState(0);
  const [mode, setMode] = useState<"manual" | "guided">("manual");
  const [playing, setPlaying] = useState(false);
  const [answeredStages, setAnsweredStages] = useState<Record<number, boolean>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const food = useMemo(() => FOOD_JOURNEYS.find((f) => f.id === foodId)!, [foodId]);
  const stage = food.stages[stageIndex];
  const question = stage.checkQuestionId ? getQuestionById(stage.checkQuestionId) : undefined;
  const isLast = stageIndex === food.stages.length - 1;
  const mustAnswerToAdvance = mode === "guided" && question && !answeredStages[stageIndex];

  function resetToFood(nextFoodId: string) {
    setFoodId(nextFoodId);
    setStageIndex(0);
    setAnsweredStages({});
    setSelectedOption(null);
    setFeedback(null);
    setPlaying(false);
  }

  function goNext() {
    if (mustAnswerToAdvance) return;
    setSelectedOption(null);
    setFeedback(null);
    if (isLast) {
      setPlaying(false);
      completeActivity(`food_journey_${foodId}_completed`);
      return;
    }
    setStageIndex((i) => i + 1);
  }

  function goPrev() {
    setSelectedOption(null);
    setFeedback(null);
    setStageIndex((i) => Math.max(0, i - 1));
  }

  function restart() {
    setStageIndex(0);
    setAnsweredStages({});
    setSelectedOption(null);
    setFeedback(null);
  }

  function submitAnswer() {
    if (!question || selectedOption === null) return;
    const correct = checkAnswer(question, { kind: "index", value: selectedOption });
    setFeedback(correct ? "correct" : "incorrect");
    setAnsweredStages((prev) => ({ ...prev, [stageIndex]: true }));
    recordAttempt({
      question,
      correct,
      usedHint: false,
      changedAnswer: false,
      mode: "quiz",
      misconceptionId: !correct ? question.misconceptionByOption?.[selectedOption] : undefined,
    });
  }

  useEffect(() => {
    if (!playing) return;
    if (mustAnswerToAdvance) {
      setPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      if (isLast) {
        setPlaying(false);
      } else {
        goNext();
      }
    }, 3600);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, stageIndex, mustAnswerToAdvance]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="شبیه‌سازی تعاملی"
        title="شبیه‌ساز سفر غذا در بدن"
        description="یک نوع غذا را انتخاب کن و ببین هنگام عبور از هر اندام، چه نوع گوارشی رخ می‌دهد و چه موادی جذب می‌شوند. این انیمیشن یک مدل آموزشی ساده‌شده است، نه بازسازی دقیق مولکولی."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {FOOD_JOURNEYS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => resetToFood(f.id)}
            className={cn(
              "bm-focus rounded-xl border px-4 py-2 text-sm font-bold transition-colors",
              f.id === foodId
                ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10 text-[var(--color-teal-deep)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
            )}
          >
            {f.name}
            <span className="mr-1 text-[11px] font-normal text-[var(--color-text-muted)]">
              ({MACRO_LABEL[f.macronutrient]})
            </span>
          </button>
        ))}
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              className={cn("bm-btn text-xs bm-focus", mode === "manual" ? "bm-btn-primary" : "bm-btn-secondary")}
              onClick={() => {
                setMode("manual");
                setPlaying(false);
              }}
            >
              حالت دستی
            </button>
            <button
              type="button"
              className={cn("bm-btn text-xs bm-focus", mode === "guided" ? "bm-btn-primary" : "bm-btn-secondary")}
              onClick={() => setMode("guided")}
            >
              حالت هدایت‌شده (پخش خودکار)
            </button>
          </div>
          <span className="text-xs text-[var(--color-text-muted)]">{food.description}</span>
        </div>

        <ProgressBar
          value={((stageIndex + 1) / food.stages.length) * 100}
          label={`مرحله ${stageIndex + 1} از ${food.stages.length}`}
        />

        <div key={stageIndex} className="bm-fade-in mt-5 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl bg-[var(--color-surface-muted)] p-5">
            <p className="text-xs font-bold text-[var(--color-text-muted)]">اندام فعلی</p>
            <h3 className="mt-1 text-2xl font-extrabold text-[var(--color-text)]">{ORGAN_MAP[stage.organId].name}</h3>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {food.stages.map((s, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "h-2 flex-1 rounded-full",
                    idx <= stageIndex ? "bg-[var(--color-teal)]" : "bg-[var(--color-border)]"
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text)]">{stage.composition}</p>
            {stage.agents.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-bold text-[var(--color-text-muted)]">عوامل دخیل</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {stage.agents.map((a) => (
                    <span key={a} className="bm-tag">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {stage.mechanical && (
              <Callout tone="info" title="گوارش مکانیکی">
                {stage.mechanical}
              </Callout>
            )}
            {stage.chemical && (
              <Callout tone="success" title="گوارش شیمیایی">
                {stage.chemical}
              </Callout>
            )}
            {stage.absorption && (
              <Callout tone="warning" title="جذب">
                {stage.absorption}
              </Callout>
            )}

            {question && (
              <div className="rounded-xl border border-[var(--color-border)] p-4">
                <p className="text-sm font-bold text-[var(--color-text)]">{question.prompt}</p>
                <div className="mt-2 flex flex-col gap-2">
                  {question.options?.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={answeredStages[stageIndex]}
                      onClick={() => setSelectedOption(idx)}
                      className={cn(
                        "bm-focus rounded-lg border px-3 py-2 text-right text-sm",
                        answeredStages[stageIndex] && idx === question.correctIndex
                          ? "border-[var(--color-success)] bg-[var(--color-success)]/10"
                          : answeredStages[stageIndex] && idx === selectedOption
                            ? "border-[var(--color-danger)] bg-[var(--color-danger)]/10"
                            : selectedOption === idx
                              ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10"
                              : "border-[var(--color-border)]"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {!answeredStages[stageIndex] ? (
                  <button
                    type="button"
                    className="bm-btn bm-btn-primary bm-focus mt-3 text-xs"
                    disabled={selectedOption === null}
                    onClick={submitAnswer}
                  >
                    ثبت پاسخ و ادامه
                  </button>
                ) : (
                  <p className="mt-3 text-xs leading-6 text-[var(--color-text-muted)]">
                    {feedback === "correct" ? question.explanationCorrect : question.explanationIncorrect}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-4">
          <div className="flex gap-2">
            <button type="button" className="bm-btn bm-btn-secondary bm-focus text-sm" onClick={restart}>
              ↻ شروع دوباره
            </button>
            <button
              type="button"
              className="bm-btn bm-btn-secondary bm-focus text-sm"
              onClick={goPrev}
              disabled={stageIndex === 0}
            >
              ← قبلی
            </button>
          </div>
          <div className="flex gap-2">
            {mode === "guided" && (
              <button
                type="button"
                className="bm-btn bm-btn-secondary bm-focus text-sm"
                onClick={() => setPlaying((p) => !p)}
                disabled={Boolean(mustAnswerToAdvance)}
              >
                {playing ? "⏸ مکث" : "▶ پخش خودکار"}
              </button>
            )}
            <button
              type="button"
              className="bm-btn bm-btn-primary bm-focus text-sm"
              onClick={goNext}
              disabled={Boolean(mustAnswerToAdvance) || (isLast && mode === "manual" ? false : false)}
            >
              {isLast ? "پایان سفر ✓" : "بعدی ←"}
            </button>
          </div>
        </div>
        {mustAnswerToAdvance && (
          <p className="mt-2 text-xs text-[var(--color-warning)]">
            لطفاً ابتدا به سؤال این مرحله پاسخ بده تا ادامه دهیم.
          </p>
        )}
      </Card>
    </div>
  );
}
