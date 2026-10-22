import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppStateProvider } from "@/hooks/useAppState";
import { AuthProvider } from "@/hooks/useAuth";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "BioMind | آزمایشگاه هوشمند زیست‌شناسی",
  description:
    "آزمایشگاه یادگیری هوشمند زیست‌شناسی برای گوارش و جذب مواد — ویژه دانش‌آموزان پایه دهم، با معلم هوشمند تطبیقی، شبیه‌سازی‌ها، بازی‌های آموزشی و آزمون تطبیقی.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f2a3f",
};

const THEME_INIT_SCRIPT = `
try {
  var t = window.localStorage.getItem('biomind.theme');
  if (t === 'dark' || t === 'light') {
    document.documentElement.setAttribute('data-theme', t);
  }
} catch (e) {}
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <AppStateProvider>
            <AppShell>{children}</AppShell>
          </AppStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
