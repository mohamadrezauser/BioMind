"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAppState } from "@/hooks/useAppState";
import { OnboardingModal } from "@/components/OnboardingModal";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { Card, ProgressBar, MasteryBadge, SectionHeading, IconTile } from "@/components/ui/Primitives";
import { CONCEPT_MAP, CONCEPT_ORDER } from "@/content/concepts";
import { levelFromScore, overallProgress, weakestConcepts } from "@/learning/mastery";
import { selectTutorConcept } from "@/learning/tutorEngine";
import { QUIZ_BANK } from "@/content/quizBank";
import { checkAnswer } from "@/assessment/quizEngine";
import { toPersianDigits } from "@/utils/cn";
import { GAMES_CATALOG } from "@/content/gamesCatalog";
import { ACHIEVEMENT_CATALOG } from "@/learning/achievements";

const QUICK_LINKS = [
  { href: "/tutor", icon: "🤖", title: "معلم هوشمند", desc: "ادامه آموزش تطبیقی" },
  { href: "/lab/digestive-system", icon: "🧬", title: "آزمایشگاه گوارش", desc: "کاوش اندام‌ها" },
  { href: "/exams", icon: "🧮", title: "مرکز آزمون‌ها", desc: "آزمون قابل‌تنظیم" },
  { href: "/games", icon: "🎮", title: "بازی‌های آموزشی", desc: "یادگیری با بازی" },
  { href: "/progress", icon: "📊", title: "گزارش پیشرفت", desc: "مشاهده عملکرد" },
];

export default function HomePage() {
  const { state, recordAttempt } = useAppState();
  const progress = overallProgress(state.mastery);
  const weakIds = weakestConcepts(state.mastery, 3);
  const recommendedConceptId = useMemo(() => selectTutorConcept(state.mastery), [state.mastery]);
  const recommendedConcept = CONCEPT_MAP[recommendedConceptId];

  const dailyQuestion = useMemo(() => {
    const unseen = QUIZ_BANK.filter((q) => !state.seenQuestionIds.includes(q.id) && q.type === "mcq");
    const pool = unseen.length > 0 ? unseen : QUIZ_BANK.filter((q) => q.type === "mcq");
    const idx = new Date().getDate() % pool.length;
    return pool[idx];
  }, [state.seenQuestionIds]);

  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const hasAnyEvidence = Object.values(state.mastery).some((m) => m.evidenceCount > 0);

  const featuredGame = GAMES_CATALOG.find((g) => g.isNew) ?? GAMES_CATALOG[0];
  const recentAchievements = [...state.achievements]
    .sort((a, b) => (b.unlockedAt ?? "").localeCompare(a.unlockedAt ?? ""))
    .slice(0, 3);

  function submitDaily() {
    if (selected === null || answered) return;
    const correct = checkAnswer(dailyQuestion, { kind: "index", value: selected });
    recordAttempt({
      question: dailyQuestion,
      correct,
      usedHint: false,
      changedAnswer: false,
      mode: "quiz",
      misconceptionId: !correct ? dailyQuestion.misconceptionByOption?.[selected] : undefined,
    });
    setAnswered(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <OnboardingModal />

      {/* 1. Welcome and learning overview */}
      <section className="bm-gradient-hero bm-hero-pattern bm-fade-in overflow-hidden rounded-3xl p-6 text-white shadow-xl sm:p-10">
        <p className="bm-tag border-white/30 bg-white/10 text-white">آزمایشگاه هوشمند زیست‌شناسی دهم</p>
        <h1 className="mt-4 max-w-2xl text-2xl font-extrabold leading-relaxed sm:text-4xl">
          سلام {state.profile.displayName} 👋 بیا با هم «گوارش و جذب مواد» را عمیق یاد بگیریم.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
          BioMind با پاسخ‌های تو همراه می‌شود: نقاط ضعف را پیدا می‌کند، روش تدریس را تغییر می‌دهد و مسیر یادگیری را
          متناسب با تو می‌سازد — در آزمایشگاه تعاملی، شبیه‌سازها، بازی‌ها و معلم هوشمند.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/tutor" className="bm-btn bm-btn-primary bm-focus">
            🤖 {hasAnyEvidence ? "ادامه آموزش تطبیقی" : "شروع آموزش تطبیقی"}
          </Link>
          <Link href="/lab/digestive-system" className="bm-btn bm-focus bg-white/10 text-white hover:bg-white/20">
            🧬 ورود به آزمایشگاه گوارش
          </Link>
        </div>
        <div className="mt-8 max-w-sm">
          <ProgressBar value={progress} label="پیشرفت کلی یادگیری" />
        </div>
      </section>

      <div className="mt-5">
        <DemoModeBanner />
      </div>

      {/* 2 & 3. Continue learning + daily goal */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionHeading
            eyebrow="ادامه یادگیری"
            title="فعالیت بعدی پیشنهادی"
            description="بر اساس عملکرد تو در مفاهیم مختلف انتخاب شده است؛ هر وقت خواستی می‌توانی فعالیت دیگری را هم انتخاب کنی."
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">مفهوم پیشنهادی</p>
              <p className="mt-1 text-lg font-extrabold text-[var(--color-text)]">{recommendedConcept.title}</p>
              <p className="mt-2 max-w-lg text-sm leading-7 text-[var(--color-text-muted)]">
                {recommendedConcept.explanation.slice(0, 160)}…
              </p>
              <div className="mt-3">
                <MasteryBadge
                  level={levelFromScore(
                    state.mastery[recommendedConceptId]?.score ?? 0,
                    state.mastery[recommendedConceptId]?.evidenceCount ?? 0
                  )}
                />
              </div>
            </div>
            <Link href="/tutor" className="bm-btn bm-btn-primary bm-focus shrink-0">
              {hasAnyEvidence ? "ادامه یادگیری" : "شروع کن"} ←
            </Link>
          </div>
        </Card>

        <Card>
          <SectionHeading eyebrow="هر روز یک سؤال" title="چالش کوتاه امروز" />
          <p className="text-sm font-medium text-[var(--color-text)]">{dailyQuestion.prompt}</p>
          <div className="mt-3 flex flex-col gap-2">
            {dailyQuestion.options?.map((opt, idx) => {
              const isCorrect = idx === dailyQuestion.correctIndex;
              const isSelected = idx === selected;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={answered}
                  onClick={() => setSelected(idx)}
                  className={`bm-focus rounded-lg border px-3 py-2 text-right text-sm transition-colors ${
                    answered && isCorrect
                      ? "border-[var(--color-success)] bg-[var(--color-success)]/10"
                      : answered && isSelected && !isCorrect
                        ? "border-[var(--color-danger)] bg-[var(--color-danger)]/10"
                        : isSelected
                          ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10"
                          : "border-[var(--color-border)] hover:border-[var(--color-teal)]"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {!answered ? (
            <button
              type="button"
              className="bm-btn bm-btn-primary bm-focus mt-3 w-full text-sm"
              disabled={selected === null}
              onClick={submitDaily}
            >
              ثبت پاسخ
            </button>
          ) : (
            <p className="mt-3 rounded-lg bg-[var(--color-surface-muted)] p-3 text-xs leading-6 text-[var(--color-text-muted)]">
              {selected === dailyQuestion.correctIndex
                ? dailyQuestion.explanationCorrect
                : dailyQuestion.explanationIncorrect}
            </p>
          )}
        </Card>
      </div>

      {/* Weak topics to review */}
      {weakIds.length > 0 && (
        <div className="mt-8">
          <SectionHeading
            eyebrow="نیاز به مرور"
            title="موضوعاتی که بهتر است دوباره مرور کنی"
            description="این مفاهیم بر اساس پاسخ‌های واقعی تو، کمترین میزان تسلط را دارند."
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {weakIds.map((id) => {
              const m = state.mastery[id];
              const level = levelFromScore(m?.score ?? 0, m?.evidenceCount ?? 0);
              return (
                <Card key={id} className="border-[var(--color-danger)]/30">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[var(--color-text)]">{CONCEPT_MAP[id].shortTitle}</p>
                    <MasteryBadge level={level} />
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={m?.score ?? 0} showValue={false} />
                  </div>
                  <Link href="/tutor" className="mt-3 inline-block text-xs font-bold text-[var(--color-teal-deep)]">
                    مرور با معلم تطبیقی ←
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured game + achievements preview */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <Link href={featuredGame.href} className="bm-focus block lg:col-span-2">
          <div
            className={`bm-hero-pattern bm-card-hover flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 text-white shadow-lg ${featuredGame.gradientClass}`}
          >
            <div>
              <span className="bm-tag border-white/30 bg-white/15 text-white">🎮 بازی ویژه</span>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-4xl" aria-hidden="true">
                  {featuredGame.icon}
                </span>
                <h3 className="text-xl font-extrabold">{featuredGame.title}</h3>
              </div>
              <p className="mt-2 max-w-md text-sm leading-7 text-white/90">{featuredGame.description}</p>
            </div>
            <span className="mt-4 inline-block w-fit rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
              شروع بازی ←
            </span>
          </div>
        </Link>

        <Card>
          <SectionHeading
            eyebrow="دستاوردها"
            title="آخرین نشان‌ها"
            action={
              <Link href="/progress" className="text-xs font-bold text-[var(--color-teal-deep)]">
                همه ←
              </Link>
            }
          />
          {recentAchievements.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <IconTile icon="🏆" tone="gold" />
              <p className="text-xs text-[var(--color-text-muted)]">
                هنوز نشانی کسب نکرده‌ای. با انجام فعالیت‌ها، اولین نشان خودت را بگیر!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recentAchievements.map((a) => (
                <div key={a.id} className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-muted)] p-2">
                  <IconTile
                    icon={ACHIEVEMENT_CATALOG.find((c) => c.id === a.id)?.icon ?? "🏆"}
                    tone="gold"
                    size="sm"
                  />
                  <p className="text-xs font-bold text-[var(--color-text)]">{a.title}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="mt-8">
        <SectionHeading eyebrow="دسترسی سریع" title="بخش‌های اصلی برنامه" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bm-surface bm-focus bm-card-hover flex flex-col items-center gap-1 px-3 py-5 text-center"
            >
              <span aria-hidden="true" className="text-2xl">
                {link.icon}
              </span>
              <span className="text-sm font-bold text-[var(--color-text)]">{link.title}</span>
              <span className="text-[11px] text-[var(--color-text-muted)]">{link.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <SectionHeading
          eyebrow="تسلط مفهومی"
          title="نقشه تسلط به‌تفکیک مفهوم"
          description="به‌جای یک نمره کلی، میزان تسلط تو در هر مفهوم جداگانه دنبال می‌شود."
          action={
            <Link href="/progress" className="bm-btn bm-btn-secondary bm-focus text-sm">
              گزارش کامل ←
            </Link>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {CONCEPT_ORDER.map((id) => {
            const m = state.mastery[id];
            const level = levelFromScore(m?.score ?? 0, m?.evidenceCount ?? 0);
            const isWeak = weakIds.includes(id);
            return (
              <Card key={id} className={isWeak ? "border-[var(--color-danger)]/40" : undefined}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[var(--color-text)]">{CONCEPT_MAP[id].shortTitle}</p>
                  <MasteryBadge level={level} />
                </div>
                <div className="mt-3">
                  <ProgressBar value={m?.score ?? 0} showValue={false} />
                </div>
                <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
                  شواهد ثبت‌شده: {toPersianDigits(m?.evidenceCount ?? 0)}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
