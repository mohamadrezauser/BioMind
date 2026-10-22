import Navbar from "./components/layout/Navbar";
import TutorWidget from "./components/tutor/TutorWidget";
import { useAppStore } from "./store/useAppStore";
import Dashboard from "./pages/Dashboard";
import AnatomyLab from "./pages/AnatomyLab";
import Lessons from "./pages/Lessons";
import ProgressPage from "./pages/ProgressPage";
import About from "./pages/About";

export default function App() {
  const page = useAppStore((s) => s.page);
  const focusMode = useAppStore((s) => s.focusMode);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" dir="rtl">
      {!(page === "lab" && focusMode) && <Navbar />}

      <main>
        {page === "dashboard" && <Dashboard />}
        {page === "lab" && <AnatomyLab />}
        {page === "lessons" && <Lessons />}
        {page === "progress" && <ProgressPage />}
        {page === "about" && <About />}
      </main>

      {!(page === "lab" && focusMode) && (
        <footer className="border-t border-white/5 px-6 py-6 text-center text-xs text-slate-600">
          بیومایند — آزمایشگاه سه‌بعدی آموزش زیست‌شناسی پایه دهم. هندسه اندام‌ها به‌صورت اختصاصی و رویه‌ای ساخته شده
          است.
        </footer>
      )}

      <TutorWidget />
    </div>
  );
}
