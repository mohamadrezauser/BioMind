"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Reading the persisted theme must happen after mount (localStorage is a
    // client-only, external system) and intentionally overrides the SSR-safe
    // "light" default to avoid a server/client markup mismatch.
    const stored = window.localStorage.getItem("biomind.theme") as "light" | "dark" | null;
    const initial = stored ?? "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from an external system (localStorage) on mount
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("biomind.theme", next);
    } catch {
      // ignore storage failures silently; theme still applies for this session
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="bm-btn bm-btn-secondary bm-focus !px-3 !py-2 text-sm"
      aria-label={theme === "light" ? "فعال‌سازی حالت تیره" : "فعال‌سازی حالت روشن"}
      title={theme === "light" ? "حالت تیره" : "حالت روشن"}
    >
      <span aria-hidden="true">{theme === "light" ? "🌙" : "☀️"}</span>
      <span className="hidden sm:inline">{theme === "light" ? "تیره" : "روشن"}</span>
    </button>
  );
}
