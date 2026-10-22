"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, SectionHeading, ProgressBar, Callout, MasteryBadge } from "@/components/ui/Primitives";
import { DEMO_PROFILES, DEMO_TUTOR_TRANSCRIPT } from "@/content/demoProfiles";
import { MISCONCEPTION_MAP } from "@/content/misconceptions";
import { useAppState } from "@/hooks/useAppState";
import { levelFromScore } from "@/learning/mastery";
import { cn } from "@/utils/cn";

const TOUR_STEPS = [
  { href: "/lab/digestive-system", title: "۱. آزمایشگاه گوارش", desc: "کاوش تعاملی اندام‌ها با انتخاب و مسیر راهنما (دو‌بعدی)." },
  { href: "/simulator/food-journey", title: "۲. شبیه‌ساز مسیر غذا", desc: "دنبال‌کردن نان، تخم‌مرغ و چربی در بدن." },
  { href: "/lab/absorption", title: "۳. آزمایشگاه جذب مواد مغذی", desc: "پیش‌بینی مسیر خون/لنف برای مواد مغذی." },
  { href: "/tutor", title: "۴. معلم هوشمند تطبیقی", desc: "تغییر راهبرد تدریس بر اساس پاسخ دانش‌آموز." },
  { href: "/ai-tutor", title: "۵. چت زنده با هوش مصنوعی", desc: "گفتگوی آزاد با معلم هوشمند مبتنی بر Gemini." },
  { href: "/exams", title: "۶. مرکز آزمون", desc: "آزمون قابل‌تنظیم با زمان‌بندی دلخواه هر سؤال و کل آزمون." },
  { href: "/games", title: "۷. بازی‌های آموزشی", desc: "چند بازی قابل‌بازی با امتیازدهی واقعی." },
  { href: "/progress", title: "۸. گزارش پیشرفت", desc: "داشبورد واقعی بر اساس داده‌های همین حساب/مرورگر." },
];

export default function TeacherDemoPage() {
  const { resetAll } = useAppState();
  const [tab, setTab] = useState<"overview" | "profiles" | "tutor" | "reset">("overview");
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="ویژه جشنواره علمی"
        title="حالت معلم / نمایش"
        description="این بخش برای معرفی BioMind در یک نمایشگاه یا جشنواره علمی طراحی شده است. داده‌های این صفحه (پروفایل‌ها و نمونه گفت‌وگو) کاملاً ساختگی هستند و هیچ سامانه واقعی کلاسی را نشان نمی‌دهند."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {[
          { id: "overview", label: "نمای کلی و تور" },
          { id: "profiles", label: "پروفایل‌های نمونه" },
          { id: "tutor", label: "نمونه تطبیق معلم هوشمند" },
          { id: "reset", label: "بازنشانی داده‌ها" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as typeof tab)}
            className={cn("bm-btn bm-focus text-sm", tab === t.id ? "bm-btn-primary" : "bm-btn-secondary")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {TOUR_STEPS.map((s) => (
            <Link key={s.href} href={s.href} className="bm-focus block">
              <Card className="h-full transition-transform hover:-translate-y-0.5">
                <p className="font-extrabold text-[var(--color-text)]">{s.title}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{s.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {tab === "profiles" && (
        <div className="space-y-4">
          <Callout tone="warning" title="داده ساختگی">
            پروفایل‌های زیر فقط برای نمایش قابلیت گزارش‌گیری BioMind ساخته شده‌اند و متعلق به دانش‌آموزان واقعی نیستند.
          </Callout>
          {DEMO_PROFILES.map((p) => (
            <Card key={p.id}>
              <p className="font-extrabold text-[var(--color-text)]">{p.name}</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{p.summary}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {p.masteryHighlights.map((h) => (
                  <div key={h.conceptTitle} className="rounded-lg bg-[var(--color-surface-muted)] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[var(--color-text)]">{h.conceptTitle}</p>
                      <MasteryBadge level={levelFromScore(h.score, 5)} />
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={h.score} showValue={false} />
                    </div>
                    <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">{h.note}</p>
                  </div>
                ))}
              </div>
              {p.misconceptionsFound.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.misconceptionsFound.map((mid) => (
                    <span key={mid} className="bm-tag text-[var(--color-warning)]">
                      برداشت نادرست: {MISCONCEPTION_MAP[mid]?.title}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {tab === "tutor" && (
        <Card>
          <p className="mb-4 text-sm text-[var(--color-text-muted)]">
            نمونه زیر نشان می‌دهد چطور معلم هوشمند پس از یک پاسخ نادرست، راهبرد تدریس را تغییر می‌دهد و پس از پاسخ
            درست، سطح سؤال را بالا می‌برد. (متن نمایشی ثابت، برای نسخه واقعی و زنده به صفحه «معلم هوشمند» برو.)
          </p>
          <div className="space-y-2">
            {DEMO_TUTOR_TRANSCRIPT.map((t, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-7",
                  t.speaker === "tutor"
                    ? "bg-[var(--color-teal)]/10 text-[var(--color-text)]"
                    : "mr-auto bg-[var(--color-surface-muted)] text-[var(--color-text)]"
                )}
              >
                <span className="mb-1 block text-[10px] font-bold text-[var(--color-text-muted)]">
                  {t.speaker === "tutor" ? "معلم هوشمند" : "دانش‌آموز"}
                </span>
                {t.text}
              </div>
            ))}
          </div>
          <Link href="/tutor" className="bm-btn bm-btn-primary bm-focus mt-4 text-sm">
            رفتن به نسخه واقعی و زنده ←
          </Link>
        </Card>
      )}

      {tab === "reset" && (
        <Card>
          <p className="font-bold text-[var(--color-text)]">بازنشانی داده‌های نمایشی این مرورگر</p>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            برای شروع یک نمایش تازه (مثلاً برای بازدیدکننده بعدی در جشنواره)، می‌توانی پیشرفت ثبت‌شده در همین مرورگر
            را پاک کنی. توجه: این گزینه داده‌های پروفایل‌های نمونه ساختگی بالا را تغییر نمی‌دهد، فقط پیشرفت واقعی
            ذخیره‌شده روی این دستگاه را پاک می‌کند.
          </p>
          {!confirmReset ? (
            <button type="button" className="bm-btn bm-btn-secondary bm-focus mt-3 text-sm" onClick={() => setConfirmReset(true)}>
              بازنشانی برای نمایش بعدی
            </button>
          ) : (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="bm-btn bm-focus bg-[var(--color-danger)] text-sm text-white"
                onClick={() => {
                  resetAll();
                  setConfirmReset(false);
                }}
              >
                بله، پاک شود
              </button>
              <button type="button" className="bm-btn bm-btn-secondary bm-focus text-sm" onClick={() => setConfirmReset(false)}>
                انصراف
              </button>
            </div>
          )}
        </Card>
      )}

      <Callout tone="info" title="مدیریت پروژه">
        <p className="font-extrabold text-[var(--color-text)]">مدیر پروژه: سید محمدرضا حقانی</p>
      </Callout>
    </div>
  );
}
