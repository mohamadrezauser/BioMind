import type { ReactNode } from "react";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Eye,
  Layers,
  Maximize2,
  RotateCcw,
  ScanEye,
  Tags,
  Expand,
  SquareStack,
} from "lucide-react";
import { useAppStore } from "../../../store/useAppStore";

function ToggleRow({
  icon,
  label,
  active,
  onClick,
  disabled,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-200"
          : "border-white/5 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span
        className={`h-5 w-9 rounded-full border transition ${
          active ? "border-cyan-400 bg-cyan-500/70" : "border-white/20 bg-white/10"
        }`}
      >
        <span
          className={`block h-4 w-4 translate-y-[1px] rounded-full bg-white shadow transition-transform ${
            active ? "translate-x-[1px]" : "translate-x-[17px]"
          }`}
        />
      </span>
    </button>
  );
}

const cameraButtons: { type: "front" | "back" | "left" | "right" | "top"; label: string; icon: ReactNode }[] = [
  { type: "front", label: "نمای جلو", icon: <ScanEye className="h-4 w-4" /> },
  { type: "back", label: "نمای پشت", icon: <ScanEye className="h-4 w-4 rotate-180" /> },
  { type: "left", label: "نمای چپ", icon: <ArrowLeftToLine className="h-4 w-4" /> },
  { type: "right", label: "نمای راست", icon: <ArrowRightToLine className="h-4 w-4" /> },
  { type: "top", label: "نمای بالا", icon: <Maximize2 className="h-4 w-4" /> },
];

export default function ControlsPanel() {
  const requestCamera = useAppStore((s) => s.requestCamera);
  const showLabels = useAppStore((s) => s.showLabels);
  const toggleLabels = useAppStore((s) => s.toggleLabels);
  const showBody = useAppStore((s) => s.showBody);
  const toggleBody = useAppStore((s) => s.toggleBody);
  const transparencyMode = useAppStore((s) => s.transparencyMode);
  const toggleTransparency = useAppStore((s) => s.toggleTransparency);
  const isolateMode = useAppStore((s) => s.isolateMode);
  const toggleIsolate = useAppStore((s) => s.toggleIsolate);
  const explodeOn = useAppStore((s) => s.explodeOn);
  const toggleExplode = useAppStore((s) => s.toggleExplode);
  const selectedOrganId = useAppStore((s) => s.selectedOrganId);
  const resetScene = useAppStore((s) => s.resetScene);
  const focusMode = useAppStore((s) => s.focusMode);
  const setFocusMode = useAppStore((s) => s.setFocusMode);

  return (
    <div className="scroll-thin h-full space-y-5 overflow-y-auto px-4 py-4">
      <div>
        <h4 className="mb-2 text-xs font-bold text-slate-400">دوربین</h4>
        <div className="grid grid-cols-2 gap-2">
          {cameraButtons.map((b) => (
            <button
              key={b.type}
              onClick={() => requestCamera(b.type)}
              className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.08]"
            >
              {b.icon}
              {b.label}
            </button>
          ))}
          <button
            onClick={() => requestCamera("reset")}
            className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" />
            بازنشانی دوربین
          </button>
        </div>
        <p className="mt-2 text-[11px] leading-6 text-slate-500">
          با ماوس بچرخانید، با چرخ ماوس زوم کنید، با کلیک راست و کشیدن جابه‌جا کنید؛ روی لمسی با یک انگشت بچرخانید و
          با دو انگشت زوم/جابه‌جا کنید. از کلیدهای جهت‌دار و +/- نیز می‌توانید استفاده کنید.
        </p>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-bold text-slate-400">حالت‌های نمایش</h4>
        <div className="space-y-2">
          <ToggleRow icon={<Tags className="h-4 w-4" />} label="برچسب‌های نام اندام" active={showLabels} onClick={toggleLabels} />
          <ToggleRow icon={<Layers className="h-4 w-4" />} label="نمایش حجم بدن (زمینه)" active={showBody} onClick={toggleBody} />
          <ToggleRow icon={<Eye className="h-4 w-4" />} label="حالت شفاف (مشاهده پشت اندام‌ها)" active={transparencyMode} onClick={toggleTransparency} />
          <ToggleRow
            icon={<ScanEye className="h-4 w-4" />}
            label="انزوای اندام انتخاب‌شده"
            active={isolateMode}
            onClick={toggleIsolate}
            disabled={!selectedOrganId}
          />
          <ToggleRow icon={<Expand className="h-4 w-4" />} label="نمای انفجاری (باز شدن اندام‌ها)" active={explodeOn} onClick={toggleExplode} />
          <ToggleRow icon={<SquareStack className="h-4 w-4" />} label="حالت تمرکز (تمام‌صفحه)" active={focusMode} onClick={() => setFocusMode(!focusMode)} />
        </div>
      </div>

      <button
        onClick={resetScene}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300 transition hover:bg-rose-500/20"
      >
        <RotateCcw className="h-4 w-4" />
        بازنشانی کامل صحنه
      </button>
    </div>
  );
}
