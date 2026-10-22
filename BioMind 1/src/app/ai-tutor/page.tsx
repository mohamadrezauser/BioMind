"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, SectionHeading, Callout } from "@/components/ui/Primitives";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { useAIStatus } from "@/hooks/useAIStatus";
import { cn } from "@/utils/cn";

interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  responseMode?: "live_ai" | "rule_based" | "error";
  simpleExplanation?: string;
  example?: string;
  misconception?: string;
  confidenceNote?: string;
  relatedConcepts?: string[];
  suggestedActivity?: string;
  followUpQuestion?: string;
  errorText?: string;
}

const SUGGESTED_QUESTIONS = [
  "فرق گوارش و جذب چیست؟",
  "چرا صفرا آنزیم نیست؟",
  "چرا چربی‌ها مسیر متفاوتی نسبت به گلوکز دارند؟",
  "نقش پرز و ریزپرز در روده باریک چیست؟",
  "چرا HCl معده باید در روده خنثی شود؟",
];

function randomId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function modeLabel(mode?: ChatTurn["responseMode"]): { text: string; tone: string } {
  switch (mode) {
    case "live_ai":
      return { text: "🤖 پاسخ زنده هوش مصنوعی", tone: "text-[var(--color-teal-deep)]" };
    case "rule_based":
      return { text: "📚 پاسخ مبتنی بر محتوای بازبینی‌شده (بدون هوش مصنوعی زنده)", tone: "text-[var(--color-warning)]" };
    default:
      return { text: "⚠️ خطا", tone: "text-[var(--color-danger)]" };
  }
}

export default function AiTutorChatPage() {
  const { available } = useAIStatus();
  const [conversationId] = useState(() => randomId());
  const [guestId] = useState(() => randomId());
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lastUserMessage = useRef<string>("");

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, loading]);

  const historyForApi = useMemo(
    () => turns.map((t) => ({ role: t.role, content: t.content })),
    [turns]
  );

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return; // duplicate-submission protection

    lastUserMessage.current = trimmed;
    const userTurn: ChatTurn = { id: randomId(), role: "user", content: trimmed };
    setTurns((prev) => [...prev, userTurn]);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: trimmed,
          history: historyForApi,
          conversationId,
          guestId,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setTurns((prev) => [
          ...prev,
          { id: randomId(), role: "assistant", content: "", responseMode: "error", errorText: data?.error ?? "خطایی رخ داد." },
        ]);
        return;
      }

      setTurns((prev) => [
        ...prev,
        {
          id: randomId(),
          role: "assistant",
          content: data.answer ?? "",
          responseMode: data.response_mode,
          simpleExplanation: data.simple_explanation,
          example: data.example,
          misconception: data.misconception,
          confidenceNote: data.confidence_note,
          relatedConcepts: data.related_concepts,
          suggestedActivity: data.suggested_activity,
          followUpQuestion: data.follow_up_question,
          errorText: data.error,
        },
      ]);
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      setTurns((prev) => [
        ...prev,
        { id: randomId(), role: "assistant", content: "", responseMode: "error", errorText: "ارتباط با سرور برقرار نشد." },
      ]);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function cancelRequest() {
    abortRef.current?.abort();
    setLoading(false);
  }

  function startNewConversation() {
    setTurns([]);
    setInput("");
  }

  function retryLast() {
    if (!lastUserMessage.current) return;
    setTurns((prev) => prev.slice(0, -1)); // drop the failed assistant turn if any
    sendMessage(lastUserMessage.current);
  }

  async function copyText(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1500);
    } catch {
      // clipboard unavailable: silently ignore
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-57px)] max-w-4xl flex-col px-4 py-4 sm:px-6 lg:h-[calc(100dvh-24px)] lg:px-8">
      <SectionHeading
        eyebrow="گفتگوی زنده"
        title="معلم هوشمند زیست‌شناسی"
        description="سؤال خودت را درباره گوارش و جذب مواد بپرس. اگر اتصال هوش مصنوعی برقرار نباشد، باز هم از محتوای بازبینی‌شده BioMind پاسخ می‌گیری."
      />
      <div className="mb-3">
        <DemoModeBanner compact />
      </div>
      {!available && (
        <Callout tone="info" title="وضعیت این گفتگو">
          هوش مصنوعی زنده پیکربندی نشده؛ پاسخ‌ها از محتوای علمی بازبینی‌شده BioMind ساخته می‌شوند و به‌وضوح برچسب
          «بدون هوش مصنوعی زنده» می‌گیرند.
        </Callout>
      )}

      <Card className="mt-4 flex flex-1 flex-col overflow-hidden !p-0">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4" role="log" aria-live="polite">
          {turns.length === 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-[var(--color-text-muted)]">
                نمی‌دونی از کجا شروع کنی؟ یکی از سؤال‌های پیشنهادی را انتخاب کن:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="bm-focus rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text)] hover:border-[var(--color-teal)]"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {turns.map((turn) => (
            <div key={turn.id} className={cn("flex", turn.role === "user" ? "justify-start" : "justify-end")}>
              <div
                className={cn(
                  "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7",
                  turn.role === "user"
                    ? "bg-[var(--color-surface-muted)] text-[var(--color-text)]"
                    : turn.responseMode === "error"
                      ? "border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 text-[var(--color-text)]"
                      : "border border-[var(--color-teal)]/30 bg-[var(--color-teal)]/5 text-[var(--color-text)]"
                )}
              >
                {turn.role === "assistant" && (
                  <p className={cn("mb-1.5 text-[11px] font-bold", modeLabel(turn.responseMode).tone)}>
                    {modeLabel(turn.responseMode).text}
                  </p>
                )}

                {turn.role === "user" ? (
                  <p className="whitespace-pre-wrap font-medium">{turn.content}</p>
                ) : turn.responseMode === "error" ? (
                  <>
                    <p>{turn.errorText}</p>
                    <button type="button" className="bm-btn bm-btn-secondary bm-focus mt-2 text-xs" onClick={retryLast}>
                      🔁 تلاش دوباره
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    {turn.errorText && (
                      <p className="rounded-lg bg-[var(--color-warning)]/15 p-2 text-xs text-[var(--color-text-muted)]">
                        {turn.errorText}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap">{turn.content}</p>
                    {turn.simpleExplanation && (
                      <p className="text-xs text-[var(--color-text-muted)]">
                        <span className="font-bold">به زبان ساده: </span>
                        {turn.simpleExplanation}
                      </p>
                    )}
                    {turn.example && (
                      <p className="text-xs text-[var(--color-text-muted)]">
                        <span className="font-bold">مثال: </span>
                        {turn.example}
                      </p>
                    )}
                    {turn.misconception && (
                      <p className="rounded-lg bg-[var(--color-danger)]/10 p-2 text-xs text-[var(--color-text)]">
                        <span className="font-bold">⚠ برداشت نادرست رایج: </span>
                        {turn.misconception}
                      </p>
                    )}
                    {turn.confidenceNote && (
                      <p className="text-[11px] italic text-[var(--color-text-muted)]">{turn.confidenceNote}</p>
                    )}
                    {!!turn.relatedConcepts?.length && (
                      <div className="flex flex-wrap gap-1.5">
                        {turn.relatedConcepts.map((c) => (
                          <span key={c} className="bm-tag">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                    {turn.suggestedActivity && (
                      <p className="text-xs text-[var(--color-text-muted)]">🎯 {turn.suggestedActivity}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        className="bm-focus rounded-lg border border-[var(--color-border)] px-2 py-1 text-[11px] font-bold text-[var(--color-text-muted)] hover:border-[var(--color-teal)]"
                        onClick={() => copyText(turn.id, turn.content)}
                      >
                        {copiedId === turn.id ? "کپی شد ✓" : "📋 کپی پاسخ"}
                      </button>
                      {turn.followUpQuestion && (
                        <button
                          type="button"
                          className="bm-focus rounded-lg border border-[var(--color-teal)]/50 px-2 py-1 text-[11px] font-bold text-[var(--color-teal-deep)]"
                          onClick={() => sendMessage(turn.followUpQuestion!)}
                        >
                          ادامه بده: {turn.followUpQuestion}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-end">
              <div className="max-w-[70%] rounded-2xl border border-[var(--color-teal)]/30 bg-[var(--color-teal)]/5 px-4 py-3 text-sm text-[var(--color-text-muted)]">
                در حال فکر کردن… <button type="button" className="mr-2 underline" onClick={cancelRequest}>لغو</button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--color-border)] p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              maxLength={1200}
              placeholder="سؤالت را درباره گوارش و جذب مواد بنویس…"
              aria-label="پیام به معلم هوشمند"
              className="bm-focus flex-1 resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
            />
            <button
              type="button"
              className="bm-btn bm-btn-primary bm-focus shrink-0"
              disabled={loading || !input.trim()}
              onClick={() => sendMessage(input)}
            >
              ارسال
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[11px] text-[var(--color-text-muted)]">Enter برای ارسال، Shift+Enter برای خط جدید</p>
            <button type="button" className="text-[11px] font-bold text-[var(--color-text-muted)] hover:text-[var(--color-danger)]" onClick={startNewConversation}>
              🗑 گفتگوی جدید
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
