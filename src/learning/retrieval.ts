// Lightweight curriculum-grounded retrieval used by the AI tutor chat.
// Deliberately simple (keyword scoring, no external vector DB) so it stays
// fully transparent and auditable: every fact the model is given comes
// straight from the reviewed content files in src/content.

import { CONCEPTS } from "@/content/concepts";
import { MISCONCEPTIONS } from "@/content/misconceptions";
import type { ConceptDefinition, MisconceptionDefinition } from "@/types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u200c]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ");
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function score(queryTokens: string[], haystack: string): number {
  const normalizedHay = normalize(haystack);
  let total = 0;
  for (const token of queryTokens) {
    if (token.length < 2) continue;
    if (normalizedHay.includes(token)) total += token.length; // longer matches weigh more
  }
  return total;
}

export interface RetrievedContext {
  concepts: ConceptDefinition[];
  misconceptions: MisconceptionDefinition[];
}

export function retrieveRelevantContext(query: string, limit = 3): RetrievedContext {
  const tokens = tokenize(query);

  const rankedConcepts = CONCEPTS.map((c) => ({
    concept: c,
    s: score(tokens, `${c.title} ${c.shortTitle ?? ""} ${c.explanation} ${c.analogy ?? ""}`),
  }))
    .sort((a, b) => b.s - a.s)
    .filter((r) => r.s > 0)
    .slice(0, limit)
    .map((r) => r.concept);

  const rankedMisconceptions = MISCONCEPTIONS.map((m) => ({
    mis: m,
    s: score(tokens, `${m.title} ${m.belief} ${m.targetedExplanation}`),
  }))
    .sort((a, b) => b.s - a.s)
    .filter((r) => r.s > 0)
    .slice(0, 2)
    .map((r) => r.mis);

  // Fall back to the most central concepts if nothing matched, so the tutor
  // always has some grounded material rather than answering from nothing.
  const concepts = rankedConcepts.length > 0 ? rankedConcepts : CONCEPTS.slice(0, 2);

  return { concepts, misconceptions: rankedMisconceptions };
}

export function formatContextForPrompt(context: RetrievedContext): string {
  const conceptBlocks = context.concepts.map(
    (c) =>
      `مفهوم: ${c.title}\nتوضیح تأییدشده: ${c.explanation}\nتشبیه: ${c.analogy ?? "—"}\nیادداشت منبع: ${c.sourceNote}`
  );
  const misconceptionBlocks = context.misconceptions.map(
    (m) => `برداشت نادرست رایج: ${m.belief}\nاصلاح صحیح: ${m.targetedExplanation}`
  );
  return [...conceptBlocks, ...misconceptionBlocks].join("\n\n");
}
