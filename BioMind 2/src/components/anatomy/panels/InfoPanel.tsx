import type { ReactNode } from "react";
import { BookOpen, Link2, Lightbulb, MapPin, Sparkles, Target } from "lucide-react";
import { useAppStore } from "../../../store/useAppStore";
import { ORGAN_EDUCATION } from "../../../data/organEducation";
import { ORGAN_LAYOUT } from "../../../three/organLayout";

export default function InfoPanel() {
  const selectedId = useAppStore((s) => s.selectedOrganId);
  const selectOrgan = useAppStore((s) => s.selectOrgan);

  if (!selectedId) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-4 py-10 text-center">
        <Sparkles className="h-8 w-8 text-cyan-400" />
        <p className="text-sm text-slate-400">
          روی یکی از اندام‌ها در مدل سه‌بعدی کلیک کنید یا از «فهرست ارگان‌ها» انتخاب کنید تا اطلاعات آموزشی آن نمایش
          داده شود.
        </p>
      </div>
    );
  }

  const edu = ORGAN_EDUCATION[selectedId];
  const groupLabel = ORGAN_LAYOUT[selectedId].group === "tract" ? "بخشی از مسیر گوارش" : "غده ضمیمه (کمکی)";

  return (
    <div className="scroll-thin h-full space-y-5 overflow-y-auto px-4 py-4 text-sm">
      <div className="animate-fade-in-up space-y-1">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            ORGAN_LAYOUT[selectedId].group === "tract"
              ? "bg-cyan-500/15 text-cyan-300"
              : "bg-amber-500/15 text-amber-300"
          }`}
        >
          {groupLabel}
        </span>
        <h3 className="text-xl font-bold text-white">{edu.nameFa}</h3>
        <p className="text-xs text-slate-500">{edu.nameScientific}</p>
      </div>

      <Section icon={<MapPin className="h-4 w-4" />} title="موقعیت تشریحی">
        {edu.location}
      </Section>

      <Section icon={<Target className="h-4 w-4" />} title="عملکرد اصلی">
        {edu.function}
      </Section>

      <Section icon={<BookOpen className="h-4 w-4" />} title="نقش در گوارش">
        {edu.digestionRole}
      </Section>

      {edu.connections.length > 0 && (
        <Section icon={<Link2 className="h-4 w-4" />} title="ارتباط با سایر اندام‌ها">
          <div className="flex flex-col gap-1.5">
            {edu.connections.map((c) => (
              <button
                key={c.id}
                onClick={() => selectOrgan(c.id, { focus: true })}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-right text-xs text-slate-300 transition hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-200"
              >
                <span>{c.label}</span>
                <span className="shrink-0 font-semibold">{ORGAN_EDUCATION[c.id].nameFa}</span>
              </button>
            ))}
          </div>
        </Section>
      )}

      <Section icon={<Lightbulb className="h-4 w-4" />} title="مفاهیم کلیدی پایه دهم" accent="emerald">
        <ul className="list-inside list-disc space-y-1.5 text-slate-300">
          {edu.grade10Concepts.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
        <span className="mt-2 inline-block rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
          مبتنی بر کتاب درسی زیست‌شناسی پایه دهم
        </span>
      </Section>

      {edu.misconceptions.length > 0 && (
        <Section icon={<Lightbulb className="h-4 w-4" />} title="تصورهای نادرست رایج" accent="rose">
          <ul className="list-inside list-disc space-y-1.5 text-slate-300">
            {edu.misconceptions.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  children,
  accent = "cyan",
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  accent?: "cyan" | "emerald" | "rose";
}) {
  const accentClass = {
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
    rose: "text-rose-400",
  }[accent];
  return (
    <div>
      <div className={`mb-1.5 flex items-center gap-1.5 text-xs font-semibold ${accentClass}`}>
        {icon}
        <span>{title}</span>
      </div>
      <div className="leading-7 text-slate-300">{children}</div>
    </div>
  );
}
