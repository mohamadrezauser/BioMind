import type { AIExplainRequest, AIExplainResult, AIProvider } from "./types";
import { isValidAIExplainResult } from "./types";

const SYSTEM_PROMPT = `تو یک دستیار آموزشی زیست‌شناسی برای دانش‌آموزان پایه دهم ایران هستی.
فقط درباره «گوارش و جذب مواد» و فقط مطابق محتوای علمی تأییدشده‌ای که در پیام کاربر آمده توضیح بده.
هرگز ادعای علمی جدید یا بحث‌برانگیز اضافه نکن و از محتوای تأییدشده فراتر نرو.
پاسخ را فقط به‌صورت JSON با دو کلید "explanation" و "encouragement" و به زبان فارسی روان برگردان.
explanation باید حداکثر ۴ تا ۶ جمله باشد. encouragement یک جمله کوتاه و دلگرم‌کننده است.`;

export class OpenAIProvider implements AIProvider {
  readonly name = "openai";
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "gpt-4o-mini") {
    this.apiKey = apiKey;
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

    let response: Response;
    try {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          temperature: 0.4,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userContent },
          ],
        }),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeout);
      throw new Error("ai_network_error");
    }
    clearTimeout(timeout);

    if (response.status === 429) throw new Error("ai_rate_limited");
    if (!response.ok) throw new Error("ai_provider_error");

    const data = await response.json().catch(() => null);
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("ai_malformed_response");

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("ai_malformed_response");
    }

    if (!isValidAIExplainResult(parsed)) throw new Error("ai_malformed_response");
    return parsed;
  }
}
