"use client";

import { useMemo, useState } from "react";
import { NUTRIENT_CASES } from "@/content/nutrients";
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

export default function NutrientDestinationGamePage() {
  const { unlockAchievement, addGameResult } = useAppState();
  const [order, setOrder] = useState(() => shuffle(NUTRIENT_CASES));
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [lastChoice, setLastChoice] = useState<"blood_capillary" | "lymph" | null>(null);
  const [revealed, setRevealed] = useState(false);
  const finished = current >= order.length;
  const activeCase = order[current];

  const score = useMemo(() => Object.values(results).filter(Boolean).length, [results]);

  function choose(route: "blood_capillary" | "lymph") {
    if (revealed) return;
    setLastChoice(route);
    setRevealed(true);
    const correct = route === activeCase.route;
    setResults((prev) => ({ ...prev, [activeCase.id]: correct }));
  }

  function next() {
    if (current + 1 >= order.length) {
      const finalScore = Object.values({ ...results }).filter(Boolean).length;
      addGameResult({ gameId: "nutrient_destination", score: finalScore, total: order.length, completedAt: new Date().toISOString() });
      if (finalScore === order.length) {
        unlockAchievement("nutrient_navigator", "راهبلد مواد مغذی", "تشخیص درست مسیر همه مواد مغذی");
      }
    }
    setCurrent((c) => c + 1);
    setRevealed(false);
    setLastChoice(null);
  }

  function restart() {
    setOrder(shuffle(NUTRIENT_CASES));
    setCurrent(0);
    setResults({});
    setRevealed(false);
    setLastChoice(null);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="بازی آموزشی"
        title="مقصد مواد مغذی"
        description="برای هر ماده مغذی، مشخص کن مسیر انتقال اولیه آن از سلول‌های پرز روده به کدام سو است: مویرگ خونی یا مویرگ لنفی."
      />

      <Card>
        {!finished ? (
          <>
            <p className="text-xs text-[var(--color-text-muted)]">
              ماده {toPersianDigits(current + 1)} از {toPersianDigits(order.length)}
            </p>
            <p className="mt-1 text-lg font-extrabold text-[var(--color-text)]">{activeCase.nutrient}</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{activeCase.source}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => choose("blood_capillary")}
                disabled={revealed}
                className={cn(
                  "bm-focus rounded-xl border-2 p-4 text-center font-bold",
                  revealed && activeCase.route === "blood_capillary"
                    ? "border-[var(--color-success)] bg-[var(--color-success)]/10"
                    : revealed && lastChoice === "blood_capillary"
                      ? "border-[var(--color-danger)] bg-[var(--color-danger)]/10"
                      : "border-[var(--color-border)] hover:border-[var(--color-teal)]"
                )}
              >
                🩸 مویرگ خونی
              </button>
              <button
                type="button"
                onClick={() => choose("lymph")}
                disabled={revealed}
                className={cn(
                  "bm-focus rounded-xl border-2 p-4 text-center font-bold",
                  revealed && activeCase.route === "lymph"
                    ? "border-[var(--color-success)] bg-[var(--color-success)]/10"
                    : revealed && lastChoice === "lymph"
                      ? "border-[var(--color-danger)] bg-[var(--color-danger)]/10"
                      : "border-[var(--color-border)] hover:border-[var(--color-teal)]"
                )}
              >
                🟡 مویرگ لنفی (لاکتیل)
              </button>
            </div>

            {revealed && (
              <div className="mt-4 space-y-3">
                <Callout tone={lastChoice === activeCase.route ? "success" : "warning"} title={lastChoice === activeCase.route ? "درست بود!" : "نه دقیقاً..."}>
                  {activeCase.explanation}
                </Callout>
                <button type="button" className="bm-btn bm-btn-primary bm-focus text-sm" onClick={next}>
                  بعدی ←
                </button>
              </div>
            )}
          </>
        ) : (
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">نتیجه پایانی</p>
            <p className="text-3xl font-extrabold text-[var(--color-teal-deep)]">
              {toPersianDigits(score)} از {toPersianDigits(order.length)}
            </p>
            <Callout tone="info" title="جمع‌بندی">
              گلوکز و اسید آمینه محلول در آب‌اند و مستقیم وارد مویرگ خونی می‌شوند؛ محصولات هضم چربی عمدتاً ابتدا وارد
              مویرگ لنفی (لاکتیل) می‌شوند و بعداً به خون می‌پیوندند.
            </Callout>
            <button type="button" className="bm-btn bm-btn-secondary bm-focus mt-4 text-sm" onClick={restart}>
              ↻ شروع دوباره
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
