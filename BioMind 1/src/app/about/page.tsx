import Link from "next/link";
import { Card, SectionHeading, Callout } from "@/components/ui/Primitives";
import { QUIZ_BANK } from "@/content/quizBank";
import { CONCEPTS } from "@/content/concepts";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="درباره پروژه"
        title="BioMind چیست؟"
        description="یک آزمایشگاه یادگیری هوشمند برای فصل «گوارش و جذب مواد»، ویژه دانش‌آموزان پایه دهم ایران."
      />

      <Card>
        <h3 className="text-lg font-extrabold text-[var(--color-text)]">هدف پروژه</h3>
        <p className="mt-2 text-sm leading-8 text-[var(--color-text-muted)]">
          BioMind تلاش می‌کند یادگیری زیست‌شناسی را از حفظ‌کردن صرف به درک عمیق مفاهیم تبدیل کند: با درس‌های ساختاریافته،
          معلم هوشمند تطبیقی، یک معلم هوش مصنوعی مکالمه‌ای، بانک سؤال گسترده، مرکز آزمون قابل‌تنظیم (با زمان‌بندی دلخواه)،
          بازی‌های آموزشی تعاملی، و گزارش پیشرفت مبتنی بر شواهد واقعی.
        </p>
      </Card>

      <Card className="mt-5">
        <h3 className="text-lg font-extrabold text-[var(--color-text)]">وضعیت محتوا (شفاف و صادقانه)</h3>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-[var(--color-text-muted)]">
          <li>تعداد مفاهیم اتمی پوشش‌داده‌شده: {CONCEPTS.length} مفهوم اصلی فصل گوارش و جذب</li>
          <li>تعداد سؤالات بانک سؤال: {QUIZ_BANK.length} سؤال بررسی‌شده از نظر صحت علمی</li>
          <li>محتوای این نسخه بر پایه مفاهیم عمومی و معتبر زیست‌شناسی دهم تهیه شده؛ برای تطابق دقیق با عبارت کتاب درسی رسمی، هر مفهوم یک «یادداشت منبع» دارد که وضعیت را شفاف می‌کند.</li>
          <li>هوش مصنوعی فقط زمانی «پاسخ زنده» ارائه می‌دهد که سرویس Gemini با کلید معتبر پیکربندی شده باشد؛ در غیر این صورت پاسخ‌ها به‌وضوح به‌عنوان «محتوای بازبینی‌شده بدون هوش مصنوعی زنده» برچسب می‌خورند.</li>
        </ul>
      </Card>

      <Card className="mt-5">
        <h3 className="text-lg font-extrabold text-[var(--color-text)]">حریم خصوصی</h3>
        <p className="mt-2 text-sm leading-8 text-[var(--color-text-muted)]">
          استفاده مهمان از BioMind نیازی به هیچ اطلاعات شخصی ندارد و پیشرفت فقط در مرورگر شما ذخیره می‌شود. در صورت ساخت
          حساب کاربری، فقط ایمیل، نام نمایشی، و داده‌های یادگیری (پاسخ‌ها، نمرات، پیشرفت مفاهیم) روی سرور ذخیره می‌شود؛
          رمز عبور هرگز به‌صورت متن ساده ذخیره نمی‌شود.
        </p>
      </Card>

      <Callout tone="info" title="مدیریت پروژه">
        <p className="text-base font-extrabold text-[var(--color-text)]">مدیر پروژه: سید محمدرضا حقانی</p>
      </Callout>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/teacher" className="bm-btn bm-btn-secondary bm-focus text-sm">
          🎓 مشاهده حالت نمایش علمی
        </Link>
        <Link href="/" className="bm-btn bm-btn-primary bm-focus text-sm">
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
