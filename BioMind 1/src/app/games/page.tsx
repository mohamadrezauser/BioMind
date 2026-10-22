"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, SectionHeading, DifficultyBadge, Chip, FilterPill, IconTile } from "@/components/ui/Primitives";
import { GAMES_CATALOG, type GameCatalogEntry } from "@/content/gamesCatalog";
import { useAppState } from "@/hooks/useAppState";
import { toPersianDigits } from "@/utils/cn";

type FilterKey = "all" | "new" | "quick" | "played" | "sequence" | "match" | "deduction";

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "همه بازی‌ها" },
  { key: "new", label: "تازه اضافه‌شده" },
  { key: "quick", label: "فعالیت کوتاه (زیر ۵ دقیقه)" },
  { key: "played", label: "بازی‌شده قبلی" },
  { key: "match", label: "جور کردن" },
  { key: "sequence", label: "توالی و ترتیب" },
  { key: "deduction", label: "استدلال و تشخیص" },
];

export default function GamesHubPage() {
  const { state } = useAppState();
  const [filter, setFilter] = useState<FilterKey>("all");

  const bestScores = useMemo(() => {
    const map: Record<string, { score: number; total: number }> = {};
    for (const result of state.gameResults) {
      const prev = map[result.gameId];
      if (!prev || result.score / result.total > prev.score / prev.total) {
        map[result.gameId] = { score: result.score, total: result.total };
      }
    }
    return map;
  }, [state.gameResults]);

  const playedGameIds = useMemo(() => new Set(state.gameResults.map((r) => r.gameId)), [state.gameResults]);

  const filtered = GAMES_CATALOG.filter((g) => {
    switch (filter) {
      case "all":
        return true;
      case "new":
        return Boolean(g.isNew);
      case "quick":
        return g.estimatedMinutes <= 5;
      case "played":
        return g.resultId ? playedGameIds.has(g.resultId) : false;
      default:
        return g.category === filter;
    }
  });

  const featured = GAMES_CATALOG.find((g) => g.isNew) ?? GAMES_CATALOG[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="یادگیری با بازی"
        title="مرکز بازی‌های BioMind"
        description="هر بازی مفهومی مشخص از فصل گوارش و جذب را با قواعد روشن تمرین می‌کند. امتیازها فقط برای دنبال‌کردن پیشرفت شخصی تو هستند، نه رقابت با دیگران."
      />

      {/* Featured game spotlight */}
      <Link href={featured.href} className="bm-focus mb-8 block">
        <div className={`bm-hero-pattern bm-card-hover overflow-hidden rounded-3xl p-6 text-white shadow-lg sm:p-8 ${featured.gradientClass}`}>
          <span className="bm-tag border-white/30 bg-white/15 text-white">✨ بازی ویژه</span>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <span className="text-5xl" aria-hidden="true">
              {featured.icon}
            </span>
            <div>
              <h3 className="text-xl font-extrabold sm:text-2xl">{featured.title}</h3>
              <p className="mt-1 max-w-xl text-sm leading-7 text-white/90">{featured.description}</p>
            </div>
          </div>
          <span className="mt-4 inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-bold">شروع بازی ←</span>
        </div>
      </Link>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="فیلتر بازی‌ها">
        {FILTERS.map((f) => (
          <FilterPill key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </FilterPill>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-center text-sm text-[var(--color-text-muted)]">بازی‌ای با این فیلتر پیدا نشد.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              best={game.resultId ? bestScores[game.resultId] : undefined}
              played={game.resultId ? playedGameIds.has(game.resultId) : false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GameCard({
  game,
  best,
  played,
}: {
  game: GameCatalogEntry;
  best?: { score: number; total: number };
  played: boolean;
}) {
  return (
    <Link href={game.href} className="bm-focus block h-full">
      <Card className="bm-card-hover flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          <IconTile icon={game.icon} size="lg" tone="purple" />
          {game.isNew && <span className="bm-chip bm-chip-purple">جدید</span>}
        </div>
        <h3 className="mt-3 text-lg font-extrabold text-[var(--color-text)]">{game.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-7 text-[var(--color-text-muted)]">{game.description}</p>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">🎯 هدف: {game.objective}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <DifficultyBadge level={game.difficulty} />
          <Chip>⏱️ حدود {toPersianDigits(game.estimatedMinutes)} دقیقه</Chip>
          <Chip tone="purple">{game.topic}</Chip>
        </div>

        {played && best && (
          <p className="mt-3 text-xs font-bold text-[var(--color-teal-deep)]">
            بهترین نتیجه قبلی تو: {toPersianDigits(best.score)} از {toPersianDigits(best.total)}
          </p>
        )}

        <span className="mt-4 inline-block text-sm font-bold text-[var(--color-teal-deep)]">
          {played ? "بازی دوباره ←" : "شروع بازی ←"}
        </span>
      </Card>
    </Link>
  );
}
