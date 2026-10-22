"use client";

import { useAIStatus } from "@/hooks/useAIStatus";

export function DemoModeBanner({ compact = false }: { compact?: boolean }) {
  const { available, loading } = useAIStatus();

  if (loading || available) return null;

  return (
    <div
      className="flex items-start gap-3 rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 p-3 text-sm"
      role="status"
    >
      <span aria-hidden="true" className="mt-0.5 text-lg">
        🧪
      </span>
      <div>
        <p className="font-bold text-[var(--color-text)]">حالت نمایشی (بدون اتصال به هوش مصنوعی خارجی)</p>
        {!compact && (
          <p className="mt-0.5 text-[var(--color-text-muted)]">
            معلم هوشمند BioMind در حال حاضر با «موتور تطبیقی قانون‌محور» داخلی کار می‌کند که کاملاً عملکردی است و
            بر اساس پاسخ‌های واقعی تو راهبرد تدریس را تغییر می‌دهد. برای فعال‌سازی توضیح‌های تولیدشده با مدل‌های
            زبانی، کلید اتصال سرویس هوش مصنوعی باید در پیکربندی سرور تنظیم شود.
          </p>
        )}
      </div>
    </div>
  );
}
