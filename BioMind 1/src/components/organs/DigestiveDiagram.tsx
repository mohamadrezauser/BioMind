"use client";

import { ORGANS } from "@/content/organs";
import { cn } from "@/utils/cn";

export interface OrganHotspot {
  id: string;
  xPct: number;
  yPct: number;
}

// Positions are approximate/schematic (educational diagram, not medical imaging).
export const ORGAN_HOTSPOTS: OrganHotspot[] = [
  { id: "mouth", xPct: 50, yPct: 5 },
  { id: "teeth_tongue", xPct: 35, yPct: 6.5 },
  { id: "salivary_glands", xPct: 65, yPct: 6.5 },
  { id: "pharynx", xPct: 50, yPct: 11 },
  { id: "esophagus", xPct: 50, yPct: 20 },
  { id: "liver", xPct: 68, yPct: 29 },
  { id: "gallbladder", xPct: 70, yPct: 36 },
  { id: "stomach", xPct: 36, yPct: 32 },
  { id: "pancreas", xPct: 50, yPct: 40 },
  { id: "small_intestine", xPct: 48, yPct: 58 },
  { id: "large_intestine", xPct: 76, yPct: 56 },
  { id: "rectum", xPct: 50, yPct: 83 },
  { id: "anus", xPct: 50, yPct: 91 },
];

const PROCESS_COLOR: Record<string, string> = {
  mechanical: "#3f7fb0",
  chemical: "#0f9b8e",
  absorption: "#4caf6e",
  elimination: "#9c8a5c",
  transport: "#8a6fd1",
};

function colorForOrgan(organId: string): string {
  const organ = ORGANS.find((o) => o.id === organId);
  if (!organ) return "#8aa0a8";
  return PROCESS_COLOR[organ.processes[0]] ?? "#8aa0a8";
}

export function DigestiveDiagram({
  selectedOrgan,
  onSelect,
  showLabels,
  highlightIds,
}: {
  selectedOrgan: string | null;
  onSelect: (organId: string) => void;
  showLabels: boolean;
  highlightIds?: string[];
}) {
  return (
    <div className="relative mx-auto aspect-[3/4.4] w-full max-w-sm select-none sm:max-w-md">
      <svg
        viewBox="0 0 100 146"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        {/* torso silhouette */}
        <path
          d="M30 2 Q50 -4 70 2 L78 30 Q84 60 80 95 Q78 120 68 140 L32 140 Q22 120 20 95 Q16 60 22 30 Z"
          fill="var(--color-surface-muted)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        {/* GI tract path: mouth -> pharynx -> esophagus -> stomach -> small intestine -> large intestine -> rectum/anus */}
        <path
          d="M50 7 L50 16 L50 29 Q50 33 42 36 Q30 40 32 46 Q34 54 46 55 Q62 56 62 64 Q62 72 48 73 Q34 74 34 82 Q34 90 48 91 Q64 92 66 82 L74 82 Q78 82 78 78 L78 60 Q78 50 70 48 L50 58 Q58 70 50 78 Q40 86 50 95 L50 121 L50 133"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.35"
        />
        {ORGAN_HOTSPOTS.map((h) => {
          const isHighlighted = highlightIds?.includes(h.id);
          const isSelected = selectedOrgan === h.id;
          return (
            <circle
              key={h.id}
              cx={h.xPct}
              cy={h.yPct * 1.46}
              r={isSelected ? 6.2 : 5}
              fill={colorForOrgan(h.id)}
              opacity={isHighlighted || isSelected ? 1 : 0.75}
              stroke={isSelected ? "var(--color-navy)" : "white"}
              strokeWidth={isSelected ? 1.4 : 0.8}
            />
          );
        })}
      </svg>

      {ORGAN_HOTSPOTS.map((h) => {
        const organ = ORGANS.find((o) => o.id === h.id)!;
        const isSelected = selectedOrgan === h.id;
        return (
          <button
            key={h.id}
            type="button"
            onClick={() => onSelect(h.id)}
            className={cn(
              "bm-focus absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center",
              "min-h-[28px] min-w-[28px] rounded-full"
            )}
            style={{ left: `${h.xPct}%`, top: `${h.yPct}%` }}
            aria-pressed={isSelected}
            aria-label={`${organ.name}: مشاهده جزئیات`}
          >
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold text-white shadow sm:h-7 sm:w-7",
                isSelected ? "scale-125 border-[var(--color-navy)]" : "border-white"
              )}
              style={{ background: colorForOrgan(h.id) }}
            >
              {isSelected ? "●" : ""}
            </span>
            {showLabels && (
              <span className="mt-0.5 whitespace-nowrap rounded-md bg-[var(--color-bg-elevated)]/95 px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-text)] shadow">
                {organ.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function ProcessLegend() {
  const entries: Array<[string, string]> = [
    ["mechanical", "گوارش مکانیکی"],
    ["chemical", "گوارش شیمیایی"],
    ["absorption", "جذب"],
    ["elimination", "دفع"],
    ["transport", "انتقال"],
  ];
  return (
    <ul className="flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)]">
      {entries.map(([key, label]) => (
        <li key={key} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: PROCESS_COLOR[key] }}
          />
          {label}
        </li>
      ))}
    </ul>
  );
}
