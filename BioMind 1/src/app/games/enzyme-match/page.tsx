"use client";

import { useMemo, useState } from "react";
import { ENZYME_PAIRS } from "@/content/enzymeMatch";
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

export default function EnzymeMatchGamePage() {
  const { unlockAchievement, addGameResult } = useAppState();
  const [shuffledSubstrates, setShuffledSubstrates] = useState(() => shuffle(ENZYME_PAIRS));
  const [selectedEnzyme, setSelectedEnzyme] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [finished, setFinished] = useState(false);

  const score = useMemo(() => Object.entries(matches).filter(([e, s]) => e === s).length, [matches]);

  function trySubstrate(substrateOwnerId: string) {
    if (!selectedEnzyme || finished) return;
    setAttempts((a) => a + 1);
    if (selectedEnzyme === substrateOwnerId) {
      const next = { ...matches, [selectedEnzyme]: substrateOwnerId };
      setMatches(next);
      setSelectedEnzyme(null);
      if (Object.keys(next).length === ENZYME_PAIRS.length) {
        setFinished(true);
        const finalScore = Object.entries(next).filter(([e, s]) => e === s).length;
        addGameResult({ gameId: "enzyme_match", score: finalScore, total: ENZYME_PAIRS.length, completedAt: new Date().toISOString() });
        unlockAchievement("enzyme_master", "متخصص آنزیم‌ها", "جور کردن درست همه آنزیم‌ها با بستر آن‌ها");
      }
    } else {
      setWrongFlash(substrateOwnerId);
      setTimeout(() => setWrongFlash(null), 500);
    }
  }

  function restart() {
    setShuffledSubstrates(shuffle(ENZYME_PAIRS));
    setSelectedEnzyme(null);
    setMatches({});
    setAttempts(0);
    setFinished(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="بازی آموزشی"
        title="جور کردن آنزیم‌ها"
        description="ابتدا یک آنزیم را از ستون راست انتخاب کن، سپس بستر (ماده‌ای) که آن آنزیم روی آن اثر می‌گذارد را از ستون چپ انتخاب کن."
      />

      <Card>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-bold text-[var(--color-text)]">آنزیم‌ها</p>
            <div className="flex flex-col gap-2">
              {ENZYME_PAIRS.map((p) => {
                const isMatched = Boolean(matches[p.id]);
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={isMatched}
                    onClick={() => setSelectedEnzyme(p.id)}
                    className={cn(
                      "bm-focus rounded-lg border px-3 py-2.5 text-right text-sm font-bold",
                      isMatched
                        ? "border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-text-muted)]"
                        : selectedEnzyme === p.id
                          ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10"
                          : "border-[var(--color-border)] hover:border-[var(--color-teal)]"
                    )}
                  >
                    {p.enzyme} {isMatched && "✓"}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-bold text-[var(--color-text)]">بسترها (مواد هدف)</p>
            <div className="flex flex-col gap-2">
              {shuffledSubstrates.map((p) => {
                const isUsed = Object.values(matches).includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={isUsed || !selectedEnzyme}
                    onClick={() => trySubstrate(p.id)}
                    className={cn(
                      "bm-focus rounded-lg border px-3 py-2.5 text-right text-sm",
                      isUsed
                        ? "border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-text-muted)]"
                        : wrongFlash === p.id
                          ? "border-[var(--color-danger)] bg-[var(--color-danger)]/10"
                          : "border-[var(--color-border)] hover:border-[var(--color-teal)]"
                    )}
                  >
                    {p.substrate} {isUsed && "✓"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="bm-tag">تلاش‌ها: {toPersianDigits(attempts)}</span>
          <span className="bm-tag">جورشده: {toPersianDigits(score)} از {toPersianDigits(ENZYME_PAIRS.length)}</span>
          <button type="button" className="bm-btn bm-btn-secondary bm-focus text-sm" onClick={restart}>
            ↻ شروع دوباره
          </button>
        </div>

        {finished && (
          <div className="mt-4 space-y-2">
            <Callout tone="success" title="تمام جفت‌ها جور شدند! 🎉">
              مرور سریع: آمیلاز روی نشاسته، پپسین و تریپسین روی پروتئین، و لیپاز روی چربی اثر می‌کنند — هر آنزیم فقط
              بستر اختصاصی خودش را می‌شناسد.
            </Callout>
            {ENZYME_PAIRS.map((p) => (
              <p key={p.id} className="text-xs text-[var(--color-text-muted)]">
                <strong className="text-[var(--color-text)]">{p.enzyme}</strong> ({p.location}): {p.substrate} ←
                {" "}
                {p.product}
              </p>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
