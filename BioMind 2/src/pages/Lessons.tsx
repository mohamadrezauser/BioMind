import { BookMarked, Eye } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { ACCESSORY_ORDER, TRACT_ORDER } from "../three/organLayout";
import { ORGAN_EDUCATION, ACCESSORY_NOTE } from "../data/organEducation";

export default function Lessons() {
  const setPage = useAppStore((s) => s.setPage);
  const selectOrgan = useAppStore((s) => s.selectOrgan);

  function openInLab(id: (typeof TRACT_ORDER)[number]) {
    setPage("lab");
    setTimeout(() => selectOrgan(id, { focus: true }), 150);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 md:px-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-white">درس‌نامه دستگاه گوارش</h1>
        <p className="text-sm leading-7 text-slate-400">
          محتوای زیر بر پایه مباحث کتاب زیست‌شناسی پایه دهم سازمان‌دهی شده و برای هر اندام امکان مشاهده مستقیم در
          آزمایشگاه سه‌بعدی وجود دارد.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-bold text-cyan-300">مسیر اصلی دستگاه گوارش</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {TRACT_ORDER.map((id) => (
            <LessonCard key={id} id={id} onOpen={() => openInLab(id)} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-amber-300">غدد ضمیمه (کمکی)</h2>
        <div className="mb-3 rounded-xl border border-indigo-400/20 bg-indigo-500/5 p-3 text-xs leading-6 text-indigo-200">
          {ACCESSORY_NOTE}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {ACCESSORY_ORDER.map((id) => (
            <LessonCard key={id} id={id} onOpen={() => openInLab(id)} />
          ))}
        </div>
      </section>
    </div>
  );
}

function LessonCard({ id, onOpen }: { id: (typeof TRACT_ORDER)[number]; onOpen: () => void }) {
  const edu = ORGAN_EDUCATION[id];
  return (
    <div className="flex flex-col justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">{edu.nameFa}</h3>
          {edu.textbookGrounded && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
              <BookMarked className="h-3 w-3" />
              کتاب درسی
            </span>
          )}
        </div>
        <p className="text-sm leading-7 text-slate-400">{edu.function}</p>
      </div>
      <button
        onClick={onOpen}
        className="flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/10 py-2 text-xs font-medium text-cyan-200 transition hover:bg-cyan-500/20"
      >
        <Eye className="h-3.5 w-3.5" />
        مشاهده در مدل سه‌بعدی
      </button>
    </div>
  );
}
