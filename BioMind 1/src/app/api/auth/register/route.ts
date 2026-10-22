import { db } from "@/db";
import { users, progressSnapshots } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession, hashPassword, isValidEmail } from "@/server/auth";
import { rateLimit, clientKeyFromRequest } from "@/server/rateLimit";

export const dynamic = "force-dynamic";

interface Body {
  email?: unknown;
  password?: unknown;
  displayName?: unknown;
}

export async function POST(request: Request) {
  const rl = rateLimit(clientKeyFromRequest(request, "register"), 10, 10 * 60 * 1000);
  if (!rl.allowed) {
    return Response.json({ error: "تعداد تلاش‌ها بیش از حد مجاز است. کمی بعد دوباره امتحان کن." }, { status: 429 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";

  if (!isValidEmail(email)) {
    return Response.json({ error: "ایمیل معتبر نیست." }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json({ error: "رمز عبور باید حداقل ۶ کاراکتر باشد." }, { status: 400 });
  }
  if (!displayName || displayName.length > 60) {
    return Response.json({ error: "نام نمایشی را وارد کن (حداکثر ۶۰ نویسه)." }, { status: 400 });
  }

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return Response.json({ error: "حسابی با این ایمیل قبلاً ساخته شده است." }, { status: 409 });
  }

  const passwordHash = hashPassword(password);
  const [created] = await db
    .insert(users)
    .values({ email, passwordHash, displayName, role: "student" })
    .returning({ id: users.id, email: users.email, displayName: users.displayName, role: users.role });

  await db.insert(progressSnapshots).values({ userId: created.id, state: null }).catch(() => undefined);

  await createSession(created.id);

  return Response.json({ user: created });
}
