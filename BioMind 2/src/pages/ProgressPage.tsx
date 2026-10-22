import { CheckCircle2, Circle } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { ACCESSORY_ORDER, TRACT_ORDER, ALL_ORGAN_IDS } from "../three/organLayout";
import { ORGAN_EDUCATION } from "../data/organEducation";

export default function ProgressPage() {
  const visited = useAppStore((s) => s.progress.visitedOrgans);
  const quizAnswers = useAppStore((s) => s.progress.quizAnswers);
  const tourCompleted = useAppStore((s) => s.progress.tourCompleted);
  const journeyCompleted = useAppStore((s) => s.progress.journeyCompleted);

  const total = ALL_ORGAN_IDS.length;
  const visitedPct = Math.round((visited.length / total) * 100);
  const answered = Object.keys(quizAnswers).length;
  const correct = Object.values(quizAnswers).filter(Boolean).length;
  const quizPct = answered ? Math.round((correct / answered) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 md:px-8">
      <h1 className="text-2xl font-extrabold text-white">پیشرفت یادگیری من</h1>

      <section className="grid gap-4 sm:grid-cols-3">
        <ProgressRing label="مشاهده اندام‌ها" pct={visitedPct} sub={`${visited.length} از ${total}`} color="#22d3ee" />
        <ProgressRing label="دقت آزمون" pct={quizPct} sub={`${correct} صحیح از ${answered} پاسخ`} color="#34d399" />
        <div className="flex flex-col justify-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <StatusLine label="تور آموزشی هدایت‌شده" done={tourCompleted} />
          <StatusLine label="مسیر غذا" done={journeyCompleted} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-cyan-300">وضعیت مشاهده هر اندام</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[...TRACT_ORDER, ...ACCESSORY_ORDER].map((id) => (
            <div
              key={id}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm"
            >
              <span className="text-slate-300">{ORGAN_EDUCATION[id].nameFa}</span>
              {visited.includes(id) ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> مشاهده شده
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-slate-600">
                  <Circle className="h-4 w-4" /> مشاهده‌نشده
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProgressRing({ label, pct, sub, color }: { label: string; pct: number; sub: string; color: string }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div>
        <p className="text-xl font-bold text-white">{pct}%</p>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-[11px] text-slate-600">{sub}</p>
      </div>
    </div>
  );
}

function StatusLine({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-300">{label}</span>
      {done ? (
        <span className="flex items-center gap-1 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4" /> تکمیل‌شده
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs text-slate-600">
          <Circle className="h-4 w-4" /> ناتمام
        </span>
      )}
    </div>
  );
}
