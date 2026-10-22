import type { ReactNode } from "react";
import { BookOpenText, Compass, ListTree, SlidersHorizontal, Utensils, HelpCircle } from "lucide-react";
import { useAppStore, type LabTab } from "../../store/useAppStore";

const TABS: { id: LabTab; label: string; icon: ReactNode }[] = [
  { id: "info", label: "اطلاعات", icon: <BookOpenText className="h-4 w-4" /> },
  { id: "list", label: "فهرست ارگان‌ها", icon: <ListTree className="h-4 w-4" /> },
  { id: "controls", label: "کنترل‌ها", icon: <SlidersHorizontal className="h-4 w-4" /> },
  { id: "tour", label: "تور آموزشی", icon: <Compass className="h-4 w-4" /> },
  { id: "journey", label: "مسیر غذا", icon: <Utensils className="h-4 w-4" /> },
  { id: "quiz", label: "آزمون", icon: <HelpCircle className="h-4 w-4" /> },
];

export default function TabBar() {
  const labTab = useAppStore((s) => s.labTab);
  const setLabTab = useAppStore((s) => s.setLabTab);

  return (
    <div className="scroll-thin flex gap-1 overflow-x-auto border-b border-white/5 px-2 py-2">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => setLabTab(t.id)}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
            labTab === t.id ? "bg-cyan-500/15 text-cyan-200" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
          }`}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}
