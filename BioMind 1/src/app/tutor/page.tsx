"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppState } from "@/hooks/useAppState";
import { Card, SectionHeading, MasteryBadge, ProgressBar, Callout } from "@/components/ui/Primitives";
import { CONCEPT_MAP, CONCEPT_ORDER } from "@/content/concepts";
import { TEACHING_STRATEGIES } from "@/content/strategies";
import { MISCONCEPTION_MAP } from "@/content/misconceptions";
import {
  selectTutorConcept,
  pickDiagnosticQuestion,
  pickFollowupQuestion,
  detectMisconceptionFromAnswer,
  chooseStrategy,
  buildTeachingContent,
  type TeachingContent,
} from "@/learning/tutorEngine";
import { checkAnswer } from "@/assessment/quizEngine";
import { levelFromScore } from "@/learning/mastery";
import type { QuizQuestion, TeachingStrategyCode } from "@/types";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { cn } from "@/utils/cn";

interface HistoryItem {
  conceptId: string;
  correct: boolean;
  strategy?: TeachingStrategyCode;
}

export default function TutorPage() {
  const { state, recordAttempt, completeActivity } = useAppState();
  const [conceptId, setConceptId] = useState<string>(() => selectTutorConcept(state.mastery));
  const [question, setQuestion] = useState<QuizQuestion | undefined>(() =>
    pickDiagnosticQuestion(conceptId, state.mastery, state.seenQuestionIds)
  );
  const [phase, setPhase] = useState<"question" | "teaching">("question");
  const [selected, setSelected] = useState<number | null>(null);
  const [usedHint, setUsedHint] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [strategy, setStrategy] = useState<TeachingStrategyCode | null>(null);
  const [rationale, setRationale] = useState<string>("");
  const [content, setContent] = useState<TeachingContent | null>(null);
  const [pendingMisconception, setPendingMisconception] = useState<string | undefined>(undefined);
  const [attemptsThisConcept, setAttemptsThisConcept] = useState(0);
  const [streakCorrect, setStreakCorrect] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiEncouragement, setAiEncouragement] = useState<string | null>(null);
  const [seenLocal, setSeenLocal] = useState<string[]>([]);

  useEffect(() => {
    completeActivity("tutor_session_started");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const concept = CONCEPT_MAP[conceptId];
  const mastery = state.mastery[conceptId];
  const level = levelFromScore(mastery?.score ?? 0, mastery?.evidenceCount ?? 0);

  function startConcept(id: string) {
    setConceptId(id);
    const q = pickDiagnosticQuestion(id, state.mastery, [...state.seenQuestionIds, ...seenLocal]);
    setQuestion(q);
    setPhase("question");
    setSelected(null);
    setUsedHint(false);
    setShowHint(false);
    setAttemptsThisConcept(0);
    setStreakCorrect(0);
    setPendingMisconception(undefined);
    setAiEncouragement(null);
  }

  async function submitAnswer() {
    if (!question || selected === null) return;
    const correct = checkAnswer(question, { kind: "index", value: selected });
    const misconceptionId = !correct ? detectMisconceptionFromAnswer(question, selected) : undefined;
    const resolvingPending = correct && pendingMisconception !== undefined;

    recordAttempt({
      question,
      correct,
      usedHint,
      changedAnswer: false,
      mode: "tutor",
      misconceptionId,
      misconceptionResolved: resolvingPending,
    });
    setSeenLocal((prev) => [...prev, question.id]);
    setLastCorrect(correct);
    const nextStreak = correct ? streakCorrect + 1 : 0;
    setStreakCorrect(nextStreak);
    setHistory((prev) => [...prev, { conceptId, correct }]);

    const choice = chooseStrategy({
      conceptId,
      mastery,
      wasCorrect: correct,
      usedHint,
      misconceptionId,
      attemptsThisSession: attemptsThisConcept,
      streakCorrect: nextStreak,
    });

    setStrategy(choice.strategy);
    setRationale(choice.rationale);
    const baseContent = buildTeachingContent(conceptId, choice.strategy, choice.misconceptionId);
    setContent(baseContent);
    setPendingMisconception(misconceptionId ?? (resolvingPending ? undefined : pendingMisconception));
    setHistory((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = { ...copy[copy.length - 1], strategy: choice.strategy };
      return copy;
    });
    setPhase("teaching");
    setAiEncouragement(null);

    // Optional AI enhancement (demo-safe: silently falls back if unavailable)
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conceptTitle: concept.title,
          conceptExplanation: baseContent.body,
          misconceptionBelief: choice.misconceptionId
            ? MISCONCEPTION_MAP[choice.misconceptionId].belief
            : undefined,
          studentAnswerSummary: `دانش‌آموز به سؤال «${question.prompt}» ${correct ? "درست" : "نادرست"} پاسخ داد.`,
        }),
      });
      const data = await res.json();
      if (data?.available && data?.explanation) {
        setContent((c) => (c ? { ...c, body: data.explanation } : c));
        setAiEncouragement(data.encouragement ?? null);
      }
    } catch {
      // network failure: keep local validated explanation, no crash
    } finally {
      setAiLoading(false);
    }
  }

  function continueAfterTeaching() {
    const direction = lastCorrect ? (streakCorrect >= 2 ? "harder" : "same") : "easier";
    const shouldAdvanceConcept =
      lastCorrect && streakCorrect >= 2 && (level === "proficient" || level === "mastered");

    const nextAttempts = attemptsThisConcept + 1;
    setAttemptsThisConcept(nextAttempts);

    if (shouldAdvanceConcept || nextAttempts >= 4) {
      const nextId = selectTutorConcept(state.mastery, conceptId);
      startConcept(nextId);
      return;
    }

    const nextQ = pickFollowupQuestion(conceptId, state.mastery, [...state.seenQuestionIds, ...seenLocal], direction);
    setQuestion(nextQ);
    setSelected(null);
    setUsedHint(false);
    setShowHint(false);
    setPhase("question");
  }

  const strategyMeta = strategy ? TEACHING_STRATEGIES[strategy] : null;

  const conceptOptions = useMemo(
    () => CONCEPT_ORDER.map((id) => ({ id, title: CONCEPT_MAP[id].title })),
    []
  );

  if (!question) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-[var(--color-text-muted)]">در حال آماده‌سازی سؤال...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="هسته اصلی BioMind"
        title="معلم هوشمند تطبیقی"
        description="این معلم با هر پاسخ تو، روش تدریسش را تغییر می‌دهد: گاهی مثال می‌زند، گاهی تصویر نشان می‌دهد و گاهی به یک شبیه‌سازی می‌رود."
      />
      <div className="mb-5">
        <DemoModeBanner compact />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div>
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">مفهوم در حال یادگیری</p>
                <p className="text-lg font-extrabold text-[var(--color-text)]">{concept.title}</p>
              </div>
              <MasteryBadge level={level} />
            </div>
            <div className="mt-3">
              <ProgressBar value={mastery?.score ?? 0} showValue />
            </div>

            <div className="mt-5 border-t border-[var(--color-border)] pt-5">
              {phase === "question" && (
                <div key={question.id} className="bm-fade-in">
                  <p className="bm-tag mb-3">سؤال تشخیصی</p>
                  <p className="text-base font-bold leading-8 text-[var(--color-text)]">{question.prompt}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    {question.options?.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelected(idx)}
                        className={cn(
                          "bm-focus rounded-lg border px-3 py-2.5 text-right text-sm",
                          selected === idx
                            ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10"
                            : "border-[var(--color-border)] hover:border-[var(--color-teal)]"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {showHint && (
                    <p className="mt-3 rounded-lg bg-[var(--color-warning)]/10 p-3 text-xs text-[var(--color-text-muted)]">
                      💡 {question.hint}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="bm-btn bm-btn-secondary bm-focus text-xs"
                      onClick={() => {
                        setShowHint(true);
                        setUsedHint(true);
                      }}
                      disabled={showHint}
                    >
                      💡 راهنمایی بگیر
                    </button>
                    <button
                      type="button"
                      className="bm-btn bm-btn-primary bm-focus text-sm"
                      disabled={selected === null}
                      onClick={submitAnswer}
                    >
                      ثبت پاسخ
                    </button>
                  </div>
                </div>
              )}

              {phase === "teaching" && content && (
                <div className="bm-fade-in">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "bm-tag",
                        lastCorrect
                          ? "border-[var(--color-success)]/40 text-[var(--color-success)]"
                          : "border-[var(--color-danger)]/40 text-[var(--color-danger)]"
                      )}
                    >
                      {lastCorrect ? "✓ پاسخ درست بود" : "✗ پاسخ نادرست بود"}
                    </span>
                    {strategyMeta && <span className="bm-tag">راهبرد: {strategyMeta.label}</span>}
                  </div>

                  <Callout tone={lastCorrect ? "success" : "info"} title="چرا این روش را انتخاب کردم؟">
                    {rationale}
                  </Callout>

                  <div className="mt-4 rounded-xl border border-[var(--color-border)] p-4">
                    <h3 className="font-extrabold text-[var(--color-text)]">{content.heading}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
                      {aiLoading ? "در حال آماده‌سازی توضیح بهتر..." : content.body}
                    </p>
                    {aiEncouragement && (
                      <p className="mt-2 text-sm font-bold text-[var(--color-teal-deep)]">{aiEncouragement}</p>
                    )}
                    {content.activityHref && (
                      <Link href={content.activityHref} className="bm-btn bm-btn-secondary bm-focus mt-3 text-xs">
                        {content.activityLabel} ←
                      </Link>
                    )}
                  </div>

                  {!lastCorrect && (
                    <p className="mt-3 text-xs leading-6 text-[var(--color-text-muted)]">
                      {question.explanationIncorrect}
                    </p>
                  )}

                  <button
                    type="button"
                    className="bm-btn bm-btn-primary bm-focus mt-4 text-sm"
                    onClick={continueAfterTeaching}
                  >
                    سؤال بعدی ←
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <p className="text-sm font-bold text-[var(--color-text)]">تغییر مفهوم</p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              می‌توانی به‌جای پیشنهاد سیستم، مفهوم دیگری را خودت انتخاب کنی.
            </p>
            <select
              className="bm-focus mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-sm"
              value={conceptId}
              onChange={(e) => startConcept(e.target.value)}
            >
              {conceptOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </Card>

          <Card>
            <p className="text-sm font-bold text-[var(--color-text)]">روند این جلسه</p>
            {history.length === 0 ? (
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">هنوز سؤالی پاسخ داده نشده است.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {history
                  .slice()
                  .reverse()
                  .map((h, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[var(--color-text-muted)]">{CONCEPT_MAP[h.conceptId].shortTitle}</span>
                      <span className={h.correct ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}>
                        {h.correct ? "✓" : "✗"} {h.strategy ? TEACHING_STRATEGIES[h.strategy].label : ""}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
