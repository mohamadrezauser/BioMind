"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAppState } from "@/hooks/useAppState";
import { Card, SectionHeading, ProgressBar, MasteryBadge, Callout } from "@/components/ui/Primitives";
import { ExamQuestionRunner, type ExamAnswerOutcome } from "@/components/quiz/ExamQuestionRunner";
import { buildExamQuestions } from "@/assessment/quizEngine";
import { CONCEPT_ORDER, CONCEPT_MAP } from "@/content/concepts";
import { MISCONCEPTION_MAP } from "@/content/misconceptions";
import { levelFromScore } from "@/learning/mastery";
import type { QuizQuestion, DifficultyLevel } from "@/types";
import type { AnswerResponse } from "@/assessment/quizEngine";
import { toPersianDigits } from "@/utils/cn";

type Stage = "setup" | "running" | "summary";
type TimingMode = "untimed" | "per_question" | "overall" | "combined";
type ExamType = "practice" | "standard" | "diagnostic" | "speed" | "review";

interface AnswerRecord {
  question: QuizQuestion;
  response: AnswerResponse | null;
  correct: boolean;
  timedOut: boolean;
}

const PER_Q_PRESETS = [15, 30, 45, 60, 90, 120];
const OVERALL_PRESETS = [5, 10, 15, 20, 30];
const COUNT_PRESETS = [5, 8, 10, 15, 20];

function randomId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function ExamsPage() {
  const { state, recordAttempt, completeActivity } = useAppState();
  const [stage, setStage] = useState<Stage>("setup");

  // --- Configuration state ---
  const [examType, setExamType] = useState<ExamType>("practice");
  const [scopeAll, setScopeAll] = useState(true);
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel | "any">("any");
  const [count, setCount] = useState(10);
  const [timingMode, setTimingMode] = useState<TimingMode>("untimed");
  const [perQuestionSeconds, setPerQuestionSeconds] = useState(45);
  const [overallMinutes, setOverallMinutes] = useState(15);
  const [allowBacktrack, setAllowBacktrack] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [revealAfterAnswer, setRevealAfterAnswer] = useState(true);
  const [prioritizeWeak, setPrioritizeWeak] = useState(true);
  const [excludeSeen, setExcludeSeen] = useState(false);

  // --- Run state ---
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerRecord>>({});
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [forceSubmitSignal, setForceSubmitSignal] = useState(0);
  const [questionDeadlines, setQuestionDeadlines] = useState<Record<number, number>>({});
  const [overallDeadline, setOverallDeadline] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [startedAt, setStartedAt] = useState<number>(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingAdvance, setPendingAdvance] = useState(false);
  const submittedRef = useRef(false);
  const guestIdRef = useRef(randomId());

  // Tick every 250ms while running for smooth countdowns.
  useEffect(() => {
    if (stage !== "running") return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [stage]);

  function applyPreset(type: ExamType) {
    setExamType(type);
    switch (type) {
      case "practice":
        setTimingMode("untimed");
        setRevealAfterAnswer(true);
        setAutoAdvance(false);
        setAllowBacktrack(true);
        setCount(10);
        setPrioritizeWeak(true);
        break;
      case "standard":
        setTimingMode("overall");
        setOverallMinutes(15);
        setCount(15);
        setRevealAfterAnswer(false);
        setAllowBacktrack(true);
        setAutoAdvance(false);
        setPrioritizeWeak(false);
        break;
      case "diagnostic":
        setTimingMode("untimed");
        setCount(10);
        setScopeAll(true);
        setDifficulty("any");
        setPrioritizeWeak(false);
        setRevealAfterAnswer(true);
        setAllowBacktrack(false);
        setAutoAdvance(false);
        break;
      case "speed":
        setTimingMode("per_question");
        setPerQuestionSeconds(20);
        setCount(12);
        setAutoAdvance(true);
        setRevealAfterAnswer(true);
        setAllowBacktrack(false);
        setPrioritizeWeak(false);
        break;
      case "review":
        setTimingMode("untimed");
        setCount(8);
        setPrioritizeWeak(true);
        setScopeAll(true);
        setRevealAfterAnswer(true);
        setAllowBacktrack(true);
        setAutoAdvance(false);
        break;
    }
  }

  function toggleConcept(id: string) {
    setSelectedConcepts((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  function startExam() {
    const conceptIds = scopeAll || selectedConcepts.length === 0 ? "all" : selectedConcepts;
    const built = buildExamQuestions({
      conceptIds,
      difficulty,
      types: "any",
      count,
      excludeSeenIds: excludeSeen ? state.seenQuestionIds : [],
      prioritizeWeak,
      mastery: state.mastery,
    });
    setQuestions(built);
    setIndex(0);
    setAnswers({});
    setMarked(new Set());
    setForceSubmitSignal(0);
    setQuestionDeadlines({});
    submittedRef.current = false;

    const start = Date.now();
    setStartedAt(start);
    setNow(start);
    if (timingMode === "overall" || timingMode === "combined") {
      setOverallDeadline(start + overallMinutes * 60 * 1000);
    } else {
      setOverallDeadline(null);
    }
    if (timingMode === "per_question" || timingMode === "combined") {
      setQuestionDeadlines({ 0: start + perQuestionSeconds * 1000 });
    }
    setStage("running");
    completeActivity("exam_center_started");
  }

  // Ensure the current question has a deadline set exactly once (never resets
  // if the student navigates away and back).
  useEffect(() => {
    if (stage !== "running") return;
    if (timingMode !== "per_question" && timingMode !== "combined") return;
    if (questionDeadlines[index] !== undefined) return;
    setQuestionDeadlines((prev) => ({ ...prev, [index]: Date.now() + perQuestionSeconds * 1000 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, index]);

  const currentQuestionAnswered = Boolean(answers[index]);

  // Per-question countdown -> force submit when it hits zero.
  useEffect(() => {
    if (stage !== "running") return;
    if (currentQuestionAnswered) return;
    const deadline = questionDeadlines[index];
    if (!deadline) return;
    if (now >= deadline) {
      setForceSubmitSignal((s) => s + 1);
    }
  }, [now, questionDeadlines, index, stage, currentQuestionAnswered]);

  // Overall countdown -> finish exam entirely when it hits zero.
  useEffect(() => {
    if (stage !== "running" || !overallDeadline) return;
    if (now >= overallDeadline && !submittedRef.current) {
      if (!currentQuestionAnswered) setForceSubmitSignal((s) => s + 1);
      submittedRef.current = true;
      setTimeout(() => finishExam(), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, overallDeadline, stage]);

  function handleAnswered(outcome: ExamAnswerOutcome) {
    const q = questions[index];
    setAnswers((prev) => ({ ...prev, [index]: { question: q, response: outcome.response, correct: outcome.correct, timedOut: outcome.timedOut } }));
    if (autoAdvance) {
      setTimeout(() => goNext(), revealAfterAnswer ? 900 : 150);
    } else {
      setPendingAdvance(true);
    }
  }

  function goNext() {
    setPendingAdvance(false);
    if (index + 1 >= questions.length) {
      finishExam();
    } else {
      setIndex((i) => i + 1);
    }
  }

  function goTo(i: number) {
    if (!allowBacktrack) return;
    if (i < 0 || i >= questions.length) return;
    setIndex(i);
    setPendingAdvance(Boolean(answers[i]));
  }

  function toggleMark() {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function finishExam() {
    // Feed every answered question into the shared adaptive mastery system.
    for (const rec of Object.values(answers)) {
      const misconceptionId =
        !rec.correct && rec.response?.kind === "index" && rec.response.value >= 0
          ? rec.question.misconceptionByOption?.[rec.response.value]
          : undefined;
      recordAttempt({
        question: rec.question,
        correct: rec.correct,
        usedHint: false,
        changedAnswer: false,
        mode: "quiz",
        misconceptionId,
      });
    }
    completeActivity("exam_center_completed");
    setStage("summary");

    const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
    const correctCount = Object.values(answers).filter((a) => a.correct).length;
    const timedOutCount = Object.values(answers).filter((a) => a.timedOut && !a.response).length;
    const answeredCount = Object.values(answers).filter((a) => a.response !== null).length;
    const unansweredCount = questions.length - answeredCount;
    fetch("/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examMode: examType,
        guestId: guestIdRef.current,
        config: { conceptIds: scopeAll ? "all" : selectedConcepts, difficulty, count, timingMode, perQuestionSeconds, overallMinutes, allowBacktrack, autoAdvance },
        results: Object.entries(answers).map(([i, a]) => ({
          index: Number(i),
          questionId: a.question.id,
          conceptId: a.question.conceptId,
          correct: a.correct,
          timedOut: a.timedOut,
        })),
        scorePercent: questions.length ? Math.round((correctCount / questions.length) * 100) : 0,
        correctCount,
        incorrectCount: answeredCount - correctCount,
        unansweredCount,
        timedOutCount,
        totalQuestions: questions.length,
        durationSeconds,
      }),
    }).catch(() => undefined);
  }

  function confirmEndEarly() {
    setShowExitConfirm(false);
    finishExam();
  }

  const conceptOptions = useMemo(() => CONCEPT_ORDER.map((id) => ({ id, title: CONCEPT_MAP[id].title })), []);

  // --- Derived summary data ---
  const summary = useMemo(() => {
    const byConcept: Record<string, { correct: number; total: number }> = {};
    let correct = 0;
    let timedOut = 0;
    let unanswered = 0;
    for (let i = 0; i < questions.length; i++) {
      const rec = answers[i];
      const conceptId = questions[i].conceptId;
      const bucket = (byConcept[conceptId] ??= { correct: 0, total: 0 });
      bucket.total += 1;
      if (!rec || rec.response === null) {
        unanswered += 1;
        if (rec?.timedOut) timedOut += 1;
        continue;
      }
      if (rec.correct) {
        correct += 1;
        bucket.correct += 1;
      }
    }
    const scorePercent = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    return { byConcept, correct, timedOut, unanswered, scorePercent, incorrect: questions.length - correct - unanswered };
  }, [answers, questions]);

  // ------------------------------------------------------------------ SETUP
  if (stage === "setup") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="آزمون‌ها و ارزیابی زیست‌شناسی"
          title="مرکز آزمون BioMind"
          description="آزمون خودت را دقیقاً مطابق نیازت تنظیم کن: محدوده، سختی، تعداد سؤال و — مهم‌تر از همه — زمان هر سؤال و کل آزمون."
        />

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-5">
            <Card>
              <h3 className="mb-3 text-sm font-extrabold text-[var(--color-text)]">نوع آزمون</h3>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: "practice", label: "🟢 تمرین آزاد" },
                    { id: "standard", label: "📝 آزمون استاندارد" },
                    { id: "diagnostic", label: "🧪 آزمون تشخیصی" },
                    { id: "speed", label: "⚡ تمرین سریع" },
                    { id: "review", label: "🎯 مرور نقاط ضعف" },
                  ] as { id: ExamType; label: string }[]
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => applyPreset(t.id)}
                    className={`bm-focus rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                      examType === t.id
                        ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10 text-[var(--color-teal-deep)]"
                        : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-teal)]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                انتخاب یک نوع، تنظیمات پیشنهادی را پر می‌کند؛ هر بخش را می‌توانی زیر همین کارت دستی تغییر دهی.
              </p>
            </Card>

            <Card>
              <h3 className="mb-3 text-sm font-extrabold text-[var(--color-text)]">محدوده مفاهیم</h3>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={scopeAll} onChange={(e) => setScopeAll(e.target.checked)} />
                همه مفاهیم فصل گوارش و جذب
              </label>
              {!scopeAll && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {conceptOptions.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-xs">
                      <input type="checkbox" checked={selectedConcepts.includes(c.id)} onChange={() => toggleConcept(c.id)} />
                      {c.title}
                    </label>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <h3 className="mb-3 text-sm font-extrabold text-[var(--color-text)]">سختی و تعداد سؤال</h3>
              <div className="flex flex-wrap gap-2">
                {(["any", "beginner", "intermediate", "advanced"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`bm-focus rounded-full border px-3 py-1.5 text-xs font-bold ${
                      difficulty === d ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10" : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    {d === "any" ? "همه سطوح" : d === "beginner" ? "پایه" : d === "intermediate" ? "متوسط" : "پیشرفته"}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {COUNT_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCount(c)}
                    className={`bm-focus rounded-lg border px-3 py-1.5 text-xs font-bold ${
                      count === c ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10" : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    {toPersianDigits(c)} سؤال
                  </button>
                ))}
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(60, Number(e.target.value) || 1)))}
                  className="bm-focus w-20 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs"
                  aria-label="تعداد سؤال سفارشی"
                />
              </div>
              <label className="mt-3 flex items-center gap-2 text-xs">
                <input type="checkbox" checked={prioritizeWeak} onChange={(e) => setPrioritizeWeak(e.target.checked)} />
                اولویت با مفاهیمی که هنوز ضعیف یا ارزیابی‌نشده‌اند
              </label>
              <label className="mt-2 flex items-center gap-2 text-xs">
                <input type="checkbox" checked={excludeSeen} onChange={(e) => setExcludeSeen(e.target.checked)} />
                فقط سؤال‌هایی که قبلاً ندیده‌ام
              </label>
            </Card>

            <Card>
              <h3 className="mb-3 text-sm font-extrabold text-[var(--color-text)]">⏱ زمان‌بندی (مهم‌ترین بخش)</h3>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: "untimed", label: "بدون محدودیت زمانی" },
                    { id: "per_question", label: "زمان برای هر سؤال" },
                    { id: "overall", label: "زمان کل آزمون" },
                    { id: "combined", label: "ترکیبی (هر سؤال + کل آزمون)" },
                  ] as { id: TimingMode; label: string }[]
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTimingMode(t.id)}
                    className={`bm-focus rounded-full border px-3 py-1.5 text-xs font-bold ${
                      timingMode === t.id ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10" : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {(timingMode === "per_question" || timingMode === "combined") && (
                <div className="mt-3">
                  <p className="mb-1.5 text-xs font-bold text-[var(--color-text-muted)]">زمان هر سؤال</p>
                  <div className="flex flex-wrap gap-2">
                    {PER_Q_PRESETS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPerQuestionSeconds(s)}
                        className={`bm-focus rounded-lg border px-3 py-1.5 text-xs font-bold ${
                          perQuestionSeconds === s ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10" : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                        }`}
                      >
                        {toPersianDigits(s)} ثانیه
                      </button>
                    ))}
                    <input
                      type="number"
                      min={5}
                      max={600}
                      value={perQuestionSeconds}
                      onChange={(e) => setPerQuestionSeconds(Math.max(5, Math.min(600, Number(e.target.value) || 5)))}
                      className="bm-focus w-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs"
                      aria-label="زمان سفارشی هر سؤال (ثانیه)"
                    />
                  </div>
                </div>
              )}

              {(timingMode === "overall" || timingMode === "combined") && (
                <div className="mt-3">
                  <p className="mb-1.5 text-xs font-bold text-[var(--color-text-muted)]">زمان کل آزمون (دقیقه)</p>
                  <div className="flex flex-wrap gap-2">
                    {OVERALL_PRESETS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setOverallMinutes(m)}
                        className={`bm-focus rounded-lg border px-3 py-1.5 text-xs font-bold ${
                          overallMinutes === m ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10" : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                        }`}
                      >
                        {toPersianDigits(m)} دقیقه
                      </button>
                    ))}
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={overallMinutes}
                      onChange={(e) => setOverallMinutes(Math.max(1, Math.min(180, Number(e.target.value) || 1)))}
                      className="bm-focus w-20 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs"
                      aria-label="زمان سفارشی کل آزمون (دقیقه)"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-col gap-2 border-t border-[var(--color-border)] pt-3 text-xs">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={allowBacktrack} onChange={(e) => setAllowBacktrack(e.target.checked)} />
                  امکان رفتن به سؤال قبلی / پرش بین سؤالات
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={autoAdvance} onChange={(e) => setAutoAdvance(e.target.checked)} />
                  پیشروی خودکار به سؤال بعد پس از ثبت پاسخ
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={revealAfterAnswer} onChange={(e) => setRevealAfterAnswer(e.target.checked)} />
                  نمایش پاسخ صحیح و توضیح بلافاصله بعد از هر سؤال
                </label>
              </div>

              <Callout tone="info" title="قانون زمان‌بندی">
                {timingMode === "untimed" && "هیچ محدودیت زمانی وجود ندارد؛ با سرعت خودت جلو برو."}
                {timingMode === "per_question" &&
                  `هر سؤال دقیقاً ${toPersianDigits(perQuestionSeconds)} ثانیه زمان دارد. اگر پاسخ ندهی، سؤال به‌صورت بی‌پاسخ ثبت و رد می‌شود. برگشتن به سؤال باعث ریست‌شدن زمان آن نمی‌شود.`}
                {timingMode === "overall" &&
                  `کل آزمون ${toPersianDigits(overallMinutes)} دقیقه زمان دارد. مرور سؤال‌ها و تغییر پاسخ هم از همین زمان کم می‌شود. با پایان زمان، آزمون خودکار ثبت می‌شود.`}
                {timingMode === "combined" &&
                  `هر سؤال ${toPersianDigits(perQuestionSeconds)} ثانیه و کل آزمون ${toPersianDigits(
                    overallMinutes
                  )} دقیقه زمان دارد؛ هرکدام زودتر برسد، همان اعمال می‌شود.`}
              </Callout>
            </Card>

            <button type="button" className="bm-btn bm-btn-primary bm-focus self-start text-sm" onClick={startExam}>
              🚀 شروع آزمون
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <Card>
              <h3 className="mb-2 text-sm font-extrabold text-[var(--color-text)]">وضعیت فعلی مفاهیم</h3>
              <div className="flex flex-col gap-2">
                {CONCEPT_ORDER.slice(0, 6).map((id) => {
                  const m = state.mastery[id];
                  const level = levelFromScore(m?.score ?? 0, m?.evidenceCount ?? 0);
                  return (
                    <div key={id} className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[var(--color-text-muted)]">{CONCEPT_MAP[id].shortTitle}</span>
                      <MasteryBadge level={level} />
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card>
              <h3 className="mb-2 text-sm font-extrabold text-[var(--color-text)]">یادآوری</h3>
              <p className="text-xs leading-6 text-[var(--color-text-muted)]">
                نمره هر آزمون فقط یک شاهد است، نه معیار قطعی تسلط. برای رسیدن به «تسلط کامل»، BioMind به چند شاهد
                مستقل از پاسخ‌های درست نیاز دارد.
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------- RUNNING
  if (stage === "running") {
    const q = questions[index];
    if (!q) return null;
    const qDeadline = questionDeadlines[index];
    const qSecondsLeft = qDeadline ? Math.max(0, Math.ceil((qDeadline - now) / 1000)) : null;
    const overallSecondsLeft = overallDeadline ? Math.max(0, Math.ceil((overallDeadline - now) / 1000)) : null;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              سؤال {toPersianDigits(index + 1)} از {toPersianDigits(questions.length)} · پاسخ‌داده‌شده: {toPersianDigits(answeredCount)}
            </p>
            <div className="mt-1 w-56">
              <ProgressBar value={((index + (currentQuestionAnswered ? 1 : 0)) / questions.length) * 100} showValue={false} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {qSecondsLeft !== null && !currentQuestionAnswered && (
              <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${qSecondsLeft <= 5 ? "bg-[var(--color-danger)]/15 text-[var(--color-danger)]" : "bg-[var(--color-teal)]/10 text-[var(--color-teal-deep)]"}`}>
                ⏱ این سؤال: {toPersianDigits(qSecondsLeft)} ثانیه
              </span>
            )}
            {overallSecondsLeft !== null && (
              <span className="rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-extrabold text-[var(--color-text)]">
                🕐 کل آزمون: {toPersianDigits(Math.floor(overallSecondsLeft / 60))}:{toPersianDigits(String(overallSecondsLeft % 60).padStart(2, "0"))}
              </span>
            )}
            <button type="button" className="bm-btn bm-btn-secondary bm-focus text-xs" onClick={() => setShowExitConfirm(true)}>
              پایان زودهنگام
            </button>
          </div>
        </div>

        {allowBacktrack && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {questions.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`bm-focus flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold ${
                  i === index
                    ? "border-[var(--color-teal)] bg-[var(--color-teal)] text-white"
                    : answers[i]
                      ? "border-[var(--color-success)]/50 bg-[var(--color-success)]/10 text-[var(--color-success)]"
                      : marked.has(i)
                        ? "border-[var(--color-warning)] bg-[var(--color-warning)]/10"
                        : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                }`}
              >
                {toPersianDigits(i + 1)}
              </button>
            ))}
          </div>
        )}

        <Card key={q.id} className="bm-fade-in">
          <ExamQuestionRunner
            question={q}
            forceSubmitSignal={forceSubmitSignal}
            revealAfterAnswer={revealAfterAnswer}
            onSubmitted={handleAnswered}
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
            <button type="button" className="bm-btn bm-btn-secondary bm-focus text-xs" onClick={toggleMark}>
              {marked.has(index) ? "✓ علامت‌گذاری‌شده برای بازبینی" : "🏷 علامت‌گذاری برای بازبینی"}
            </button>
            {(pendingAdvance || currentQuestionAnswered) && !autoAdvance && (
              <button type="button" className="bm-btn bm-btn-primary bm-focus text-sm" onClick={goNext}>
                {index + 1 >= questions.length ? "پایان آزمون و مشاهده نتیجه" : "سؤال بعد ←"}
              </button>
            )}
          </div>
        </Card>

        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
            <Card className="max-w-sm">
              <p className="font-bold text-[var(--color-text)]">پایان زودهنگام آزمون؟</p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {questions.length - answeredCount > 0
                  ? `هنوز ${toPersianDigits(questions.length - answeredCount)} سؤال بی‌پاسخ داری. مطمئنی می‌خواهی آزمون را تمام کنی؟`
                  : "همه سؤالات پاسخ داده شده‌اند. آزمون ثبت شود؟"}
              </p>
              <div className="mt-4 flex gap-2">
                <button type="button" className="bm-btn bm-btn-secondary bm-focus text-xs" onClick={() => setShowExitConfirm(false)}>
                  ادامه آزمون
                </button>
                <button type="button" className="bm-btn bm-btn-primary bm-focus text-xs" onClick={confirmEndEarly}>
                  بله، پایان بده
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------------------- SUMMARY
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="نتیجه آزمون" title="گزارش عملکرد تو" />

      <Card className="bm-gradient-hero text-white">
        <p className="text-sm opacity-90">نمره نهایی</p>
        <p className="mt-1 text-4xl font-extrabold">{toPersianDigits(summary.scorePercent)}٪</p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <span>✓ درست: {toPersianDigits(summary.correct)}</span>
          <span>✗ نادرست: {toPersianDigits(summary.incorrect)}</span>
          <span>▢ بی‌پاسخ: {toPersianDigits(summary.unanswered)}</span>
          {summary.timedOut > 0 && <span>⏱ اتمام زمان: {toPersianDigits(summary.timedOut)}</span>}
        </div>
      </Card>

      <Card className="mt-5">
        <h3 className="mb-3 text-sm font-extrabold text-[var(--color-text)]">عملکرد به‌تفکیک مفهوم</h3>
        <div className="flex flex-col gap-3">
          {Object.entries(summary.byConcept).map(([conceptId, b]) => (
            <div key={conceptId}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-bold text-[var(--color-text)]">{CONCEPT_MAP[conceptId]?.title ?? conceptId}</span>
                <span className="text-[var(--color-text-muted)]">
                  {toPersianDigits(b.correct)} از {toPersianDigits(b.total)}
                </span>
              </div>
              <ProgressBar value={b.total ? (b.correct / b.total) * 100 : 0} showValue={false} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-5">
        <h3 className="mb-3 text-sm font-extrabold text-[var(--color-text)]">مرور پاسخ‌ها و برداشت‌های نادرست</h3>
        <div className="flex flex-col gap-4">
          {questions.map((q, i) => {
            const rec = answers[i];
            if (!rec || rec.correct) return null;
            const misId =
              rec.response?.kind === "index" && rec.response.value >= 0 ? q.misconceptionByOption?.[rec.response.value] : undefined;
            return (
              <div key={q.id} className="rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 p-3">
                <p className="text-sm font-bold text-[var(--color-text)]">
                  {toPersianDigits(i + 1)}. {q.prompt}
                </p>
                <p className="mt-2 text-xs leading-6 text-[var(--color-text-muted)]">{q.explanationIncorrect}</p>
                {misId && MISCONCEPTION_MAP[misId] && (
                  <p className="mt-2 rounded-lg bg-[var(--color-warning)]/15 p-2 text-xs text-[var(--color-text)]">
                    ⚠ برداشت نادرست احتمالی: {MISCONCEPTION_MAP[misId].targetedExplanation}
                  </p>
                )}
              </div>
            );
          })}
          {questions.every((_, i) => answers[i]?.correct) && (
            <p className="text-sm text-[var(--color-success)]">آفرین! در این آزمون هیچ پاسخ نادرستی ثبت نشد. 🎉</p>
          )}
        </div>
      </Card>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="bm-btn bm-btn-primary bm-focus text-sm"
          onClick={() => {
            applyPreset("review");
            setStage("setup");
          }}
        >
          🎯 آزمون مرور نقاط ضعف
        </button>
        <button type="button" className="bm-btn bm-btn-secondary bm-focus text-sm" onClick={() => setStage("setup")}>
          ⚙️ تنظیم آزمون جدید
        </button>
        <Link href="/tutor" className="bm-btn bm-btn-secondary bm-focus text-sm">
          🤖 ادامه با معلم هوشمند
        </Link>
        <Link href="/games" className="bm-btn bm-btn-secondary bm-focus text-sm">
          🎮 تمرین با بازی
        </Link>
      </div>
    </div>
  );
}
