"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MEMORY_DECKS, type MemoryDeck, type MemoryPair } from "@/content/memoryLab";
import { Card, SectionHeading, Callout, Chip, FilterPill } from "@/components/ui/Primitives";
import { useAppState } from "@/hooks/useAppState";
import { cn, toPersianDigits } from "@/utils/cn";
import { computeMemoryLabScore, isPerfectMemoryLabRun } from "@/learning/gameScoring";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type BoardCard = {
  cardId: string;
  pairId: string;
  label: string;
  kind: "term" | "definition";
};

const SIZE_OPTIONS = [
  { id: "small", label: "کوچک (۴ جفت)", pairs: 4 },
  { id: "medium", label: "متوسط (۶ جفت)", pairs: 6 },
  { id: "large", label: "کامل (همه جفت‌ها)", pairs: 99 },
] as const;

function buildBoard(deck: MemoryDeck, pairCount: number): BoardCard[] {
  const chosen = shuffle(deck.pairs).slice(0, Math.min(pairCount, deck.pairs.length));
  const cards: BoardCard[] = [];
  for (const pair of chosen as MemoryPair[]) {
    cards.push({ cardId: `${pair.id}_term`, pairId: pair.id, label: pair.term, kind: "term" });
    cards.push({ cardId: `${pair.id}_def`, pairId: pair.id, label: pair.definition, kind: "definition" });
  }
  return shuffle(cards);
}

export default function MemoryLabPage() {
  const { addGameResult, unlockAchievement } = useAppState();
  const [deckId, setDeckId] = useState(MEMORY_DECKS[0].id);
  const [sizeId, setSizeId] = useState<(typeof SIZE_OPTIONS)[number]["id"]>("small");
  const deck = useMemo(() => MEMORY_DECKS.find((d) => d.id === deckId)!, [deckId]);
  const pairCount = SIZE_OPTIONS.find((s) => s.id === sizeId)!.pairs;

  const [board, setBoard] = useState<BoardCard[]>(() => buildBoard(deck, pairCount));
  const totalPairs = board.length / 2;
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintReveal, setHintReveal] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  function resetGame(nextDeck = deck, nextPairCount = pairCount) {
    setBoard(buildBoard(nextDeck, nextPairCount));
    setFlipped([]);
    setMatched(new Set());
    setWrongPair([]);
    setMoves(0);
    setHintsUsed(0);
    setHintReveal(false);
    setElapsed(0);
    setFinished(false);
    startedRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
  }

  useEffect(() => {
    resetGame(deck, pairCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId, sizeId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startTimerIfNeeded() {
    if (startedRef.current) return;
    startedRef.current = true;
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  }

  function finishGame(finalMoves: number) {
    setFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const { score } = computeMemoryLabScore(finalMoves, totalPairs);
    addGameResult({ gameId: "memory_match", score, total: totalPairs, completedAt: new Date().toISOString() });
    if (isPerfectMemoryLabRun(finalMoves, totalPairs)) {
      unlockAchievement("memory_champion", "قهرمان حافظه زیستی", "پیدا کردن همه جفت‌ها با کمترین اشتباه");
    }
  }

  function flipCard(card: BoardCard) {
    if (finished || flipped.includes(card.cardId) || matched.has(card.pairId) || flipped.length === 2) return;
    startTimerIfNeeded();
    const nextFlipped = [...flipped, card.cardId];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      const [firstId, secondId] = nextFlipped;
      const first = board.find((c) => c.cardId === firstId)!;
      const second = board.find((c) => c.cardId === secondId)!;
      const nextMoves = moves + 1;
      setMoves(nextMoves);

      if (first.pairId === second.pairId) {
        setTimeout(() => {
          setMatched((prev) => {
            const next = new Set(prev);
            next.add(first.pairId);
            if (next.size === totalPairs) finishGame(nextMoves);
            return next;
          });
          setFlipped([]);
        }, 450);
      } else {
        setWrongPair(nextFlipped);
        setTimeout(() => {
          setFlipped([]);
          setWrongPair([]);
        }, 750);
      }
    }
  }

  function useHint() {
    if (finished || hintsUsed >= 2 || hintReveal) return;
    setHintsUsed((h) => h + 1);
    setHintReveal(true);
    setTimeout(() => setHintReveal(false), 1200);
  }

  const matchedCount = matched.size;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="بازی آموزشی"
        title="آزمایشگاه حافظه زیستی"
        description="کارت‌ها را برگردان و هر واژه را به تعریف درستش وصل کن. هدف، پیدا کردن همه جفت‌ها با کمترین تعداد حرکت است."
      />

      <Card className="mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[var(--color-text-muted)]">موضوع:</span>
          {MEMORY_DECKS.map((d) => (
            <FilterPill key={d.id} active={d.id === deckId} onClick={() => setDeckId(d.id)}>
              {d.title}
            </FilterPill>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[var(--color-text-muted)]">اندازه تخته:</span>
          {SIZE_OPTIONS.map((s) => (
            <FilterPill key={s.id} active={s.id === sizeId} onClick={() => setSizeId(s.id)}>
              {s.label}
            </FilterPill>
          ))}
        </div>
      </Card>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Chip>حرکت‌ها: {toPersianDigits(moves)}</Chip>
        <Chip>زمان: {toPersianDigits(elapsed)} ثانیه</Chip>
        <Chip>جفت‌های پیداشده: {toPersianDigits(matchedCount)} از {toPersianDigits(totalPairs)}</Chip>
        <button
          type="button"
          className="bm-btn bm-btn-secondary bm-focus text-xs"
          onClick={useHint}
          disabled={finished || hintsUsed >= 2}
        >
          💡 راهنمایی ({toPersianDigits(2 - hintsUsed)} باقیمانده)
        </button>
        <button type="button" className="bm-btn bm-btn-secondary bm-focus text-xs" onClick={() => resetGame()}>
          ↻ شروع دوباره
        </button>
      </div>

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${board.length <= 8 ? 4 : board.length <= 12 ? 4 : board.length <= 16 ? 4 : 5}, minmax(0, 1fr))` }}
        role="group"
        aria-label="تخته بازی حافظه"
      >
        {board.map((card) => {
          const isMatched = matched.has(card.pairId);
          const isFlipped = flipped.includes(card.cardId) || isMatched || hintReveal;
          const isWrong = wrongPair.includes(card.cardId);
          return (
            <div key={card.cardId} className="bm-flip-scene aspect-square min-h-[88px]">
              <button
                type="button"
                className={cn("bm-flip-card h-full w-full", isFlipped && "is-flipped")}
                onClick={() => flipCard(card)}
                disabled={isMatched || finished}
                aria-pressed={isFlipped}
                aria-label={isFlipped ? card.label : "کارت رو به پایین؛ برای دیدن محتوا کلیک کن"}
              >
                <span
                  className={cn(
                    "bm-flip-face border-2 border-[var(--color-teal)]/40 bg-[var(--color-surface-muted)] text-2xl"
                  )}
                  aria-hidden="true"
                >
                  🧬
                </span>
                <span
                  className={cn(
                    "bm-flip-face bm-flip-back border-2 p-2 text-[11px] font-bold leading-5",
                    isMatched
                      ? "border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-success)]"
                      : isWrong
                        ? "border-[var(--color-danger)] bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                        : card.kind === "term"
                          ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10 text-[var(--color-text)]"
                          : "border-[var(--color-purple)] bg-[var(--color-purple)]/10 text-[var(--color-text)]"
                  )}
                >
                  {card.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {finished && (
        <div className="mt-6">
          <Callout tone="success" title="تمام جفت‌ها پیدا شدند! 🎉">
            با {toPersianDigits(moves)} حرکت در {toPersianDigits(elapsed)} ثانیه، همه {toPersianDigits(totalPairs)} جفت را
            پیدا کردی. {moves === totalPairs ? "عالی بود؛ بدون هیچ اشتباهی!" : "با تمرین بیشتر می‌توانی تعداد حرکت‌ها را کم‌تر کنی."}
          </Callout>
        </div>
      )}
    </div>
  );
}
