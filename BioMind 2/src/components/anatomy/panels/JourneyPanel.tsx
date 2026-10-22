import { Pause, Play, RotateCcw, SkipBack, SkipForward, Utensils } from "lucide-react";
import { useAppStore } from "../../../store/useAppStore";
import { TRACT_ORDER } from "../../../three/organLayout";
import { ORGAN_EDUCATION, ACCESSORY_NOTE } from "../../../data/organEducation";

export default function JourneyPanel() {
  const journey = useAppStore((s) => s.journey);
  const startJourney = useAppStore((s) => s.startJourney);
  const stopJourney = useAppStore((s) => s.stopJourney);
  const journeyTogglePlay = useAppStore((s) => s.journeyTogglePlay);
  const journeyRestart = useAppStore((s) => s.journeyRestart);
  const journeyNextStage = useAppStore((s) => s.journeyNextStage);
  const journeyPrevStage = useAppStore((s) => s.journeyPrevStage);
  const journeySetSpeed = useAppStore((s) => s.journeySetSpeed);

  if (!journey.active) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-10 text-center">
        <Utensils className="h-9 w-9 text-amber-400" />
        <p className="text-sm leading-7 text-slate-400">
          مسیر غذا را به‌صورت یک نشانگر متحرک دنبال کنید: دهان ← حلق ← مری ← معده ← روده باریک ← روده بزرگ ← راست‌روده
          ← کانال مقعدی ← مقعد.
        </p>
        <button
          onClick={startJourney}
          className="flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
        >
          <Play className="h-4 w-4" />
          شروع مسیر غذا
        </button>
      </div>
    );
  }

  const currentId = TRACT_ORDER[journey.stageIndex];
  const edu = ORGAN_EDUCATION[currentId];
  const progressPct = ((journey.stageIndex + journey.localT) / TRACT_ORDER.length) * 100;

  return (
    <div className="scroll-thin h-full space-y-4 overflow-y-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          مرحله {journey.stageIndex + 1} از {TRACT_ORDER.length}: {edu.nameFa}
        </span>
        <button onClick={stopJourney} className="text-xs text-rose-400 hover:text-rose-300">
          پایان
        </button>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-amber-400 transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-4">
        <p className="text-sm leading-7 text-slate-300">{edu.digestionRole}</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={journeyPrevStage}
          disabled={journey.stageIndex === 0}
          className="rounded-full border border-white/10 p-2.5 text-slate-300 transition hover:bg-white/10 disabled:opacity-30"
        >
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          onClick={journeyTogglePlay}
          className="rounded-full bg-amber-500 p-3 text-slate-950 transition hover:bg-amber-400"
        >
          {journey.playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <button
          onClick={journeyNextStage}
          disabled={journey.stageIndex === TRACT_ORDER.length - 1}
          className="rounded-full border border-white/10 p-2.5 text-slate-300 transition hover:bg-white/10 disabled:opacity-30"
        >
          <SkipForward className="h-4 w-4" />
        </button>
        <button
          onClick={journeyRestart}
          className="rounded-full border border-white/10 p-2.5 text-slate-300 transition hover:bg-white/10"
          title="شروع مجدد"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div>
        <label className="mb-1.5 block text-xs text-slate-400">سرعت حرکت</label>
        <div className="flex gap-2">
          {[0.5, 1, 2].map((sp) => (
            <button
              key={sp}
              onClick={() => journeySetSpeed(sp)}
              className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition ${
                journey.speed === sp
                  ? "border-amber-400/60 bg-amber-500/20 text-amber-200"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {sp}×
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/5 p-3 text-[11px] leading-6 text-indigo-200">
        {ACCESSORY_NOTE}
      </div>
    </div>
  );
}
