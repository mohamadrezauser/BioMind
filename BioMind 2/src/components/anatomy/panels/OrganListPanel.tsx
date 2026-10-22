import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAppStore } from "../../../store/useAppStore";
import { ACCESSORY_ORDER, TRACT_ORDER, type OrganId } from "../../../three/organLayout";
import { ORGAN_EDUCATION } from "../../../data/organEducation";

function OrganRow({ id }: { id: OrganId }) {
  const selectedId = useAppStore((s) => s.selectedOrganId);
  const selectOrgan = useAppStore((s) => s.selectOrgan);
  const visible = useAppStore((s) => s.visibility[id]);
  const toggleVisibility = useAppStore((s) => s.toggleVisibility);
  const visited = useAppStore((s) => s.progress.visitedOrgans.includes(id));
  const isSelected = selectedId === id;

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 transition ${
        isSelected ? "border-amber-400/50 bg-amber-500/10" : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]"
      }`}
    >
      <button
        onClick={() => selectOrgan(id, { focus: true })}
        className="flex min-w-0 flex-1 items-center gap-2 text-right"
      >
        {visited && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />}
        <span className={`truncate text-sm ${isSelected ? "font-semibold text-amber-200" : "text-slate-200"}`}>
          {ORGAN_EDUCATION[id].nameFa}
        </span>
      </button>
      <button
        onClick={() => toggleVisibility(id)}
        title={visible ? "پنهان کردن اندام" : "نمایش اندام"}
        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
      >
        {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-slate-600" />}
      </button>
    </div>
  );
}

export default function OrganListPanel() {
  const showAllOrgans = useAppStore((s) => s.showAllOrgans);
  const visitedCount = useAppStore((s) => s.progress.visitedOrgans.length);

  return (
    <div className="scroll-thin h-full space-y-5 overflow-y-auto px-4 py-4">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          پیشرفت مشاهده: <span className="font-semibold text-cyan-300">{visitedCount}</span> از ۱۱ اندام
        </span>
        <button onClick={showAllOrgans} className="text-cyan-400 hover:text-cyan-300">
          نمایش همه
        </button>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-bold text-cyan-300">مسیر اصلی دستگاه گوارش</h4>
        <div className="space-y-1.5">
          {TRACT_ORDER.map((id) => (
            <OrganRow key={id} id={id} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-bold text-amber-300">غدد ضمیمه (کمکی)</h4>
        <div className="space-y-1.5">
          {ACCESSORY_ORDER.map((id) => (
            <OrganRow key={id} id={id} />
          ))}
        </div>
      </div>
    </div>
  );
}
