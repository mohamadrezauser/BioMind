import type { ReactNode } from "react";
import { Dna, LayoutDashboard, FlaskConical, BookOpen, LineChart, Info } from "lucide-react";
import { useAppStore, type Page } from "../../store/useAppStore";

const NAV_ITEMS: { id: Page; label: string; icon: ReactNode }[] = [
  { id: "dashboard", label: "داشبورد", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "lab", label: "آزمایشگاه آناتومی", icon: <FlaskConical className="h-4 w-4" /> },
  { id: "lessons", label: "درس‌نامه", icon: <BookOpen className="h-4 w-4" /> },
  { id: "progress", label: "پیشرفت من", icon: <LineChart className="h-4 w-4" /> },
  { id: "about", label: "درباره", icon: <Info className="h-4 w-4" /> },
];

export default function Navbar() {
  const page = useAppStore((s) => s.page);
  const setPage = useAppStore((s) => s.setPage);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-slate-950/80 px-4 backdrop-blur md:px-6">
      <button onClick={() => setPage("dashboard")} className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 shadow-lg shadow-cyan-500/20">
          <Dna className="h-5 w-5 text-white" />
        </div>
        <div className="text-right">
          <p className="text-sm font-extrabold tracking-tight text-white">بیومایند</p>
          <p className="-mt-0.5 text-[10px] text-slate-500">BioMind | زیست‌شناسی پایه دهم</p>
        </div>
      </button>

      <nav className="scroll-thin flex max-w-[65vw] items-center gap-1 overflow-x-auto md:max-w-none">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
              page === item.id ? "bg-cyan-500/15 text-cyan-200" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
            }`}
          >
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}
