import type { ReactNode } from "react";
import { ShieldCheck, Sparkles, Boxes, BookOpenCheck } from "lucide-react";

export default function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 md:px-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">درباره بیومایند</h1>
        <p className="mt-2 text-sm leading-7 text-slate-400">
          بیومایند یک آزمایشگاه آموزشی سه‌بعدی و تعاملی برای یادگیری دستگاه گوارش انسان، متناسب با سرفصل‌های کتاب
          زیست‌شناسی پایه دهم است.
        </p>
      </div>

      <Section icon={<Sparkles className="h-5 w-5 text-cyan-400" />} title="ویژگی‌های اصلی">
        <ul className="list-inside list-disc space-y-1.5 leading-7 text-slate-300">
          <li>مدل سه‌بعدی تعاملی با اندام‌های جداگانه و قابل انتخاب</li>
          <li>کنترل دوربین، حالت شفاف، انزوای اندام و نمای انفجاری</li>
          <li>تور آموزشی هدایت‌شده و شبیه‌سازی مسیر حرکت غذا</li>
          <li>آزمون‌های تعاملی مبتنی بر انتخاب مستقیم روی مدل</li>
          <li>دستیار آموزشی آفلاین که بدون نیاز به سرویس خارجی پاسخ می‌دهد</li>
        </ul>
      </Section>

      <Section icon={<Boxes className="h-5 w-5 text-amber-400" />} title="درباره مدل سه‌بعدی و مجوزها">
        <p className="leading-7 text-slate-300">
          پیش از ساخت این نسخه، مجموعه‌ی اشتراکی اسکچ‌فب معرفی‌شده بررسی شد. از آنجا که دسترسی برنامه‌نویسی/دانلود
          تأییدشده به آن مجموعه و احراز مجوز توزیع مجدد هر مدل در این محیط در دسترس نبود، برای رعایت کامل حقوق
          مالکیت و جلوگیری از استفاده غیرمجاز، مدل سه‌بعدی دستگاه گوارش به‌صورت اختصاصی و رویه‌ای (Procedural) در
          همین پروژه طراحی و ساخته شده است؛ هندسه هر اندام با منحنی‌های تشریحی واقعی و تغییر شعاع متغیر برای حفظ
          تناسبات و فرم طبیعی (مانند شکل J معده، پیچ‌وخم روده باریک و قاب روده بزرگ) تولید شده و هیچ دارایی دارای
          مجوز ناشناخته در برنامه بارگذاری نشده است.
        </p>
      </Section>

      <Section icon={<BookOpenCheck className="h-5 w-5 text-emerald-400" />} title="منبع محتوای آموزشی">
        <p className="leading-7 text-slate-300">
          مفاهیم کلیدی هر اندام با عنوان «مبتنی بر کتاب درسی زیست‌شناسی پایه دهم» مشخص شده‌اند. مطالب تکمیلی (مانند
          برخی نکات تشریحی دقیق‌تر) جدا از محتوای کتاب درسی ارائه شده و نباید به‌عنوان نقل مستقیم از کتاب تلقی شود.
        </p>
      </Section>

      <Section icon={<ShieldCheck className="h-5 w-5 text-indigo-400" />} title="حریم خصوصی و عملکرد آفلاین">
        <p className="leading-7 text-slate-300">
          دستیار هوشمند این نسخه به‌صورت کاملاً محلی (بدون ارسال داده به سرویس خارجی) پاسخ می‌دهد تا در صورت نبود
          اتصال اینترنت نیز آموزش متوقف نشود. پیشرفت یادگیری شما (اندام‌های مشاهده‌شده، نمره آزمون‌ها) فقط در همین
          مرورگر ذخیره می‌شود.
        </p>
      </Section>
    </div>
  );
}

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h2 className="text-base font-bold text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}
