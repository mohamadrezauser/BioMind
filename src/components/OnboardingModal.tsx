"use client";

import { useState } from "react";
import { useAppState } from "@/hooks/useAppState";

const STEPS = [
  {
    icon: "🧫",
    title: "به BioMind خوش آمدی!",
    body: "اینجا آزمایشگاه هوشمند زیست‌شناسی است؛ جایی برای یادگیری عمیق «گوارش و جذب مواد» با شبیه‌سازی، بازی و یک معلم هوشمند که خودش را با نحوه یادگیری تو تطبیق می‌دهد.",
  },
  {
    icon: "🤖",
    title: "معلم هوشمند، نه یک ربات تکراری",
    body: "وقتی به سؤالی اشتباه پاسخ می‌دهی، معلم هوشمند تلاش می‌کند بفهمد چه برداشت نادرستی داری، سپس روش تدریس را عوض می‌کند: گاهی مثال، گاهی تصویر، گاهی یک شبیه‌سازی.",
  },
  {
    icon: "🧪",
    title: "آزمایشگاه‌ها و بازی‌ها",
    body: "دستگاه گوارش را کاوش کن، مسیر غذا را دنبال کن، و با بازی‌های آموزشی (چیدن ترتیب اندام‌ها، جور کردن آنزیم‌ها و مسیر مواد مغذی) تمرین کن.",
  },
  {
    icon: "📊",
    title: "پیشرفت تو، فقط برای تو",
    body: "تمام پیشرفت به‌صورت ناشناس و فقط روی همین مرورگر ذخیره می‌شود؛ هیچ اطلاعات شخصی لازم نیست. هر زمان خواستی می‌توانی از صفحه «پیشرفت من» آن را پاک کنی.",
  },
];

export function OnboardingModal() {
  const { state, completeOnboarding } = useAppState();
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (state.onboardingComplete || dismissed) return null;

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="bm-fade-in w-full max-w-lg rounded-t-3xl bg-[var(--color-bg-elevated)] p-6 shadow-2xl sm:rounded-3xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-teal)]/15 text-2xl" aria-hidden="true">
            {current.icon}
          </span>
          <div className="flex gap-1" aria-hidden="true">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-6 rounded-full"
                style={{ background: i <= step ? "var(--color-teal)" : "var(--color-border)" }}
              />
            ))}
          </div>
        </div>
        <h2 id="onboarding-title" className="text-lg font-extrabold text-[var(--color-text)]">
          {current.title}
        </h2>
        <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">{current.body}</p>

        <div className="mt-6 flex items-center justify-between gap-2">
          <button
            type="button"
            className="bm-btn bm-btn-ghost bm-focus text-sm"
            onClick={() => {
              setDismissed(true);
              completeOnboarding();
            }}
          >
            رد کردن آموزش
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button type="button" className="bm-btn bm-btn-secondary bm-focus text-sm" onClick={() => setStep((s) => s - 1)}>
                قبلی
              </button>
            )}
            <button
              type="button"
              className="bm-btn bm-btn-primary bm-focus text-sm"
              onClick={() => {
                if (isLast) {
                  completeOnboarding();
                } else {
                  setStep((s) => s + 1);
                }
              }}
            >
              {isLast ? "شروع یادگیری" : "بعدی"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
