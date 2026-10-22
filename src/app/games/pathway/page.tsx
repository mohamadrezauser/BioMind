"use client";

import { useMemo, useState } from "react";
import { MAIN_PATHWAY_ORDER, ORGAN_MAP } from "@/content/organs";
import { Card, SectionHeading, Callout } from "@/components/ui/Primitives";
import { useAppState } from "@/hooks/useAppState";
import { cn, toPersianDigits } from "@/utils/cn";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function PathwayGamePage() {
  const { unlockAchievement, addGameResult } = useAppState();
  const [pool, setPool] = useState<string[]>(() => shuffle(MAIN_PATHWAY_ORDER));
  const [answer, setAnswer] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [rounds, setRounds] = useState(0);

  const correctCount = useMemo(
    () => answer.filter((id, i) => id === MAIN_PATHWAY_ORDER[i]).length,
    [answer]
  );

  function pick(id: string) {
    if (checked) return;
    setAnswer((prev) => [...prev, id]);
    setPool((prev) => prev.filter((p) => p !== id));
  }

  function removeLast() {
    if (checked || answer.length === 0) return;
    const last = answer[answer.length - 1];
    setAnswer((prev) => prev.slice(0, -1));
    setPool((prev) => [...prev, last]);
  }

  function check() {
    setChecked(true);
    const score = answer.filter((id, i) => id === MAIN_PATHWAY_ORDER[i]).length;
    addGameResult({ gameId: "pathway", score, total: MAIN_PATHWAY_ORDER.length, completedAt: new Date().toISOString() });
    setRounds((r) => r + 1);
    if (score === MAIN_PATHWAY_ORDER.length) {
      unlockAchievement("pathway_perfect", "استاد مسیر گوارش", "چیدن کامل و درست مسیر دستگاه گوارش");
    }
  }

  function restart() {
    setPool(shuffle(MAIN_PATHWAY_ORDER));
    setAnswer([]);
    setChecked(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="بازی آموزشی"
        title="ساخت مسیر گوارش"
        description="روی اندام‌ها به ترتیبی که فکر می‌کنی مسیر صحیح غذا است، ضربه بزن (تپ کن). اگر اشتباه کردی می‌توانی آخرین مورد را حذف کنی."
      />

      <Card>
        <p className="text-sm font-bold text-[var(--color-text)]">مسیر ساخته‌شده تو:</p>
        <div className="mt-2 flex min-h-[64px] flex-wrap gap-2 rounded-xl border border-dashed border-[var(--color-border)] p-3">
          {answer.length === 0 && <span className="text-xs text-[var(--color-text-muted)]">هنوز چیزی انتخاب نکرده‌ای...</span>}
          {answer.map((id, i) => (
            <span
              key={id}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-bold",
                checked
                  ? id === MAIN_PATHWAY_ORDER[i]
                    ? "border-[var(--color-success)] bg-[var(--color-success)]/10"
                    : "border-[var(--color-danger)] bg-[var(--color-danger)]/10"
                  : "border-[var(--color-teal)] bg-[var(--color-teal)]/10"
              )}
            >
              {i + 1}. {ORGAN_MAP[id].name}
            </span>
          ))}
        </div>

        <p className="mt-4 text-sm font-bold text-[var(--color-text)]">اندام‌های باقیمانده:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {pool.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => pick(id)}
              className="bm-focus rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-bold hover:border-[var(--color-teal)]"
            >
              {ORGAN_MAP[id].name}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="bm-btn bm-btn-secondary bm-focus text-sm" onClick={removeLast} disabled={checked || answer.length === 0}>
            حذف آخرین مورد
          </button>
          <button
            type="button"
            className="bm-btn bm-btn-primary bm-focus text-sm"
            onClick={check}
            disabled={checked || answer.length !== MAIN_PATHWAY_ORDER.length}
          >
            بررسی پاسخ
          </button>
          <button type="button" className="bm-btn bm-btn-secondary bm-focus text-sm" onClick={restart}>
            ↻ شروع دوباره
          </button>
        </div>

        {checked && (
          <div className="mt-4">
            <Callout tone={correctCount === MAIN_PATHWAY_ORDER.length ? "success" : "warning"} title={`امتیاز: ${toPersianDigits(correctCount)} از ${toPersianDigits(MAIN_PATHWAY_ORDER.length)}`}>
              {correctCount === MAIN_PATHWAY_ORDER.length
                ? "آفرین! مسیر کاملاً درست است: دهان ← حلق ← مری ← معده ← روده باریک ← روده بزرگ ← راست‌روده ← مقعد."
                : "ترتیب درست مسیر اصلی: دهان ← حلق ← مری ← معده ← روده باریک ← روده بزرگ ← راست‌روده ← مقعد. دوباره تلاش کن!"}
            </Callout>
          </div>
        )}
        {rounds > 0 && <p className="mt-2 text-xs text-[var(--color-text-muted)]">تعداد تلاش‌ها: {toPersianDigits(rounds)}</p>}
      </Card>
    </div>
  );
}
