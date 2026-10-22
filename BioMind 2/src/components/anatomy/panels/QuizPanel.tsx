import { useMemo, useState } from "react";
import { CheckCircle2, MousePointerClick, RefreshCcw, XCircle } from "lucide-react";
import { useAppStore } from "../../../store/useAppStore";
import { ALL_ORGAN_IDS, type OrganId } from "../../../three/organLayout";
import { ORGAN_EDUCATION } from "../../../data/organEducation";

type QuizItem =
  | { kind: "mcq"; organId: OrganId }
  | { kind: "identify"; organId: OrganId };

function shuffledQuestions(): QuizItem[] {
  const ids = [...ALL_ORGAN_IDS];
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.map((id, i) => ({ kind: i % 2 === 0 ? "mcq" : "identify", organId: id }));
}

export default function QuizPanel() {
  const [queue] = useState<QuizItem[]>(() => shuffledQuestions());
  const [index, setIndex] = useState(0);
  const [mcqChoice, setMcqChoice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const selectedOrganId = useAppStore((s) => s.selectedOrganId);
  const selectOrgan = useAppStore((s) => s.selectOrgan);
  const recordQuizAnswer = useAppStore((s) => s.recordQuizAnswer);
  const quizAnswers = useAppStore((s) => s.progress.quizAnswers);

  const item = queue[index % queue.length];
  const edu = ORGAN_EDUCATION[item.organId];

  const correctCount = useMemo(() => Object.values(quizAnswers).filter(Boolean).length, [quizAnswers]);
  const answeredCount = Object.keys(quizAnswers).length;

  function next() {
    setIndex((i) => i + 1);
    setMcqChoice(null);
    setRevealed(false);
    selectOrgan(null);
  }

  function submitMcq(choiceIdx: number) {
    if (revealed) return;
    setMcqChoice(choiceIdx);
    setRevealed(true);
    recordQuizAnswer(item.organId, choiceIdx === edu.question.correctIndex);
  }

  function submitIdentify() {
    if (revealed) return;
    setRevealed(true);
    recordQuizAnswer(item.organId, selectedOrganId === item.organId);
  }

  return (
    <div className="scroll-thin h-full space-y-4 overflow-y-auto px-4 py-4">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          امتیاز: <span className="font-semibold text-emerald-300">{correctCount}</span> صحیح از {answeredCount} پاسخ
        </span>
        <span>سؤال {(index % queue.length) + 1} از {queue.length}</span>
      </div>

      {item.kind === "mcq" ? (
        <div className="space-y-3">
          <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-100">
            {edu.question.prompt}
          </p>
          <div className="space-y-2">
            {edu.question.options.map((opt, i) => {
              const isCorrect = i === edu.question.correctIndex;
              const isPicked = mcqChoice === i;
              let cls = "border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-slate-200";
              if (revealed && isCorrect) cls = "border-emerald-400/60 bg-emerald-500/15 text-emerald-200";
              else if (revealed && isPicked && !isCorrect) cls = "border-rose-400/60 bg-rose-500/15 text-rose-200";
              return (
                <button
                  key={i}
                  onClick={() => submitMcq(i)}
                  disabled={revealed}
                  className={`w-full rounded-xl border px-3 py-2.5 text-right text-sm transition disabled:cursor-default ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-100">
            اندامی را در مدل سه‌بعدی پیدا و انتخاب کنید که ویژگی زیر را دارد:
            <br />
            <span className="text-cyan-300">«{edu.function}»</span>
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-200">
            <MousePointerClick className="h-4 w-4 shrink-0" />
            اندام موردنظر را در صحنه سه‌بعدی کلیک کنید، سپس «بررسی پاسخ» را بزنید.
          </div>
          <p className="text-xs text-slate-500">
            انتخاب فعلی شما: {selectedOrganId ? ORGAN_EDUCATION[selectedOrganId].nameFa : "هیچ‌کدام"}
          </p>
          {!revealed && (
            <button
              onClick={submitIdentify}
              disabled={!selectedOrganId}
              className="w-full rounded-xl bg-cyan-500 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-40"
            >
              بررسی پاسخ
            </button>
          )}
        </div>
      )}

      {revealed && (
        <div
          className={`flex items-start gap-2 rounded-xl border p-3 text-xs leading-6 ${
            (item.kind === "mcq" ? mcqChoice === edu.question.correctIndex : selectedOrganId === item.organId)
              ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
              : "border-rose-400/30 bg-rose-500/10 text-rose-200"
          }`}
        >
          {(item.kind === "mcq" ? mcqChoice === edu.question.correctIndex : selectedOrganId === item.organId) ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{item.kind === "mcq" ? edu.question.explanation : `پاسخ صحیح: ${edu.nameFa}. ${edu.function}`}</span>
        </div>
      )}

      {revealed && (
        <button
          onClick={next}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-slate-200 transition hover:bg-white/10"
        >
          <RefreshCcw className="h-4 w-4" />
          سؤال بعدی
        </button>
      )}
    </div>
  );
}
