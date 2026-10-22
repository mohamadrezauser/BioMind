"use client";

import { useEffect, useMemo, useState } from "react";
import type { QuizQuestion } from "@/types";
import type { AnswerResponse } from "@/assessment/quizEngine";
import { checkAnswer } from "@/assessment/quizEngine";
import { cn } from "@/utils/cn";

function shuffledIndices(n: number, seed: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  // simple deterministic shuffle so the same question doesn't re-shuffle on re-render
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

export function QuestionCard({
  question,
  onAnswer,
  showTypeTag = true,
}: {
  question: QuizQuestion;
  onAnswer: (response: AnswerResponse, correct: boolean, usedHint: boolean, changedAnswer: boolean) => void;
  showTypeTag?: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [selectedSet, setSelectedSet] = useState<number[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [text, setText] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [changeCount, setChangeCount] = useState(0);

  const shuffledRightOptions = useMemo(() => {
    if (!question.pairs) return [];
    const idx = shuffledIndices(question.pairs.length, seedFromId(question.id));
    return idx.map((i) => question.pairs![i].right);
  }, [question]);

  useEffect(() => {
    // Resetting all local answer state when a new question is shown.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting local UI state when the `question` prop changes
    setSelectedIndex(null);
    setOrder(shuffledIndices(question.items?.length ?? 0, seedFromId(question.id)));
    setSelectedSet([]);
    setAssignments({});
    setText("");
    setShowHint(false);
    setUsedHint(false);
    setRevealed(false);
    setChangeCount(0);
  }, [question]);

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

  function submit() {
    const response = buildResponse();
    if (!response) return;
    const correct = checkAnswer(question, response);
    setRevealed(true);
    setLastCorrect(correct);
    onAnswer(response, correct, usedHint, changeCount > 0);
  }

  function moveItem(index: number, dir: -1 | 1) {
    setOrder((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setChangeCount((c) => c + 1);
  }

  return (
    <div>
      {showTypeTag && <p className="bm-tag mb-3">{typeLabel(question.type)}</p>}
      <p className="text-base font-bold leading-8 text-[var(--color-text)]">{question.prompt}</p>

      <div className="mt-4">
        {(question.type === "mcq" || question.type === "true_false" || question.type === "scenario") && (
          <div className="flex flex-col gap-2">
            {question.options?.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={revealed}
                onClick={() => {
                  if (selectedIndex !== null && selectedIndex !== idx) setChangeCount((c) => c + 1);
                  setSelectedIndex(idx);
                }}
                className={cn(
                  "bm-focus rounded-lg border px-3 py-2.5 text-right text-sm",
                  revealed && idx === question.correctIndex
                    ? "border-[var(--color-success)] bg-[var(--color-success)]/10"
                    : revealed && idx === selectedIndex && idx !== question.correctIndex
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
                    <button
                      type="button"
                      className="bm-focus rounded-md border border-[var(--color-border)] px-2 py-1 text-xs"
                      onClick={() => moveItem(pos, -1)}
                      aria-label="جابه‌جایی به بالا"
                      disabled={pos === 0}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="bm-focus rounded-md border border-[var(--color-border)] px-2 py-1 text-xs"
                      onClick={() => moveItem(pos, 1)}
                      aria-label="جابه‌جایی به پایین"
                      disabled={pos === order.length - 1}
                    >
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
                onClick={() => {
                  setChangeCount((c) => c + 1);
                  setSelectedSet((prev) =>
                    prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
                  );
                }}
                className={cn(
                  "bm-focus rounded-full border px-3 py-1.5 text-sm",
                  revealed && question.correctOrder?.includes(idx)
                    ? "border-[var(--color-success)] bg-[var(--color-success)]/10"
                    : revealed && selectedSet.includes(idx)
                      ? "border-[var(--color-danger)] bg-[var(--color-danger)]/10"
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
                  onChange={(e) => {
                    setChangeCount((c) => c + 1);
                    setAssignments((prev) => ({ ...prev, [pair.left]: e.target.value }));
                  }}
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
                {revealed && (
                  <span className={assignments[pair.left] === pair.right ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}>
                    {assignments[pair.left] === pair.right ? "✓" : "✗"}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {question.type === "short_answer" && (
          <input
            type="text"
            disabled={revealed}
            value={text}
            onChange={(e) => {
              setChangeCount((c) => c + 1);
              setText(e.target.value);
            }}
            placeholder="پاسخ کوتاه خودت را بنویس..."
            className="bm-focus w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 text-sm"
          />
        )}
      </div>

      {showHint && !revealed && (
        <p className="mt-3 rounded-lg bg-[var(--color-warning)]/10 p-3 text-xs text-[var(--color-text-muted)]">
          💡 {question.hint}
        </p>
      )}

      {!revealed ? (
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
            💡 راهنمایی
          </button>
          <button type="button" className="bm-btn bm-btn-primary bm-focus text-sm" disabled={!canSubmit()} onClick={submit}>
            ثبت پاسخ
          </button>
        </div>
      ) : (
        <p
          className={cn(
            "mt-4 rounded-lg p-3 text-sm leading-7",
            lastCorrect ? "bg-[var(--color-success)]/10 text-[var(--color-text)]" : "bg-[var(--color-danger)]/10 text-[var(--color-text)]"
          )}
        >
          {lastCorrect ? "✓ " : "✗ "}
          {lastCorrect ? question.explanationCorrect : question.explanationIncorrect}
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
