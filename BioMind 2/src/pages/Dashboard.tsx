import type { ReactNode } from "react";
import { ArrowLeft, Compass, FlaskConical, Layers3, ListChecks, Utensils } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { TRACT_ORDER, ACCESSORY_ORDER } from "../three/organLayout";

export default function Dashboard() {
  const setPage = useAppStore((s) => s.setPage);
  const visitedCount = useAppStore((s) => s.progress.visitedOrgans.length);
  const quizAnswers = useAppStore((s) => s.progress.quizAnswers);
  const tourCompleted = useAppStore((s) => s.progress.tourCompleted);
  const startTour = useAppStore((s) => s.startTour);
  const startJourney = useAppStore((s) => s.startJourney);

  const totalOrgans = TRACT_ORDER.length + ACCESSORY_ORDER.length;
  const correctQuiz = Object.values(quizAnswers).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 md:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 p-8 md:p-12">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative space-y-5">
          <span className="inline-block rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
            آزمایشگاه سه‌بعدی تعاملی دستگاه گوارش
          </span>
          <h1 className="max-w-2xl text-3xl font-extrabold leading-snug text-white md:text-4xl">
            بیومایند؛ یادگیری زیست‌شناسی با کاوش سه‌بعدی اندام‌ها
          </h1>
          <p className="max-w-xl text-sm leading-8 text-slate-400">
            دستگاه گوارش را از دهان تا مقعد، اندام‌به‌اندام بچرخانید، جدا کنید، بپوشانید یا شفاف کنید؛ مسیر حرکت غذا
            را دنبال کنید و با آزمون‌های تعاملی و دستیار هوشمند آفلاین، مفاهیم کتاب زیست‌شناسی پایه دهم را عمیق‌تر
            یاد بگیرید.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setPage("lab")}
              className="flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              <FlaskConical className="h-4 w-4" />
              ورود به آزمایشگاه سه‌بعدی
            </button>
            <button
              onClick={() => {
                setPage("lab");
                setTimeout(startTour, 150);
              }}
              className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/5"
            >
              <Compass className="h-4 w-4" />
              شروع تور آموزشی
            </button>
            <button
              onClick={() => {
                setPage("lab");
                setTimeout(startJourney, 150);
              }}
              className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/5"
            >
              <Utensils className="h-4 w-4" />
              دنبال کردن مسیر غذا
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="اندام‌های مشاهده‌شده" value={`${visitedCount} / ${totalOrgans}`} icon={<Layers3 className="h-5 w-5" />} />
        <StatCard label="پاسخ‌های صحیح آزمون" value={`${correctQuiz}`} icon={<ListChecks className="h-5 w-5" />} />
        <StatCard label="تور آموزشی" value={tourCompleted ? "تکمیل شده" : "ناتمام"} icon={<Compass className="h-5 w-5" />} />
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <FeatureCard
          title="کاوش آزاد سه‌بعدی"
          desc="هر اندام را بچرخانید، زوم کنید، جدا کنید یا شفاف نمایش دهید و اطلاعات آموزشی آن را بخوانید."
          cta="باز کردن آزمایشگاه"
          onClick={() => setPage("lab")}
        />
        <FeatureCard
          title="درس‌نامه مصور"
          desc="محتوای مبتنی بر کتاب زیست‌شناسی پایه دهم، همراه با پیوند مستقیم به مدل سه‌بعدی هر اندام."
          cta="مطالعه درس‌نامه"
          onClick={() => setPage("lessons")}
        />
        <FeatureCard
          title="پیگیری پیشرفت"
          desc="میزان مشاهده اندام‌ها، نمره آزمون‌ها و تکمیل تور آموزشی و مسیر غذا را دنبال کنید."
          cta="مشاهده پیشرفت"
          onClick={() => setPage("progress")}
        />
      </section>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">{icon}</div>
      <div>
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc, cta, onClick }: { title: string; desc: string; cta: string; onClick: () => void }) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition hover:border-cyan-400/20">
      <div>
        <h3 className="mb-2 text-base font-bold text-white">{title}</h3>
        <p className="text-sm leading-7 text-slate-400">{desc}</p>
      </div>
      <button onClick={onClick} className="flex items-center gap-1.5 text-sm font-medium text-cyan-400 hover:text-cyan-300">
        {cta}
        <ArrowLeft className="h-4 w-4" />
      </button>
    </div>
  );
}
