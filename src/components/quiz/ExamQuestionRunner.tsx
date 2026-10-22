"use client";

import { useEffect, useMemo, useState } from "react";
import type { QuizQuestion } from "@/types";
import type { AnswerResponse } from "@/assessment/quizEngine";
import { checkAnswer } from "@/assessment/quizEngine";
import { cn } from "@/utils/cn";

function shuffledIndices(n: number, seed: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function seedFromId(id: string): number {
  let s = 0;
  for (const ch of id) s += ch.charCodeAt(0);
  return s + 1;
}

export interface ExamAnswerOutcome {
  response: AnswerResponse | null;
  correct: boolean;
  timedOut: boolean;
}

/**
 * A self-contained question renderer for the Exam Center. Unlike the shared
 * QuestionCard (used by the quick-practice quiz), this component lets the
 * parent force a submission from outside (needed for server-trusted, strict
 * per-question / overall deadlines) while staying revealed only when the
 * parent says the exam allows immediate feedback.
 */
export function ExamQuestionRunner({
  question,
  forceSubmitSignal,
  revealAfterAnswer,
  onSubmitted,
}: {
  question: QuizQuestion;
  /** increment this number (from the parent) to force a submission, e.g. on timeout */
  forceSubmitSignal: number;
  revealAfterAnswer: boolean;
  onSubmitted: (outcome: ExamAnswerOutcome) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [selectedSet, setSelectedSet] = useState<number[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [text, setText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [timedOutNotice, setTimedOutNotice] = useState(false);

  const shuffledRightOptions = useMemo(() => {
    if (!question.pairs) return [];
    const idx = shuffledIndices(question.pairs.length, seedFromId(question.id));
    return idx.map((i) => question.pairs![i].right);
  }, [question]);

  useEffect(() => {
    setSelectedIndex(null);
    setOrder(shuffledIndices(question.items?.length ?? 0, seedFromId(question.id)));
    setSelectedSet([]);
    setAssignments({});
    setText("");
    setRevealed(false);
    setTimedOutNotice(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  function buildResponse(): AnswerResponse | null {
    switch (question.type) {
      case "mcq":
      case "true_false":
      case "scenario":
        return selectedIndex === null ? null : { kind: "index", value: selectedIndex };
      case "ordering":
        return { kind: "order", value: order };
      case "labeling":
        return { kind: "order", value: selectedSet };
      case "matching":
        return { kind: "matching", value: assignments };
      case "short_answer":
        return text.trim() ? { kind: "text", value: text } : null;
      default:
        return null;
    }
  }

  function canSubmit(): boolean {
    const r = buildResponse();
    if (!r) return false;
    if (r.kind === "matching") return question.pairs?.every((p) => assignments[p.left]) ?? false;
    if (question.type === "labeling") return selectedSet.length > 0;
    return true;
  }

  function doSubmit(timedOut: boolean) {
    if (revealed) return;
    const response = buildResponse();
    const correct = response ? checkAnswer(question, response) : false;
    setRevealed(true);
    setLastCorrect(correct);
    setTimedOutNotice(timedOut && !response);
    onSubmitted({ response, correct, timedOut });
  }

  // External force-submit (timer expiry, manual "next" with no answer, etc.)
  const isFirstRender = useMemo(() => ({ current: true }), [question.id]);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    doSubmit(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceSubmitSignal]);

  function moveItem(index: number, dir: -1 | 1) {
    setOrder((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div>
      <p className="bm-tag mb-3">{typeLabel(question.type)}</p>
      <p className="text-base font-bold leading-8 text-[var(--color-text)]">{question.prompt}</p>

      <div className="mt-4">
        {(question.type === "mcq" || question.type === "true_false" || question.type === "scenario") && (
          <div className="flex flex-col gap-2">
            {question.options?.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={revealed}
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "bm-focus rounded-lg border px-3 py-2.5 text-right text-sm",
                  revealAfterAnswer && revealed && idx === question.correctIndex
                    ? "border-[var(--color-success)] bg-[var(--color-success)]/10"
                    : revealAfterAnswer && revealed && idx === selectedIndex && idx !== question.correctIndex
                      ? "border-[var(--color-danger)] bg-[var(--color-danger)]/10"
                      : selectedIndex === idx
                        ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10"
                        : "border-[var(--color-border)] hover:border-[var(--color-teal)]"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {question.type === "ordering" && (
          <ul className="flex flex-col gap-2">
            {order.map((itemIdx, pos) => (
              <li
                key={itemIdx}
                className="flex items-center justify-between gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
              >
                <span>
                  {pos + 1}. {question.items?.[itemIdx]}
                </span>
                {!revealed && (
                  <span className="flex gap-1">
                    <button type="button" className="bm-focus rounded-md border border-[var(--color-border)] px-2 py-1 text-xs" onClick={() => moveItem(pos, -1)} disabled={pos === 0} aria-label="جابه‌جایی به بالا">
                      ▲
                    </button>
                    <button type="button" className="bm-focus rounded-md border border-[var(--color-border)] px-2 py-1 text-xs" onClick={() => moveItem(pos, 1)} disabled={pos === order.length - 1} aria-label="جابه‌جایی به پایین">
                      ▼
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        {question.type === "labeling" && (
          <div className="flex flex-wrap gap-2">
            {question.items?.map((item, idx) => (
              <button
                key={idx}
                type="button"
                disabled={revealed}
                onClick={() =>
                  setSelectedSet((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]))
                }
                className={cn(
                  "bm-focus rounded-full border px-3 py-1.5 text-sm",
                  revealAfterAnswer && revealed && question.correctOrder?.includes(idx)
                    ? "border-[var(--color-success)] bg-[var(--color-success)]/10"
                    : selectedSet.includes(idx)
                      ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10"
                      : "border-[var(--color-border)]"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {question.type === "matching" && (
          <div className="flex flex-col gap-2">
            {question.pairs?.map((pair) => (
              <div key={pair.left} className="flex items-center gap-2">
                <span className="w-32 shrink-0 text-sm font-bold text-[var(--color-text)] sm:w-40">{pair.left}</span>
                <select
                  disabled={revealed}
                  className="bm-focus w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-sm"
                  value={assignments[pair.left] ?? ""}
                  onChange={(e) => setAssignments((prev) => ({ ...prev, [pair.left]: e.target.value }))}
                >
                  <option value="" disabled>
                    انتخاب کن...
                  </option>
                  {shuffledRightOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {question.type === "short_answer" && (
          <input
            type="text"
            disabled={revealed}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="پاسخ کوتاه خودت را بنویس..."
            className="bm-focus w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 text-sm"
          />
        )}
      </div>

      {!revealed ? (
        <div className="mt-4">
          <button type="button" className="bm-btn bm-btn-primary bm-focus text-sm" disabled={!canSubmit()} onClick={() => doSubmit(false)}>
            ثبت پاسخ
          </button>
        </div>
      ) : revealAfterAnswer ? (
        <p className={cn("mt-4 rounded-lg p-3 text-sm leading-7", lastCorrect ? "bg-[var(--color-success)]/10" : "bg-[var(--color-danger)]/10", "text-[var(--color-text)]")}>
          {timedOutNotice ? "⏱ زمان این سؤال تمام شد. " : lastCorrect ? "✓ " : "✗ "}
          {lastCorrect ? question.explanationCorrect : question.explanationIncorrect}
        </p>
      ) : (
        <p className="mt-4 rounded-lg bg-[var(--color-surface-muted)] p-3 text-sm text-[var(--color-text-muted)]">
          پاسخ ثبت شد. توضیح کامل در پایان آزمون نمایش داده می‌شود.
        </p>
      )}
    </div>
  );
}

function typeLabel(type: QuizQuestion["type"]): string {
  const map: Record<QuizQuestion["type"], string> = {
    mcq: "چندگزینه‌ای",
    true_false: "درست / نادرست",
    matching: "تطبیق مفاهیم",
    ordering: "ترتیب‌چینی",
    labeling: "شناسایی",
    short_answer: "پاسخ کوتاه",
    scenario: "سناریو",
  };
  return map[type];
}
