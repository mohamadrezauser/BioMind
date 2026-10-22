import { db } from "@/db";
import { progressSnapshots } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/server/auth";

export const dynamic = "force-dynamic";

// Server-trusted persistence for the student's adaptive-learning state.
// Authorization: only the authenticated user may read or write their own
// snapshot. The client never supplies a user id — it is derived solely from
// the verified session cookie.

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ authenticated: false, state: null });
  }

  const rows = await db
    .select({ state: progressSnapshots.state, updatedAt: progressSnapshots.updatedAt })
    .from(progressSnapshots)
    .where(eq(progressSnapshots.userId, user.id))
    .limit(1);

  return Response.json({
    authenticated: true,
    state: rows[0]?.state ?? null,
    updatedAt: rows[0]?.updatedAt ?? null,
  });
}

const MAX_BODY_BYTES = 500_000; // generous but bounded; the app state is plain JSON

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "برای ذخیره پیشرفت باید وارد حساب کاربری شوی." }, { status: 401 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ error: "حجم داده بیش از حد مجاز است." }, { status: 413 });
  }

  let body: { state?: unknown };
  try {
    body = JSON.parse(raw) as { state?: unknown };
  } catch {
    return Response.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  if (!body.state || typeof body.state !== "object") {
    return Response.json({ error: "داده پیشرفت نامعتبر است." }, { status: 400 });
  }

  await db
    .insert(progressSnapshots)
    .values({ userId: user.id, state: body.state, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: progressSnapshots.userId,
      set: { state: body.state, updatedAt: new Date() },
    });

  return Response.json({ ok: true });
}
