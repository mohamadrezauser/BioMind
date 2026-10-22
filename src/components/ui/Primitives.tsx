import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import type { MasteryLevel } from "@/types";
import { levelLabel } from "@/learning/mastery";

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return <Tag className={cn("bm-surface p-5", className)}>{children}</Tag>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="bm-tag mb-2">{eyebrow}</p>}
        <h2 className="text-xl font-extrabold text-[var(--color-text)] sm:text-2xl">{title}</h2>
        {description && <p className="mt-1 max-w-2xl text-sm text-[var(--color-text-muted)]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ProgressBar({
  value,
  label,
  showValue = true,
}: {
  value: number;
  label?: string;
  showValue?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <span>{label}</span>
          {showValue && <span className="font-bold text-[var(--color-teal-deep)]">{Math.round(clamped)}٪</span>}
        </div>
      )}
      <div
        className="bm-progress-track h-2.5 w-full"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className="bm-progress-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

export function MasteryBadge({ level }: { level: MasteryLevel }) {
  const styles: Record<MasteryLevel, string> = {
    unknown: "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]",
    weak: "bg-[var(--color-danger)]/15 text-[var(--color-danger)]",
    developing: "bg-[var(--color-warning)]/20 text-[#8a6410]",
    proficient: "bg-[var(--color-teal)]/15 text-[var(--color-teal-deep)]",
    mastered: "bg-[var(--color-success)]/15 text-[var(--color-success)]",
  };
  const icons: Record<MasteryLevel, string> = {
    unknown: "◌",
    weak: "⚠",
    developing: "↗",
    proficient: "✓",
    mastered: "★",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold", styles[level])}>
      <span aria-hidden="true">{icons[level]}</span>
      {levelLabel(level)}
    </span>
  );
}

export function EmptyState({ icon = "📭", title, description }: { icon?: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] px-6 py-10 text-center">
      <span aria-hidden="true" className="text-3xl">
        {icon}
      </span>
      <p className="font-bold text-[var(--color-text)]">{title}</p>
      <p className="max-w-sm text-sm text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "success" | "warning" | "danger";
  title: string;
  children: ReactNode;
}) {
  const toneClasses: Record<string, string> = {
    info: "border-[var(--color-teal)]/40 bg-[var(--color-teal)]/10",
    success: "border-[var(--color-success)]/40 bg-[var(--color-success)]/10",
    warning: "border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10",
    danger: "border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10",
  };
  return (
    <div className={cn("rounded-xl border p-4 text-sm", toneClasses[tone])} role="status">
      <p className="mb-1 font-bold text-[var(--color-text)]">{title}</p>
      <div className="text-[var(--color-text-muted)]">{children}</div>
    </div>
  );
}

/** A colored icon container used for games, features, and achievements so every
 * illustration-style icon sits inside a consistent, purposeful shape. */
export function IconTile({
  icon,
  tone = "teal",
  size = "md",
  className,
}: {
  icon: ReactNode;
  tone?: "teal" | "purple" | "gold" | "rose" | "navy" | "success";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const toneClasses: Record<string, string> = {
    teal: "bg-[var(--color-teal)]/15 text-[var(--color-teal-deep)]",
    purple: "bg-[var(--color-purple)]/15 text-[var(--color-purple-deep)]",
    gold: "bg-[var(--color-gold)]/20 text-[var(--color-gold-deep)]",
    rose: "bg-[var(--color-rose)]/15 text-[var(--color-rose)]",
    navy: "bg-[var(--color-navy)]/10 text-[var(--color-navy)]",
    success: "bg-[var(--color-success)]/15 text-[var(--color-success)]",
  };
  const sizeClasses: Record<string, string> = {
    sm: "h-9 w-9 text-lg",
    md: "h-12 w-12 text-2xl",
    lg: "h-16 w-16 text-3xl",
  };
  return (
    <span aria-hidden="true" className={cn("bm-icon-tile", toneClasses[tone], sizeClasses[size], className)}>
      {icon}
    </span>
  );
}

export function DifficultyBadge({ level }: { level: "beginner" | "intermediate" | "advanced" }) {
  const labels: Record<string, string> = { beginner: "ساده", intermediate: "متوسط", advanced: "دشوار" };
  const classes: Record<string, string> = {
    beginner: "bm-chip bm-chip-beginner",
    intermediate: "bm-chip bm-chip-intermediate",
    advanced: "bm-chip bm-chip-advanced",
  };
  return <span className={classes[level]}>⚡ {labels[level]}</span>;
}

export function Chip({
  children,
  tone = "neutral",
  icon,
}: {
  children: ReactNode;
  tone?: "neutral" | "purple" | "beginner" | "intermediate" | "advanced";
  icon?: ReactNode;
}) {
  const toneClass =
    tone === "neutral"
      ? "bm-chip bm-chip-neutral"
      : tone === "purple"
        ? "bm-chip bm-chip-purple"
        : `bm-chip bm-chip-${tone}`;
  return (
    <span className={toneClass}>
      {icon}
      {children}
    </span>
  );
}

/** Filter pill used in list/filter bars (e.g. Game Center). Keep accessible
 * toggle semantics via aria-pressed instead of relying on color alone. */
export function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className="bm-pill bm-focus" aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  );
}

export function StatCard({
  icon,
  label,
  value,
  hint,
  tone = "teal",
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "teal" | "purple" | "gold" | "rose" | "navy" | "success";
}) {
  return (
    <Card className="flex items-start gap-3">
      <IconTile icon={icon} tone={tone} />
      <div className="min-w-0">
        <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
        <p className="mt-0.5 truncate text-2xl font-extrabold text-[var(--color-text)]">{value}</p>
        {hint && <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">{hint}</p>}
      </div>
    </Card>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn("bm-skeleton", className)} aria-hidden="true" />;
}

export function AchievementBadgeCard({
  icon,
  title,
  description,
  unlocked,
  unlockedAt,
}: {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}) {
  return (
    <Card
      className={cn(
        "flex items-start gap-3 transition-opacity",
        unlocked ? "bm-badge-pop border-[var(--color-gold)]/50" : "opacity-60"
      )}
    >
      <IconTile icon={icon} tone={unlocked ? "gold" : "navy"} size="md" />
      <div className="min-w-0">
        <p className="text-sm font-extrabold text-[var(--color-text)]">{title}</p>
        <p className="mt-1 text-xs leading-6 text-[var(--color-text-muted)]">{description}</p>
        {unlocked ? (
          <span className="mt-1 inline-block text-[11px] font-bold text-[var(--color-gold-deep)]">
            🏆 کسب‌شده{unlockedAt ? ` · ${unlockedAt}` : ""}
          </span>
        ) : (
          <span className="mt-1 inline-block text-[11px] font-bold text-[var(--color-text-muted)]">🔒 هنوز قفل است</span>
        )}
      </div>
    </Card>
  );
}
