"use client";

import { useEffect, useMemo, useState } from "react";
import { DigestiveDiagram, ProcessLegend } from "@/components/organs/DigestiveDiagram";
import { ORGAN_MAP, ORGANS, MAIN_PATHWAY_ORDER, ACCESSORY_ORGANS } from "@/content/organs";
import { Card, SectionHeading, Callout } from "@/components/ui/Primitives";
import { useAppState } from "@/hooks/useAppState";

const PROCESS_LABEL: Record<string, string> = {
  mechanical: "مکانیکی",
  chemical: "شیمیایی",
  absorption: "جذب",
  elimination: "دفع",
  transport: "انتقال",
};

export default function DigestiveSystemLabPage() {
  const { completeActivity } = useAppState();
  const [selected, setSelected] = useState<string>("mouth");
  const [showLabels, setShowLabels] = useState(true);
  const [guidedIndex, setGuidedIndex] = useState<number | null>(null);
  const [visited, setVisited] = useState<string[]>(["mouth"]);

  useEffect(() => {
    // Deep-linking from another page (e.g. ?organ=stomach) — read once on mount.
    const params = new URLSearchParams(window.location.search);
    const organ = params.get("organ");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from the URL (external system) on mount
    if (organ && ORGAN_MAP[organ]) setSelected(organ);
  }, []);

  useEffect(() => {
    completeActivity("lab_digestive_system_visited");
  }, [completeActivity]);

  const organ = ORGAN_MAP[selected];

  function selectOrgan(id: string) {
    setSelected(id);
    setVisited((prev) => (prev.includes(id) ? prev : [...prev, id]));
    if (visited.length + 1 >= ORGANS.length) {
      completeActivity("lab_digestive_system_all_organs");
    }
  }

  function startGuided() {
    setGuidedIndex(0);
    selectOrgan(MAIN_PATHWAY_ORDER[0]);
  }

  function stepGuided(delta: number) {
    if (guidedIndex === null) return;
    const next = Math.min(Math.max(guidedIndex + delta, 0), MAIN_PATHWAY_ORDER.length - 1);
    setGuidedIndex(next);
    selectOrgan(MAIN_PATHWAY_ORDER[next]);
  }

  const guidedProgress = useMemo(() => {
    if (guidedIndex === null) return null;
    return `مرحله ${guidedIndex + 1} از ${MAIN_PATHWAY_ORDER.length}`;
  }, [guidedIndex]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="آزمایشگاه تعاملی"
        title="کاوش دستگاه گوارش"
        description="روی هر اندام ضربه بزن یا کلیک کن تا نقش، ترشحات، آنزیم‌ها و مواد ورودی/خروجی آن را ببینی. مسیر راهنما هم می‌تواند تو را قدم‌به‌قدم همراهی کند."
      />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <ProcessLegend />
            <div className="flex gap-2">
              <button
                type="button"
                className="bm-btn bm-btn-secondary bm-focus text-xs"
                onClick={() => setShowLabels((v) => !v)}
                aria-pressed={showLabels}
              >
                {showLabels ? "پنهان‌کردن برچسب‌ها" : "نمایش برچسب‌ها"}
              </button>
            </div>
          </div>

          <DigestiveDiagram selectedOrgan={selected} onSelect={selectOrgan} showLabels={showLabels} />

          <div className="mt-4 rounded-xl bg-[var(--color-surface-muted)] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold text-[var(--color-text)]">مسیر راهنما</p>
              {guidedProgress && <span className="text-xs text-[var(--color-text-muted)]">{guidedProgress}</span>}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {guidedIndex === null ? (
                <button type="button" className="bm-btn bm-btn-primary bm-focus text-xs" onClick={startGuided}>
                  ▶ شروع مسیر راهنما از دهان
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="bm-btn bm-btn-secondary bm-focus text-xs"
                    onClick={() => stepGuided(-1)}
                    disabled={guidedIndex === 0}
                  >
                    ← مرحله قبل
                  </button>
                  <button
                    type="button"
                    className="bm-btn bm-btn-primary bm-focus text-xs"
                    onClick={() => stepGuided(1)}
                    disabled={guidedIndex === MAIN_PATHWAY_ORDER.length - 1}
                  >
                    مرحله بعد →
                  </button>
                  <button
                    type="button"
                    className="bm-btn bm-btn-ghost bm-focus text-xs"
                    onClick={() => setGuidedIndex(null)}
                  >
                    پایان مسیر راهنما
                  </button>
                </>
              )}
            </div>
          </div>
        </Card>

        <Card className="bm-fade-in" key={organ.id}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-extrabold text-[var(--color-text)]">{organ.name}</h3>
            {organ.scientificName && <span className="bm-tag">{organ.scientificName}</span>}
          </div>
          <p className="mt-3 text-sm leading-8 text-[var(--color-text-muted)]">{organ.summary}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {organ.processes.map((p) => (
              <span key={p} className="bm-tag">
                {PROCESS_LABEL[p]}
              </span>
            ))}
          </div>

          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-[var(--color-surface-muted)] p-3">
              <dt className="text-xs font-bold text-[var(--color-text-muted)]">ترشحات</dt>
              <dd className="mt-1 text-[var(--color-text)]">
                {organ.secretions.length ? organ.secretions.join("، ") : "—"}
              </dd>
            </div>
            <div className="rounded-lg bg-[var(--color-surface-muted)] p-3">
              <dt className="text-xs font-bold text-[var(--color-text-muted)]">آنزیم‌ها</dt>
              <dd className="mt-1 text-[var(--color-text)]">{organ.enzymes.length ? organ.enzymes.join("، ") : "—"}</dd>
            </div>
            <div className="rounded-lg bg-[var(--color-surface-muted)] p-3">
              <dt className="text-xs font-bold text-[var(--color-text-muted)]">ورودی</dt>
              <dd className="mt-1 text-[var(--color-text)]">{organ.incoming.join("، ")}</dd>
            </div>
            <div className="rounded-lg bg-[var(--color-surface-muted)] p-3">
              <dt className="text-xs font-bold text-[var(--color-text-muted)]">خروجی</dt>
              <dd className="mt-1 text-[var(--color-text)]">{organ.outgoing.join("، ")}</dd>
            </div>
          </dl>

          {organ.id === "large_intestine" && (
            <Callout tone="info" title="نکته مهم">
              برخلاف تصور رایج، جذب اصلی مواد مغذی (گلوکز، اسید آمینه) در روده بزرگ انجام نمی‌شود؛ این اتفاق پیش‌تر در
              روده باریک رخ داده است.
            </Callout>
          )}
          {organ.id === "liver" && (
            <div className="mt-3">
              <Callout tone="warning" title="آنزیم نیست!">
                صفرا یک ماده کمکی برای امولسیون‌سازی چربی است، نه یک آنزیم؛ هیچ پیوند شیمیایی را نمی‌شکند.
              </Callout>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-8">
        <SectionHeading eyebrow="فهرست کامل" title="همه اندام‌ها و غدد" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {[...MAIN_PATHWAY_ORDER, ...ACCESSORY_ORGANS].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => selectOrgan(id)}
              className={`bm-focus rounded-xl border px-3 py-3 text-sm font-bold transition-colors ${
                selected === id
                  ? "border-[var(--color-teal)] bg-[var(--color-teal)]/10 text-[var(--color-teal-deep)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-teal)]"
              }`}
              aria-pressed={selected === id}
            >
              {ORGAN_MAP[id].name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
