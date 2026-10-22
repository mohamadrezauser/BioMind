// Provider-independent contracts for optional AI-enhanced tutoring.
// The app must work fully without any of this (see learning/tutorEngine.ts).

export interface AIExplainRequest {
  conceptTitle: string;
  conceptExplanation: string;
  misconceptionBelief?: string;
  studentAnswerSummary?: string;
}

export interface AIExplainResult {
  explanation: string;
  encouragement: string;
}

export interface AIProvider {
  readonly name: string;
  explainConcept(req: AIExplainRequest): Promise<AIExplainResult>;
}

export function isValidAIExplainResult(value: unknown): value is AIExplainResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.explanation === "string" &&
    v.explanation.trim().length > 0 &&
    v.explanation.length < 4000 &&
    typeof v.encouragement === "string" &&
    v.encouragement.length < 500
  );
}
