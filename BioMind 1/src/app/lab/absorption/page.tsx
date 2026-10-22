"use client";

import { useEffect, useState } from "react";
import { NUTRIENT_CASES } from "@/content/nutrients";
import { VillusDiagram, RouteBadge } from "@/components/organs/VillusDiagram";
import { Card, SectionHeading, Callout, EmptyState } from "@/components/ui/Primitives";
import { useAppState } from "@/hooks/useAppState";
import { cn } from "@/utils/cn";
import type { QuizQuestion } from "@/types";

function caseToQuestion(caseId: string): QuizQuestion {
  const c = NUTRIENT_CASES.find((n) => n.id === caseId)!;
  return {
    id: `absorption_checkpoint_${c.id}`,
    type: "mcq",
    conceptId: "nutrient_transport",
    difficulty: "intermediate",
    skillType: "conceptual",
    prompt: c.checkpointQuestion,
    options: c.checkpointOptions,
    correctIndex: c.correctIndex,
    hint: "به حلالیت این ماده در آب فکر کن.",
    explanationCorrect: c.explanation,
    explanationIncorrect: c.explanation,
  };
}

export default function AbsorptionLabPage() {
  const { recordAttempt, completeActivity } = useAppState();
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [completedCases, setCompletedCases] = useState<string[]>([]);

  useEffect(() => {
    completeActivity("lab_absorption_visited");
  }, [completeActivity]);

  const activeCase = NUTRIENT_CASES.find((c) => c.id === activeCaseId) ?? null;

  function choose(caseId: string) {
    setActiveCaseId(caseId);
    setPrediction(null);
    setRevealed(false);
  }

  function submitPrediction() {
    if (!activeCase || prediction === null) return;
    const question = caseToQuestion(activeCase.id);
    const correct = prediction === activeCase.correctIndex;
    recordAttempt({ question, correct, usedHint: false, changedAnswer: false, mode: "quiz" });
    setRevealed(true);
    setCompletedCases((prev) => (prev.includes(activeCase.id) ? prev : [...prev, activeCase.id]));
    if (completedCases.length + 1 >= NUTRIENT_CASES.length) {
      completeActivity("lab_absorption_all_cases");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="آزمایشگاه تعاملی"
        title="آزمایشگاه جذب مواد مغذی"
        description="روده باریک با داشتن پرز و ریزپرز، سطح جذب بسیار بزرگی دارد. برای هر ماده مغذی پیش‌بینی کن مسیر اولیه انتقال آن کدام است، سپس پاسخ علمی را ببین."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <Card>
          <VillusDiagram highlightRoute={revealed ? activeCase?.route ?? null : null} showLabels={showLabels} />
          <button
            type="button"
            className="bm-btn bm-btn-secondary bm-focus mx-auto mt-2 block text-xs"
            onClick={() => setShowLabels((v) => !v)}
          >
            {showLabels ? "پنهان‌کردن برچسب‌ها" : "نمایش برچسب‌ها"}
          </button>
          <div className="mt-4">
            <Callout tone="info" title="چرا پرز و ریزپرز اهمیت دارند؟">
              چین‌خوردگی‌های روده باریک، پُرزها و ریزپرزهای روی آن‌ها، سطح تماس داخلی روده را بسیار افزایش می‌دهند؛
              هرچه سطح تماس بیشتر باشد، جذب مواد مغذی در زمان کوتاه‌تر و مؤثرتر انجام می‌شود.
            </Callout>
          </div>
        </Card>

        <Card>
          <p className="mb-3 text-sm font-bold text-[var(--color-text)]">یک ماده مغذی را برای بررسی انتخاب کن:</p>
          <div className="flex flex-wrap gap-2">
            {NUTRIENT_CASES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => choose(c.id)}
                className={cn(
                  "bm-focus rounded-xl border px-3 py-2 text-xs font-bold",
                  activeCaseId === c.id
                    ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10 text-[var(--color-teal-deep)]"
                    : "border-[var(--color-border)]",
                  completedCases.includes(c.id) && "opacity-80"
                )}
              >
                {completedCases.includes(c.id) && "✓ "}
                {c.nutrient}
              </button>
            ))}
          </div>

          {!activeCase && (
            <div className="mt-4">
              <EmptyState icon="🧪" title="یک ماده مغذی انتخاب کن" description="برای شروع، روی یکی از دکمه‌های بالا کلیک کن." />
            </div>
          )}

          {activeCase && (
            <div className="bm-fade-in mt-4 rounded-xl border border-[var(--color-border)] p-4">
              <p className="text-xs text-[var(--color-text-muted)]">منشأ</p>
              <p className="text-sm font-bold text-[var(--color-text)]">{activeCase.source}</p>

              <p className="mt-4 text-sm font-bold text-[var(--color-text)]">{activeCase.checkpointQuestion}</p>
              <div className="mt-2 flex flex-col gap-2">
                {activeCase.checkpointOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={revealed}
                    onClick={() => setPrediction(idx)}
                    className={cn(
                      "bm-focus rounded-lg border px-3 py-2 text-right text-sm",
                      revealed && idx === activeCase.correctIndex
                        ? "border-[var(--color-success)] bg-[var(--color-success)]/10"
                        : revealed && idx === prediction
                          ? "border-[var(--color-danger)] bg-[var(--color-danger)]/10"
                          : prediction === idx
                            ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10"
                            : "border-[var(--color-border)]"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {!revealed ? (
                <button
                  type="button"
                  className="bm-btn bm-btn-primary bm-focus mt-3 text-sm"
                  disabled={prediction === null}
                  onClick={submitPrediction}
                >
                  ثبت پیش‌بینی
                </button>
              ) : (
                <div className="mt-3 space-y-2">
                  <RouteBadge route={activeCase.route} />
                  <p className="text-sm leading-7 text-[var(--color-text-muted)]">{activeCase.explanation}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
