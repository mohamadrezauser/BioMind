"use client";

import { cn } from "@/utils/cn";

export function VillusDiagram({
  highlightRoute,
  showLabels,
}: {
  highlightRoute: "blood_capillary" | "lymph" | null;
  showLabels: boolean;
}) {
  const bloodActive = highlightRoute === "blood_capillary";
  const lymphActive = highlightRoute === "lymph";

  return (
    <div className="mx-auto w-full max-w-md">
      <svg viewBox="0 0 220 220" className="h-auto w-full" role="img" aria-label="برش ساده‌شده یک پُرز روده باریک">
        {/* intestinal lumen */}
        <rect x="0" y="0" width="220" height="38" fill="var(--color-surface-muted)" />
        {showLabels && (
          <text x="110" y="20" textAnchor="middle" fontSize="10" fill="var(--color-text-muted)" fontWeight="700">
            لومن روده (محل مواد غذایی هضم‌شده)
          </text>
        )}

        {/* villus body */}
        <path
          d="M70 38 C70 90 75 140 90 175 C95 190 125 190 130 175 C145 140 150 90 150 38 Z"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="2"
        />
        {/* epithelial border with microvilli hint */}
        <path
          d="M72 40 C72 44 148 44 148 40"
          fill="none"
          stroke="var(--color-teal)"
          strokeWidth="2"
          strokeDasharray="2 2"
        />

        {/* blood capillary network */}
        <path
          d="M88 60 C80 90 80 140 96 168"
          fill="none"
          stroke={bloodActive ? "#d6563c" : "#d6563c55"}
          strokeWidth={bloodActive ? 5 : 3}
        />
        <path
          d="M132 60 C140 90 140 140 124 168"
          fill="none"
          stroke={bloodActive ? "#d6563c" : "#d6563c55"}
          strokeWidth={bloodActive ? 5 : 3}
        />

        {/* lacteal (lymph vessel) central */}
        <path
          d="M110 55 L110 172"
          fill="none"
          stroke={lymphActive ? "#d6a53c" : "#d6a53c55"}
          strokeWidth={lymphActive ? 7 : 4}
          strokeLinecap="round"
        />

        {showLabels && (
          <>
            <text x="60" y="130" textAnchor="middle" fontSize="9" fill="#d6563c" fontWeight="700">
              مویرگ خونی
            </text>
            <text x="160" y="130" textAnchor="middle" fontSize="9" fill="#b98a22" fontWeight="700">
              مویرگ لنفی (لاکتیل)
            </text>
          </>
        )}
      </svg>
      <p className="mt-1 text-center text-[11px] text-[var(--color-text-muted)]">
        نمایش شماتیک یک پُرز روده باریک — برای سادگی، فقط دو مسیر اصلی انتقال نشان داده شده است.
      </p>
    </div>
  );
}

export function RouteBadge({ route }: { route: "blood_capillary" | "lymph" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
        route === "blood_capillary"
          ? "bg-[#d6563c]/15 text-[#d6563c]"
          : "bg-[#d6a53c]/20 text-[#8a6410]"
      )}
    >
      <span aria-hidden="true">{route === "blood_capillary" ? "🩸" : "🟡"}</span>
      {route === "blood_capillary" ? "مویرگ خونی" : "مویرگ لنفی (لاکتیل)"}
    </span>
  );
}
