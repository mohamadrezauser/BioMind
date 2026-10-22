"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, SectionHeading, Callout } from "@/components/ui/Primitives";
import { useAuth } from "@/hooks/useAuth";

export default function AuthPage() {
  const { user, login, register, error, clearError } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-center">
        <SectionHeading title="تو وارد حساب کاربری‌ات شده‌ای" eyebrow="حساب کاربری" />
        <p className="text-sm text-[var(--color-text-muted)]">
          خوش آمدی {user.displayName}! پیشرفت تو از این پس در حساب کاربری‌ات ذخیره می‌شود.
        </p>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    clearError();
    const ok =
      mode === "login" ? await login({ email, password }) : await register({ email, password, displayName });
    setSubmitting(false);
    if (ok) router.push("/");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <SectionHeading
        eyebrow="حساب کاربری"
        title={mode === "login" ? "ورود به BioMind" : "ساخت حساب کاربری"}
        description="با حساب کاربری، پیشرفت یادگیری‌ات روی هر دستگاهی که وارد شوی ذخیره می‌ماند. بدون حساب هم می‌توانی به‌صورت مهمان از BioMind استفاده کنی؛ پیشرفت مهمان فقط روی همین مرورگر ذخیره می‌شود."
      />

      <Card>
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              clearError();
            }}
            className={`bm-focus flex-1 rounded-lg border px-3 py-2 text-sm font-bold ${
              mode === "login" ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10" : "border-[var(--color-border)] text-[var(--color-text-muted)]"
            }`}
          >
            ورود
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              clearError();
            }}
            className={`bm-focus flex-1 rounded-lg border px-3 py-2 text-sm font-bold ${
              mode === "register" ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10" : "border-[var(--color-border)] text-[var(--color-text-muted)]"
            }`}
          >
            ثبت‌نام
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          {mode === "register" && (
            <label className="flex flex-col gap-1 text-xs font-bold text-[var(--color-text-muted)]">
              نام نمایشی
              <input
                required
                maxLength={60}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bm-focus rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
                placeholder="مثلاً: سارا محمدی"
              />
            </label>
          )}
          <label className="flex flex-col gap-1 text-xs font-bold text-[var(--color-text-muted)]">
            ایمیل
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bm-focus rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
              placeholder="example@email.com"
              dir="ltr"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold text-[var(--color-text-muted)]">
            رمز عبور
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bm-focus rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
              placeholder="حداقل ۶ کاراکتر"
              dir="ltr"
            />
          </label>

          {error && <Callout tone="danger" title="خطا">{error}</Callout>}

          <button type="submit" disabled={submitting} className="bm-btn bm-btn-primary bm-focus mt-1 text-sm">
            {submitting ? "در حال ارسال…" : mode === "login" ? "ورود" : "ساخت حساب"}
          </button>
        </form>
      </Card>

      <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
        اطلاعات تو فقط برای ذخیره پیشرفت یادگیری استفاده می‌شود و در اختیار هیچ شخص ثالثی قرار نمی‌گیرد.
      </p>
    </div>
  );
}
