import { db } from "@/db";
import { examAttempts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSessionUser } from "@/server/auth";
import { rateLimit, clientKeyFromRequest } from "@/server/rateLimit";

export const dynamic = "force-dynamic";

interface Body {
  examMode?: unknown;
  config?: unknown;
  results?: unknown;
  scorePercent?: unknown;
  correctCount?: unknown;
  incorrectCount?: unknown;
  unansweredCount?: unknown;
  timedOutCount?: unknown;
  totalQuestions?: unknown;
  durationSeconds?: unknown;
  guestId?: unknown;
}

function num(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  const rl = rateLimit(clientKeyFromRequest(request, user?.id ?? "guest-exam"), 60, 10 * 60 * 1000);
  if (!rl.allowed) {
    return Response.json({ error: "تعداد درخواست‌ها بیش از حد مجاز است." }, { status: 429 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  if (typeof body.examMode !== "string" || !body.config || !body.results) {
    return Response.json({ error: "داده آزمون ناقص است." }, { status: 400 });
  }

  const [row] = await db
    .insert(examAttempts)
    .values({
      userId: user?.id ?? null,
      guestId: user ? null : typeof body.guestId === "string" ? body.guestId.slice(0, 100) : null,
      examMode: body.examMode,
      config: body.config,
      results: body.results,
      scorePercent: num(body.scorePercent),
      correctCount: num(body.correctCount),
      incorrectCount: num(body.incorrectCount),
      unansweredCount: num(body.unansweredCount),
      timedOutCount: num(body.timedOutCount),
      totalQuestions: num(body.totalQuestions),
      durationSeconds: num(body.durationSeconds),
    })
    .returning({ id: examAttempts.id, createdAt: examAttempts.createdAt });

  return Response.json({ ok: true, attempt: row });
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ attempts: [] });

  const rows = await db
    .select()
    .from(examAttempts)
    .where(eq(examAttempts.userId, user.id))
    .orderBy(desc(examAttempts.createdAt))
    .limit(20);

  return Response.json({ attempts: rows });
}
