import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession, verifyPassword } from "@/server/auth";
import { rateLimit, clientKeyFromRequest } from "@/server/rateLimit";

export const dynamic = "force-dynamic";

interface Body {
  email?: unknown;
  password?: unknown;
}

export async function POST(request: Request) {
  const rl = rateLimit(clientKeyFromRequest(request, "login"), 15, 10 * 60 * 1000);
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

  if (!email || !password) {
    return Response.json({ error: "ایمیل و رمز عبور را وارد کن." }, { status: 400 });
  }

  const rows = await db
    .select({ id: users.id, email: users.email, displayName: users.displayName, role: users.role, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = rows[0];
  // Generic error message to avoid leaking which emails are registered.
  const invalid = () => Response.json({ error: "ایمیل یا رمز عبور نادرست است." }, { status: 401 });

  if (!user) return invalid();
  if (!verifyPassword(password, user.passwordHash)) return invalid();

  await createSession(user.id);

  return Response.json({
    user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role },
  });
}
