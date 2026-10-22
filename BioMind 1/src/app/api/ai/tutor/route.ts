import { askTutor, isTutorChatConfigured, type TutorChatTurn } from "@/services/ai/tutorChat";
import { retrieveRelevantContext, formatContextForPrompt } from "@/learning/retrieval";
import { rateLimit, clientKeyFromRequest } from "@/server/rateLimit";
import { getSessionUser } from "@/server/auth";
import { db } from "@/db";
import { chatMessages } from "@/db/schema";

export const dynamic = "force-dynamic";

interface Body {
  message?: unknown;
  history?: unknown;
  conversationId?: unknown;
  studentLevel?: unknown;
  guestId?: unknown;
}

const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_TURNS = 12;

function sanitizeHistory(raw: unknown): TutorChatTurn[] {
  if (!Array.isArray(raw)) return [];
  const turns: TutorChatTurn[] = [];
  for (const item of raw.slice(-MAX_HISTORY_TURNS)) {
    if (!item || typeof item !== "object") continue;
    const role = (item as Record<string, unknown>).role;
    const content = (item as Record<string, unknown>).content;
    if ((role === "user" || role === "assistant") && typeof content === "string" && content.length < 4000) {
      turns.push({ role, content });
    }
  }
  return turns;
}

const FRIENDLY_ERRORS: Record<string, string> = {
  ai_not_configured: "هوش مصنوعی در این محیط پیکربندی نشده است.",
  ai_rate_limited: "سرویس هوش مصنوعی موقتاً شلوغ است.",
  ai_network_error: "ارتباط با سرویس هوش مصنوعی برقرار نشد.",
  ai_timeout: "پاسخ هوش مصنوعی بیش از حد طول کشید.",
  ai_malformed_response: "پاسخ هوش مصنوعی قابل‌اعتماد نبود.",
  ai_provider_error: "سرویس هوش مصنوعی در دسترس نیست (کلید یا دسترسی نامعتبر).",
};

export async function POST(request: Request) {
  const user = await getSessionUser();
  const rl = rateLimit(clientKeyFromRequest(request, user?.id ?? "guest-tutor"), 20, 10 * 60 * 1000);
  if (!rl.allowed) {
    return Response.json(
      { error: "تعداد پیام‌های مجاز در این بازه زمانی به پایان رسید. کمی بعد دوباره امتحان کن." },
      { status: 429 }
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return Response.json({ error: "لطفاً سؤال خود را بنویس." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return Response.json({ error: `سؤال خیلی طولانی است (حداکثر ${MAX_MESSAGE_LENGTH} نویسه).` }, { status: 400 });
  }

  const history = sanitizeHistory(body.history);
  const studentLevel = typeof body.studentLevel === "string" ? body.studentLevel.slice(0, 40) : undefined;
  const conversationId =
    typeof body.conversationId === "string" && body.conversationId.length < 100
      ? body.conversationId
      : "default";
  const guestId = typeof body.guestId === "string" ? body.guestId.slice(0, 100) : null;

  const context = retrieveRelevantContext(message);
  const groundedContext = formatContextForPrompt(context);

  async function persist(role: "user" | "assistant", content: string, responseMode?: string) {
    try {
      await db.insert(chatMessages).values({
        userId: user?.id ?? null,
        guestId: user ? null : guestId,
        conversationId,
        role,
        content: content.slice(0, 4000),
        responseMode: responseMode ?? null,
      });
    } catch {
      // best-effort persistence only; never block the chat on a logging failure
    }
  }

  await persist("user", message);

  if (!isTutorChatConfigured()) {
    const fallback = buildRuleBasedFallback(message, context);
    await persist("assistant", fallback.answer, "rule_based");
    return Response.json({
      response_mode: "rule_based",
      reason: "ai_not_configured",
      ...fallback,
      related_concepts: context.concepts.map((c) => c.title),
    });
  }

  try {
    const result = await askTutor({ message, history, groundedContext, studentLevel });
    await persist("assistant", result.answer, "live_ai");
    return Response.json({ response_mode: "live_ai", ...result });
  } catch (err) {
    const code = err instanceof Error ? err.message : "ai_unknown_error";
    const fallback = buildRuleBasedFallback(message, context);
    await persist("assistant", fallback.answer, "rule_based");
    return Response.json({
      response_mode: "rule_based",
      reason: code,
      error: FRIENDLY_ERRORS[code] ?? FRIENDLY_ERRORS.ai_provider_error,
      ...fallback,
      related_concepts: context.concepts.map((c) => c.title),
    });
  }
}

function buildRuleBasedFallback(
  message: string,
  context: ReturnType<typeof retrieveRelevantContext>
): { answer: string; confidence_note: string; suggested_activity?: string } {
  const top = context.concepts[0];
  if (!top) {
    return {
      answer:
        "هوش مصنوعی در دسترس نیست، اما می‌توانی از بخش «معلم هوشمند تطبیقی» یا درس‌های BioMind برای یادگیری گام‌به‌گام استفاده کنی.",
      confidence_note: "این پاسخ مبتنی بر محتوای ثابت و بازبینی‌شده است، نه پاسخ زنده هوش مصنوعی.",
    };
  }
  return {
    answer: `${top.explanation}${context.misconceptions[0] ? `\n\nنکته مهم: ${context.misconceptions[0].targetedExplanation}` : ""}`,
    confidence_note: `هوش مصنوعی زنده در دسترس نیست؛ این پاسخ از محتوای تأییدشدهٔ مفهوم «${top.title}» ساخته شده است (${top.sourceNote}).`,
    suggested_activity: "برای تمرین بیشتر، به بخش «معلم هوشمند تطبیقی» یا «آزمون‌ها و ارزیابی» مراجعه کن.",
  };
}
