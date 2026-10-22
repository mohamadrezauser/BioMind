import type { AIProvider } from "./types";
import { GeminiProvider } from "./geminiProvider";
import { OpenAIProvider } from "./openaiProvider";

export * from "./types";

export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

/**
 * Provider-independent factory. Add new providers here without touching
 * any application/UI logic. Returns null when no provider is configured,
 * which the app treats as "demo mode" (rule-based tutor only).
 *
 * Gemini is the primary, officially supported provider for BioMind. OpenAI
 * remains available as a documented fallback for deployments that already
 * configured it, without requiring any UI changes.
 */
export function getAIProvider(): AIProvider | null {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    return new GeminiProvider(geminiKey, process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL);
  }
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    return new OpenAIProvider(openaiKey, process.env.OPENAI_MODEL || "gpt-4o-mini");
  }
  return null;
}

export function isAIConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
}

export function configuredProviderName(): string | null {
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  return null;
}
