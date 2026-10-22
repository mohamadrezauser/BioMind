import { Component, Suspense, type ReactNode } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import Scene from "./Scene";

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error("خطای نمایش سه‌بعدی:", error);
  }
  render() {
    if (this.state.hasError) {
      return <FallbackPanel onRetry={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

function FallbackPanel({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl bg-slate-900/60 p-8 text-center">
      <AlertTriangle className="h-10 w-10 text-amber-400" />
      <p className="max-w-sm text-sm leading-7 text-slate-300">
        نمایشگر سه‌بعدی در این مرورگر در دسترس نیست یا با خطا مواجه شد. می‌توانید از مرورگر دیگری استفاده کنید یا
        دوباره تلاش کنید. محتوای آموزشی و پاسخ‌دهی پرسش‌ها همچنان بدون نیاز به سه‌بعدی در دسترس است.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-full bg-cyan-500/90 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
        >
          تلاش مجدد
        </button>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-slate-950/40">
      <Loader2 className="h-9 w-9 animate-spin text-cyan-400" />
      <p className="text-sm text-slate-400">در حال آماده‌سازی مدل سه‌بعدی…</p>
    </div>
  );
}

export default function Canvas3DContainer() {
  if (!isWebGLAvailable()) {
    return <FallbackPanel />;
  }
  return (
    <CanvasErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Scene />
      </Suspense>
    </CanvasErrorBoundary>
  );
}
