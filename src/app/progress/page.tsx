"use client";

import { useMemo, useState } from "react";
import { useAppState } from "@/hooks/useAppState";
import { Card, SectionHeading, ProgressBar, MasteryBadge, EmptyState, Callout, AchievementBadgeCard } from "@/components/ui/Primitives";
import { CONCEPT_ORDER, CONCEPT_MAP } from "@/content/concepts";
import { MISCONCEPTION_MAP } from "@/content/misconceptions";
import { levelFromScore, overallProgress } from "@/learning/mastery";
import { toPersianDigits, formatPersianDate } from "@/utils/cn";
import { ACHIEVEMENT_CATALOG } from "@/learning/achievements";

export default function ProgressPage() {
  const { state, resetAll } = useAppState();
  const [confirmReset, setConfirmReset] = useState(false);
  const progress = overallProgress(state.mastery);

  const attemptsByDay = useMemo(() => {
    const map: Record<string, { correct: number; total: number }> = {};
    for (const a of state.attempts) {
      const day = a.timestamp.slice(0, 10);
      const entry = (map[day] ??= { correct: 0, total: 0 });
      entry.total += 1;
      if (a.correct) entry.correct += 1;
    }
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-10);
  }, [state.attempts]);

  const maxDayTotal = Math.max(1, ...attemptsByDay.map(([, v]) => v.total));

  const detectedMisconceptions = Object.entries(state.misconceptionLog);

  const totalAttempts = state.attempts.length;
  const correctAttempts = state.attempts.filter((a) => a.correct).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="گزارش یادگیری"
        title="پیشرفت من"
        description="تمام داده‌های این صفحه واقعی و بر اساس فعالیت‌های انجام‌شده توی همین مرورگر است؛ هیچ داده نمایشی ساختگی در این بخش نشان داده نمی‌شود."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <p className="text-sm text-[var(--color-text-muted)]">پیشرفت کلی</p>
          <p className="mt-1 text-4xl font-extrabold text-[var(--color-teal-deep)]">{toPersianDigits(progress)}٪</p>
          <div className="mt-3">
            <ProgressBar value={progress} showValue={false} />
          </div>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-text-muted)]">مجموع تلاش‌ها</p>
          <p className="mt-1 text-4xl font-extrabold text-[var(--color-text)]">{toPersianDigits(totalAttempts)}</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {totalAttempts > 0
              ? `${toPersianDigits(Math.round((correctAttempts / totalAttempts) * 100))}٪ پاسخ درست`
              : "هنوز فعالیتی ثبت نشده"}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-text-muted)]">دستاوردها</p>
          <p className="mt-1 text-4xl font-extrabold text-[var(--color-accent)]">{toPersianDigits(state.achievements.length)}</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">نشان‌های کسب‌شده از بازی‌ها و فعالیت‌ها</p>
        </Card>
      </div>

      <div className="mt-8">
        <SectionHeading
          eyebrow="دستاوردها"
          title="مجموعه نشان‌های BioMind"
          description="هر نشان، بازتاب یک فعالیت واقعی است که انجام داده‌ای؛ نشان‌های قفل هنوز کسب نشده‌اند."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENT_CATALOG.map((def) => {
            const unlocked = state.achievements.find((a) => a.id === def.id);
            return (
              <AchievementBadgeCard
                key={def.id}
                icon={def.icon}
                title={def.title}
                description={unlocked ? def.description : def.hint}
                unlocked={Boolean(unlocked)}
                unlockedAt={unlocked?.unlockedAt ? formatPersianDate(unlocked.unlockedAt) : undefined}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <SectionHeading eyebrow="تسلط مفهومی" title="تسلط به‌تفکیک مفهوم" />
        <div className="grid gap-3 sm:grid-cols-2">
          {CONCEPT_ORDER.map((id) => {
            const m = state.mastery[id];
            const level = levelFromScore(m?.score ?? 0, m?.evidenceCount ?? 0);
            return (
              <Card key={id}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[var(--color-text)]">{CONCEPT_MAP[id].title}</p>
                  <MasteryBadge level={level} />
                </div>
                <div className="mt-2">
                  <ProgressBar value={m?.score ?? 0} />
                </div>
                <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
                  شواهد: {toPersianDigits(m?.evidenceCount ?? 0)} • اطمینان تشخیص: {toPersianDigits(Math.round((m?.confidence ?? 0) * 100))}٪
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <SectionHeading eyebrow="روند زمانی" title="عملکرد آزمون در طول زمان" />
        {attemptsByDay.length === 0 ? (
          <EmptyState icon="📈" title="هنوز داده‌ای نیست" description="بعد از پاسخ‌دادن به چند سؤال، نمودار روند اینجا نمایش داده می‌شود." />
        ) : (
          <Card>
            <div className="flex items-end gap-3 overflow-x-auto pb-2" role="img" aria-label="نمودار عملکرد روزانه">
              {attemptsByDay.map(([day, v]) => {
                const pct = Math.round((v.correct / v.total) * 100);
                const height = Math.max(8, (v.total / maxDayTotal) * 100);
                return (
                  <div key={day} className="flex min-w-[46px] flex-col items-center gap-1">
                    <div className="flex h-28 w-8 items-end rounded-md bg-[var(--color-surface-muted)]">
                      <div
                        className="w-full rounded-md bg-[var(--color-teal)]"
                        style={{ height: `${height}%` }}
                        title={`${pct}٪ درست از ${v.total} تلاش`}
                      />
                    </div>
                    <span className="text-[10px] text-[var(--color-text-muted)]">{day.slice(5)}</span>
                    <span className="text-[10px] font-bold text-[var(--color-teal-deep)]">{toPersianDigits(pct)}٪</span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      <div className="mt-8">
        <SectionHeading eyebrow="تشخیص برداشت‌های نادرست" title="برداشت‌های نادرست شناسایی‌شده" />
        {detectedMisconceptions.length === 0 ? (
          <EmptyState icon="✅" title="برداشت نادرستی شناسایی نشده" description="با ادامه تمرین و پاسخ به سؤالات بیشتر، این بخش به‌روزرسانی می‌شود." />
        ) : (
          <div className="space-y-3">
            {detectedMisconceptions.map(([id, log]) => {
              const mis = MISCONCEPTION_MAP[id];
              if (!mis) return null;
              const resolved = log.resolvedCount > 0;
              return (
                <Card key={id} className={resolved ? "border-[var(--color-success)]/40" : "border-[var(--color-warning)]/40"}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-[var(--color-text)]">{mis.title}</p>
                    <span className={`bm-tag ${resolved ? "text-[var(--color-success)]" : "text-[var(--color-warning)]"}`}>
                      {resolved ? "بهبود یافته ✓" : "نیاز به تمرین بیشتر"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    مشاهده‌شده: {toPersianDigits(log.detectedCount)} بار • آخرین مشاهده: {formatPersianDate(log.lastSeenAt)}
                  </p>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {(state.pretest || state.posttest) && (
        <div className="mt-8">
          <SectionHeading eyebrow="سنجش قبل و بعد" title="مقایسه پیش‌آزمون و پس‌آزمون" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <p className="text-sm font-bold text-[var(--color-text)]">پیش‌آزمون</p>
              {state.pretest ? (
                <>
                  <p className="mt-1 text-3xl font-extrabold text-[var(--color-text)]">{toPersianDigits(state.pretest.overallScore)}٪</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{formatPersianDate(state.pretest.completedAt)}</p>
                </>
              ) : (
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">هنوز انجام نشده</p>
              )}
            </Card>
            <Card>
              <p className="text-sm font-bold text-[var(--color-text)]">پس‌آزمون</p>
              {state.posttest ? (
                <>
                  <p className="mt-1 text-3xl font-extrabold text-[var(--color-teal-deep)]">{toPersianDigits(state.posttest.overallScore)}٪</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{formatPersianDate(state.posttest.completedAt)}</p>
                </>
              ) : (
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">هنوز انجام نشده</p>
              )}
            </Card>
          </div>
          {state.pretest && state.posttest && (
            <div className="mt-3">
              <Callout tone="info" title="یادآوری علمی">
                این مقایسه فقط برای یک دانش‌آموز است و نمی‌تواند اثربخشی آموزشی برنامه را به‌طور کلی اثبات کند؛ صرفاً
                روند پیشرفت شخصی تو را نشان می‌دهد.
              </Callout>
            </div>
          )}
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 p-5">
        <p className="font-bold text-[var(--color-text)]">بازنشانی داده‌ها</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          تمام پیشرفت، پاسخ‌ها و دستاوردهای ذخیره‌شده روی این مرورگر پاک می‌شود. این کار قابل بازگشت نیست.
        </p>
        {!confirmReset ? (
          <button type="button" className="bm-btn bm-btn-secondary bm-focus mt-3 text-sm" onClick={() => setConfirmReset(true)}>
            پاک‌کردن همه پیشرفت‌ها
          </button>
        ) : (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="bm-btn bm-focus bg-[var(--color-danger)] text-sm text-white"
              onClick={() => {
                resetAll();
                setConfirmReset(false);
              }}
            >
              بله، همه چیز پاک شود
            </button>
            <button type="button" className="bm-btn bm-btn-secondary bm-focus text-sm" onClick={() => setConfirmReset(false)}>
              انصراف
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
