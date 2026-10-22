"use client";

import { useMemo, useState } from "react";
import { DETECTIVE_CASES } from "@/content/detectiveCases";
import { Card, SectionHeading, Callout, DifficultyBadge, Chip } from "@/components/ui/Primitives";
import { useAppState } from "@/hooks/useAppState";
import { cn, toPersianDigits } from "@/utils/cn";
import { meetsDetectiveAchievement } from "@/learning/gameScoring";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function DetectivePage() {
  const { addGameResult, unlockAchievement } = useAppState();
  const [order] = useState(() => shuffle(DETECTIVE_CASES));
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [cluesSeen, setCluesSeen] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = order[index];
  const shuffledStatements = useMemo(() => shuffle(current.statements), [current]);

  function submit(statementId: string) {
    if (revealed) return;
    setSelectedId(statementId);
    setRevealed(true);
    const chosen = current.statements.find((s) => s.id === statementId);
    if (chosen && !chosen.isCorrect) {
      setScore((s) => s + 1);
    }
  }

  function next() {
    if (index + 1 >= order.length) {
      const finalScore = score;
      addGameResult({ gameId: "biology_detective", score: finalScore, total: order.length, completedAt: new Date().toISOString() });
      if (meetsDetectiveAchievement(finalScore)) {
        unlockAchievement("mistake_detective", "کارآگاه برداشت نادرست", "پیدا کردن درست یک خطای علمی در بازی کارآگاه زیست‌شناسی");
      }
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelectedId(null);
    setRevealed(false);
    setCluesSeen(false);
  }

  function restart() {
    setIndex(0);
    setSelectedId(null);
    setRevealed(false);
    setCluesSeen(false);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="نتیجه پرونده‌ها" title="کارآگاه زیست‌شناسی — گزارش نهایی" />
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">پرونده‌های حل‌شده درست</p>
              <p className="mt-1 text-4xl font-extrabold text-[var(--color-teal-deep)]">
                {toPersianDigits(score)} / {toPersianDigits(order.length)}
              </p>
            </div>
            <span className="text-5xl" aria-hidden="true">🕵️</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
            هر پرونده یکی از رایج‌ترین برداشت‌های نادرست فصل گوارش و جذب را پنهان کرده بود. مرور این برداشت‌ها در صفحه
            «پیشرفت من» قابل‌مشاهده است.
          </p>
          <button type="button" className="bm-btn bm-btn-primary bm-focus mt-5" onClick={restart}>
            ↻ شروع دوباره همه پرونده‌ها
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="بازی آموزشی"
        title="کارآگاه زیست‌شناسی"
        description="در هر پرونده چند ادعا مطرح شده که فقط یکی از آن‌ها نادرست است. سرنخ‌ها را بخوان و با استدلال علمی، ادعای اشتباه را پیدا کن."
      />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Chip>پرونده {toPersianDigits(index + 1)} از {toPersianDigits(order.length)}</Chip>
          <DifficultyBadge level={current.difficulty} />
        </div>

        <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
          <p className="text-sm font-bold text-[var(--color-text)]">🗂️ صحنه پرونده</p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">{current.scenario}</p>
        </div>

        {!cluesSeen ? (
          <button type="button" className="bm-btn bm-btn-secondary bm-focus mt-4 text-sm" onClick={() => setCluesSeen(true)}>
            🔎 مشاهده ادعاها (سرنخ‌ها)
          </button>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-sm font-bold text-[var(--color-text)]">کدام ادعا از نظر علمی نادرست است؟</p>
            {shuffledStatements.map((s) => {
              const isSelected = s.id === selectedId;
              const showAsWrongChoice = revealed && isSelected && s.isCorrect;
              const showAsFoundError = revealed && s.id === current.statements.find((st) => !st.isCorrect)?.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={revealed}
                  onClick={() => submit(s.id)}
                  className={cn(
                    "bm-focus rounded-lg border px-3 py-2.5 text-right text-sm leading-6 transition-colors",
                    showAsFoundError
                      ? "bm-correct-ring border-[var(--color-success)] bg-[var(--color-success)]/10"
                      : showAsWrongChoice
                        ? "bm-incorrect-ring border-[var(--color-danger)] bg-[var(--color-danger)]/10"
                        : isSelected
                          ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10"
                          : "border-[var(--color-border)] hover:border-[var(--color-teal)]"
                  )}
                >
                  {s.text}
                  {showAsFoundError && " ❌ (ادعای نادرست)"}
                  {showAsWrongChoice && " — این ادعا درست بود"}
                </button>
              );
            })}
          </div>
        )}

        {revealed && (
          <div className="mt-4 space-y-3">
            <Callout
              tone={current.statements.find((s) => s.id === selectedId)?.isCorrect === false ? "success" : "warning"}
              title={
                current.statements.find((s) => s.id === selectedId)?.isCorrect === false
                  ? "آفرین، درست تشخیص دادی! ✓"
                  : "این ادعا درست بود — ادعای نادرست جای دیگری است"
              }
            >
              {current.explanation}
            </Callout>
            <button type="button" className="bm-btn bm-btn-primary bm-focus w-full" onClick={next}>
              {index + 1 >= order.length ? "مشاهده گزارش نهایی ←" : "پرونده بعدی ←"}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
