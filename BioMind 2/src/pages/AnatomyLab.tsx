import { Minimize2 } from "lucide-react";
import Canvas3DContainer from "../components/anatomy/Canvas3DContainer";
import TabBar from "../components/anatomy/TabBar";
import InfoPanel from "../components/anatomy/panels/InfoPanel";
import OrganListPanel from "../components/anatomy/panels/OrganListPanel";
import ControlsPanel from "../components/anatomy/panels/ControlsPanel";
import TourPanel from "../components/anatomy/panels/TourPanel";
import JourneyPanel from "../components/anatomy/panels/JourneyPanel";
import QuizPanel from "../components/anatomy/panels/QuizPanel";
import { useAppStore } from "../store/useAppStore";

function PanelContent() {
  const labTab = useAppStore((s) => s.labTab);
  switch (labTab) {
    case "info":
      return <InfoPanel />;
    case "list":
      return <OrganListPanel />;
    case "controls":
      return <ControlsPanel />;
    case "tour":
      return <TourPanel />;
    case "journey":
      return <JourneyPanel />;
    case "quiz":
      return <QuizPanel />;
    default:
      return null;
  }
}

export default function AnatomyLab() {
  const focusMode = useAppStore((s) => s.focusMode);
  const setFocusMode = useAppStore((s) => s.setFocusMode);

  return (
    <div
      className={`flex w-full flex-col gap-3 p-3 md:flex-row md:p-4 ${
        focusMode ? "h-screen" : "h-[calc(100vh-4rem)]"
      }`}
    >
      <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-slate-900/60 to-slate-950">
        <Canvas3DContainer />

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="pointer-events-auto rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-[11px] text-slate-300 backdrop-blur">
            آزمایشگاه سه‌بعدی دستگاه گوارش
          </div>
          {focusMode && (
            <button
              onClick={() => setFocusMode(false)}
              className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-[11px] text-slate-200 backdrop-blur transition hover:bg-slate-900"
            >
              <Minimize2 className="h-3.5 w-3.5" />
              خروج از حالت تمرکز
            </button>
          )}
        </div>
      </div>

      {!focusMode && (
        <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-slate-950/60 md:w-[380px] md:shrink-0">
          <TabBar />
          <div className="min-h-0 flex-1">
            <PanelContent />
          </div>
        </div>
      )}
    </div>
  );
}
