import { useEffect } from "react";
import { Pause, Play, Rewind, FastForward, Compass } from "lucide-react";
import { useAppStore } from "../../../store/useAppStore";
import { TRACT_ORDER } from "../../../three/organLayout";
import { ORGAN_EDUCATION } from "../../../data/organEducation";

export default function TourPanel() {
  const tour = useAppStore((s) => s.tour);
  const startTour = useAppStore((s) => s.startTour);
  const stopTour = useAppStore((s) => s.stopTour);
  const tourNext = useAppStore((s) => s.tourNext);
  const tourPrev = useAppStore((s) => s.tourPrev);
  const tourTogglePlay = useAppStore((s) => s.tourTogglePlay);
  const markTourCompleted = useAppStore((s) => s.markTourCompleted);

  useEffect(() => {
    if (!tour.active || !tour.playing) return;
    const timer = setTimeout(() => {
      if (tour.index === TRACT_ORDER.length - 1) {
        markTourCompleted();
        return;
      }
      tourNext();
    }, 6000);
    return () => clearTimeout(timer);
  }, [tour.active, tour.playing, tour.index, tourNext, markTourCompleted]);

  const currentId = TRACT_ORDER[tour.index];
  const edu = ORGAN_EDUCATION[currentId];

  if (!tour.active) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-10 text-center">
        <Compass className="h-9 w-9 text-cyan-400" />
        <p className="text-sm leading-7 text-slate-400">
          در تور آموزشی هدایت‌شده، به ترتیب از دهان تا مقعد با هر اندام و عملکرد آن آشنا می‌شوید و دوربین به‌طور
          خودکار روی هر اندام متمرکز می‌شود.
        </p>
        <button
          onClick={startTour}
          className="flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          <Play className="h-4 w-4" />
          شروع تور آموزشی
        </button>
      </div>
    );
  }

  return (
    <div className="scroll-thin h-full space-y-4 overflow-y-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          مرحله {tour.index + 1} از {TRACT_ORDER.length}
        </span>
        <button onClick={stopTour} className="text-xs text-rose-400 hover:text-rose-300">
          پایان تور
        </button>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all duration-500"
          style={{ width: `${((tour.index + 1) / TRACT_ORDER.length) * 100}%` }}
        />
      </div>

      <div className="animate-fade-in-up rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-4">
        <h4 className="mb-1 text-lg font-bold text-white">{edu.nameFa}</h4>
        <p className="text-sm leading-7 text-slate-300">{edu.function}</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={tourPrev}
          disabled={tour.index === 0}
          className="rounded-full border border-white/10 p-2.5 text-slate-300 transition hover:bg-white/10 disabled:opacity-30"
        >
          <Rewind className="h-4 w-4" />
        </button>
        <button
          onClick={tourTogglePlay}
          className="rounded-full bg-cyan-500 p-3 text-slate-950 transition hover:bg-cyan-400"
        >
          {tour.playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <button
          onClick={() => {
            if (tour.index === TRACT_ORDER.length - 1) markTourCompleted();
            tourNext();
          }}
          disabled={tour.index === TRACT_ORDER.length - 1}
          className="rounded-full border border-white/10 p-2.5 text-slate-300 transition hover:bg-white/10 disabled:opacity-30"
        >
          <FastForward className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 pt-1">
        {TRACT_ORDER.map((id, i) => (
          <span
            key={id}
            className={`h-1.5 w-5 rounded-full transition ${i <= tour.index ? "bg-cyan-400" : "bg-white/10"}`}
          />
        ))}
      </div>
    </div>
  );
}
