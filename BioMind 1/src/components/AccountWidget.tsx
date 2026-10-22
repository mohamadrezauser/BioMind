"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function AccountWidget({ compact = false }: { compact?: boolean }) {
  const { user, status, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  if (status === "loading") {
    return <span className="text-xs text-[var(--color-text-muted)]">در حال بررسی ورود…</span>;
  }

  if (!user) {
    return (
      <Link
        href="/auth"
        className="bm-focus rounded-lg border border-[var(--color-teal)]/50 px-3 py-1.5 text-xs font-bold text-[var(--color-teal-deep)] hover:bg-[var(--color-teal)]/10"
      >
        ورود / ثبت‌نام
      </Link>
    );
  }

  return (
    <div className={compact ? "flex items-center gap-2" : "flex flex-col gap-1"}>
      <span className="text-xs font-bold text-[var(--color-text)]">👤 {user.displayName}</span>
      <button
        type="button"
        disabled={loggingOut}
        className="bm-focus w-fit rounded-lg border border-[var(--color-border)] px-2 py-1 text-[11px] text-[var(--color-text-muted)] hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]"
        onClick={async () => {
          setLoggingOut(true);
          await logout();
          setLoggingOut(false);
        }}
      >
        خروج از حساب
      </button>
    </div>
  );
}
