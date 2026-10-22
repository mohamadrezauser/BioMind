"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_GROUPS, MOBILE_PRIMARY_ITEMS } from "@/content/nav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/utils/cn";
import { useAppState } from "@/hooks/useAppState";
import { overallProgress } from "@/learning/mastery";
import { useAuth } from "@/hooks/useAuth";
import { AccountWidget } from "@/components/AccountWidget";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { state, storageOk, cloudSynced } = useAppState();
  const { status } = useAuth();
  const progress = overallProgress(state.mastery);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#bm-main" className="bm-skip-link">
        رفتن به محتوای اصلی
      </a>
      
      <div className="flex flex-1 flex-col lg:flex-row">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:border-l lg:border-[var(--color-border)] lg:bg-[var(--color-bg-elevated)] lg:px-4 lg:py-6">
        <Brand />
        <nav className="mt-6 flex flex-1 flex-col gap-4 overflow-y-auto bm-scrollbar" aria-label="ناوبری اصلی">
          {NAV_GROUPS.map((group) => (
            <div key={group.id}>
              <p className="mb-1 px-3 text-[11px] font-bold uppercase tracking-wide text-[var(--color-muted)]">
                {group.label}
              </p>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "bm-focus flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-[var(--color-teal)]/15 text-[var(--color-teal-deep)]"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
                    )}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    <span aria-hidden="true" className="text-lg">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-4 rounded-xl bg-[var(--color-surface-muted)] p-3">
          <p className="text-xs text-[var(--color-text-muted)]">پیشرفت کلی یادگیری</p>
          <div className="bm-progress-track mt-2 h-2 w-full" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="bm-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-xs font-bold text-[var(--color-teal-deep)]">{progress}٪ تکمیل‌شده</p>
        </div>
        {!storageOk && (
          <p className="mt-3 rounded-lg bg-[var(--color-warning)]/15 p-2 text-[11px] text-[var(--color-text-muted)]">
            ذخیره‌سازی محلی در دسترس نیست؛ پیشرفت شما پس از بستن صفحه ذخیره نخواهد شد.
          </p>
        )}
        {status === "authenticated" && (
          <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
            {cloudSynced ? "☁️ پیشرفت در حساب کاربری ذخیره می‌شود" : "⏳ در حال همگام‌سازی با حساب کاربری…"}
          </p>
        )}
        <div className="mt-4 border-t border-[var(--color-border)] pt-4">
          <AccountWidget />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]/95 px-4 py-3 backdrop-blur lg:hidden">
        <Brand compact />
        <div className="flex items-center gap-2">
          <AccountWidget compact />
          <ThemeToggle />
          <button
            type="button"
            className="bm-btn bm-btn-secondary bm-focus !px-3 !py-2"
            aria-expanded={menuOpen}
            aria-controls="bm-mobile-menu"
            aria-label="باز کردن منو"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav
          id="bm-mobile-menu"
          className="fixed inset-x-0 top-[57px] z-30 max-h-[75dvh] overflow-y-auto border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 shadow-lg lg:hidden"
          aria-label="ناوبری موبایل"
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.id} className="mb-2">
              <p className="mb-1 px-3 text-[11px] font-bold uppercase tracking-wide text-[var(--color-muted)]">
                {group.label}
              </p>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "bm-focus flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                    isActive(item.href)
                      ? "bg-[var(--color-teal)]/15 text-[var(--color-teal-deep)]"
                      : "text-[var(--color-text-muted)]"
                  )}
                >
                  <span aria-hidden="true" className="text-lg">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>
      )}

      <div className="hidden items-center justify-end gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-3 lg:flex">
        <ThemeToggle />
      </div>

      <main id="bm-main" className="flex-1 pb-20 lg:pb-8">
        {children}
      </main>
      </div>
</div>

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-4 pb-20 text-center text-xs text-[var(--color-text-muted)] lg:pb-4">
        <p>BioMind — آزمایشگاه هوشمند زیست‌شناسی دهم · ساخته‌شده برای یادگیری عمیق‌تر فصل گوارش و جذب مواد</p>
      </footer>

      {/* Mobile bottom tab bar for the most important actions */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]/97 backdrop-blur lg:hidden"
        aria-label="دسترسی سریع"
      >
        {MOBILE_PRIMARY_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "bm-focus flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
              isActive(item.href) ? "text-[var(--color-teal-deep)]" : "text-[var(--color-text-muted)]"
            )}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            <span aria-hidden="true" className="text-base">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="bm-focus flex items-center gap-2 rounded-xl">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-teal)] text-lg text-white shadow"
      >
        🧫
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-extrabold text-[var(--color-text)]">BioMind</span>
        {!compact && (
          <span className="text-[11px] text-[var(--color-text-muted)]">آزمایشگاه هوشمند زیست‌شناسی</span>
        )}
      </span>
    </Link>
  );
}
