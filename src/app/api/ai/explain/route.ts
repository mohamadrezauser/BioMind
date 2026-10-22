import { getAIProvider } from "@/services/ai";

export const dynamic = "force-dynamic";

interface ExplainBody {
  conceptTitle?: unknown;
  conceptExplanation?: unknown;
  misconceptionBelief?: unknown;
  studentAnswerSummary?: unknown;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length < 2000;
}

export async function POST(request: Request) {
  const provider = getAIProvider();
  if (!provider) {
    return Response.json(
      { available: false, reason: "ai_not_configured" },
      { status: 200 }
    );
  }

  let body: ExplainBody;
  try {
    body = (await request.json()) as ExplainBody;
  } catch {
    return Response.json({ available: true, error: "درخواست نامعتبر است." }, { status: 400 });
  }

  if (!isNonEmptyString(body.conceptTitle) || !isNonEmptyString(body.conceptExplanation)) {
    return Response.json(
      { available: true, error: "اطلاعات مفهوم برای تولید توضیح کافی نیست." },
      { status: 400 }
    );
  }

  try {
    const result = await provider.explainConcept({
      conceptTitle: body.conceptTitle,
      conceptExplanation: body.conceptExplanation,
      misconceptionBelief: isNonEmptyString(body.misconceptionBelief) ? body.misconceptionBelief : undefined,
      studentAnswerSummary: isNonEmptyString(body.studentAnswerSummary) ? body.studentAnswerSummary : undefined,
    });
    return Response.json({ available: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "ai_unknown_error";
    const friendly: Record<string, string> = {
      ai_rate_limited: "سرویس هوش مصنوعی موقتاً شلوغ است. از توضیح استاندارد استفاده می‌کنیم.",
      ai_network_error: "ارتباط با سرویس هوش مصنوعی برقرار نشد. از توضیح استاندارد استفاده می‌کنیم.",
      ai_malformed_response: "پاسخ هوش مصنوعی قابل‌اعتماد نبود. از توضیح استاندارد استفاده می‌کنیم.",
      ai_provider_error: "سرویس هوش مصنوعی در دسترس نیست. از توضیح استاندارد استفاده می‌کنیم.",
    };
    return Response.json(
      { available: true, error: friendly[message] ?? friendly.ai_provider_error },
      { status: 200 }
    );
  }
}
