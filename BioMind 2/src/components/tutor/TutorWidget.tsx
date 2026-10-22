import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { generateTutorReply } from "../../lib/tutorEngine";
import { ORGAN_EDUCATION } from "../../data/organEducation";

export default function TutorWidget() {
  const chatOpen = useAppStore((s) => s.chatOpen);
  const setChatOpen = useAppStore((s) => s.setChatOpen);
  const messages = useAppStore((s) => s.messages);
  const addMessage = useAppStore((s) => s.addMessage);
  const setPage = useAppStore((s) => s.setPage);
  const selectOrgan = useAppStore((s) => s.selectOrgan);
  const startTour = useAppStore((s) => s.startTour);
  const startJourney = useAppStore((s) => s.startJourney);

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, chatOpen]);

  function send() {
    const q = input.trim();
    if (!q) return;
    addMessage({ role: "user", text: q });
    setInput("");
    const reply = generateTutorReply(q);
    addMessage({ role: "tutor", text: reply.text, organRef: reply.organId });

    if (reply.action === "tour") {
      setPage("lab");
      setTimeout(() => startTour(), 150);
    } else if (reply.action === "journey") {
      setPage("lab");
      setTimeout(() => startJourney(), 150);
    } else if (reply.organId) {
      setPage("lab");
      setTimeout(() => selectOrgan(reply.organId!, { focus: true }), 150);
    }
  }

  return (
    <>
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-xl shadow-cyan-500/20 transition hover:scale-105"
        aria-label="دستیار هوشمند بیومایند"
      >
        {chatOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {chatOpen && (
        <div className="fixed bottom-24 left-5 z-40 flex h-[32rem] w-[22rem] max-w-[90vw] flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur">
          <div className="flex items-center gap-2 border-b border-white/5 bg-gradient-to-l from-cyan-500/10 to-transparent px-4 py-3">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <div>
              <p className="text-sm font-semibold text-white">دستیار هوشمند بیومایند</p>
              <p className="text-[10px] text-slate-500">پاسخ‌گویی آفلاین بر پایه محتوای درسی</p>
            </div>
          </div>

          <div ref={scrollRef} className="scroll-thin flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-xs leading-6 ${
                    m.role === "user"
                      ? "rounded-bl-sm bg-white/10 text-slate-200"
                      : "rounded-br-sm bg-cyan-500/15 text-cyan-100"
                  }`}
                >
                  {m.text}
                  {m.organRef && (
                    <button
                      onClick={() => {
                        setPage("lab");
                        setTimeout(() => selectOrgan(m.organRef!, { focus: true }), 150);
                      }}
                      className="mt-2 block w-full rounded-lg bg-cyan-500/20 px-2 py-1 text-center text-[11px] text-cyan-200 hover:bg-cyan-500/30"
                    >
                      نمایش {ORGAN_EDUCATION[m.organRef].nameFa} در مدل سه‌بعدی
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-white/5 p-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="مثلاً: پانکراس چه کاری انجام می‌دهد؟"
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
            />
            <button
              onClick={send}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-slate-950 transition hover:bg-cyan-400"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
