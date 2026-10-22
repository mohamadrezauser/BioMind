import { GoogleGenAI, Type } from "@google/genai";
import type { AIExplainRequest, AIExplainResult, AIProvider } from "./types";
import { isValidAIExplainResult } from "./types";

const SYSTEM_PROMPT = `تو «معلم هوشمند زیست‌شناسی» BioMind هستی، یک دستیار آموزشی برای دانش‌آموزان پایه دهم ایران.
فقط درباره «گوارش و جذب مواد» و فقط مطابق محتوای علمی تأییدشده‌ای که در پیام کاربر آمده توضیح بده.
هرگز ادعای علمی جدید، منبع، یا شماره صفحه‌ی کتاب درسی اختراع نکن و از محتوای تأییدشده فراتر نرو.
اگر اطلاعات کافی نیست، صادقانه بگو که مطمئن نیستی.
پاسخ را فقط به‌صورت JSON با دو کلید "explanation" و "encouragement" و به زبان فارسی روان برگردان.
explanation باید حداکثر ۴ تا ۶ جمله باشد. encouragement یک جمله کوتاه و دلگرم‌کننده است.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    explanation: { type: Type.STRING },
    encouragement: { type: Type.STRING },
  },
  required: ["explanation", "encouragement"],
};

export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  private client: GoogleGenAI;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.client = new GoogleGenAI({ apiKey });
    this.model = model;
  }

  async explainConcept(req: AIExplainRequest): Promise<AIExplainResult> {
    const userContent = JSON.stringify({
      concept_title: req.conceptTitle,
      verified_explanation: req.conceptExplanation,
      misconception_belief: req.misconceptionBelief ?? null,
      student_answer_summary: req.studentAnswerSummary ?? null,
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let text: string;
    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: userContent,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.4,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          maxOutputTokens: 700,
          abortSignal: controller.signal,
        },
      });
      text = response.text ?? "";
    } catch (err) {
      clearTimeout(timeout);
      const message = err instanceof Error ? err.message : "";
      if (/429|quota|rate/i.test(message)) throw new Error("ai_rate_limited");
      if (/401|403|api key|permission/i.test(message)) throw new Error("ai_provider_error");
      throw new Error("ai_network_error");
    }
    clearTimeout(timeout);

    if (!text) throw new Error("ai_malformed_response");

    let parsed: unknown;
    try {
      parsed = JSON.parse(stripCodeFence(text));
    } catch {
      throw new Error("ai_malformed_response");
    }

    if (!isValidAIExplainResult(parsed)) throw new Error("ai_malformed_response");
    return parsed;
  }
}

function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1] : trimmed;
}
