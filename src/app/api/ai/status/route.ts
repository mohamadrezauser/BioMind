import { isAIConfigured, configuredProviderName } from "@/services/ai";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    available: isAIConfigured(),
    provider: configuredProviderName(),
    model: process.env.GEMINI_API_KEY ? process.env.GEMINI_MODEL || "gemini-2.5-flash" : null,
  });
}
