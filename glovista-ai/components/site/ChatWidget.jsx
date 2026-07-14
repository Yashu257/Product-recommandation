"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, ArrowRight, Check, RotateCcw, ClipboardList } from "lucide-react";
import { QUESTIONS, TOTAL_STEPS } from "@/data/questions";
import { buildRecommendation } from "@/lib/recommend";
import ChatBubble from "../ChatBubble";
import TypingIndicator from "../TypingIndicator";
import ProductVisual from "./ProductVisual";

const INTRO = [
  "Hi — I'm GlowAI, Glovista's skin consultant.",
  "Tell me a little about your skin and I'll suggest products that fit. It only takes a moment.",
];

function formatAnswer(q, value) {
  if (q.type === "number") return `${value}`;
  if (q.type === "single") return q.options.find((o) => o.value === value)?.label ?? value;
  if (q.type === "multi") return value.map((v) => q.options.find((o) => o.value === v)?.label ?? v).join(", ");
  return String(value);
}

function ackFor(q, value) {
  const d = formatAnswer(q, value);
  switch (q.id) {
    case "age": return "Thanks.";
    case "gender": return "Noted.";
    case "skinType": return `${d} skin — good to know.`;
    case "concerns": return `Got it, I'll focus on ${d}.`;
    case "severity": return "Understood.";
    case "duration": return "Thanks.";
    case "routine": return "Noted.";
    case "allergies": return value === "yes" ? "I'll keep it gentle then." : "Great.";
    case "budget": return "Perfect — here's what I'd suggest within your budget.";
    default: return "Thanks.";
  }
}

export default function ChatWidget({ open, onOpenChange, onOpenReport }) {
  const [bubbles, setBubbles] = useState([]);
  const [queue, setQueue] = useState([...INTRO, QUESTIONS[0].prompt]);
  const [showTyping, setShowTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [awaitStep, setAwaitStep] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [answers, setAnswers] = useState({});
  const [multiSel, setMultiSel] = useState([]);
  const [numVal, setNumVal] = useState("");
  const [result, setResult] = useState(null);

  const busyRef = useRef(false);
  const endRef = useRef(null);
  const current = QUESTIONS[awaitStep];
  const anyTyping = bubbles.some((b) => b.typing);

  // Speech queue
  useEffect(() => {
    if (!open || busyRef.current || anyTyping) return;
    if (queue.length > 0) {
      const next = queue[0];
      busyRef.current = true;
      setShowTyping(true);
      const t = setTimeout(() => {
        setShowTyping(false);
        setBubbles((prev) => [...prev, { from: "ai", text: next, typing: true }]);
        setQueue((q) => q.slice(1));
        busyRef.current = false;
      }, 520);
      return () => { clearTimeout(t); busyRef.current = false; };
    }
    if (finishing) {
      busyRef.current = true;
      const t = setTimeout(() => {
        setResult(buildRecommendation(answers));
        busyRef.current = false;
      }, 700);
      return () => { clearTimeout(t); busyRef.current = false; };
    }
  }, [open, bubbles, queue, finishing, anyTyping, answers]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [bubbles, showTyping, awaitStep, result]);

  useEffect(() => { setMultiSel([]); setNumVal(""); }, [awaitStep]);

  const markTyped = (idx) => setBubbles((prev) => prev.map((b, i) => (i === idx ? { ...b, typing: false } : b)));

  const commit = (value) => {
    const q = QUESTIONS[step];
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    setBubbles((prev) => [...prev, { from: "user", text: formatAnswer(q, value), typing: false }]);
    setAwaitStep(-1);
    const ack = ackFor(q, value);
    if (step + 1 >= TOTAL_STEPS) {
      setQueue([ack]);
      setFinishing(true);
    } else {
      const ns = step + 1;
      setQueue([ack, QUESTIONS[ns].prompt]);
      setStep(ns);
      setAwaitStep(ns);
    }
  };

  const restart = () => {
    setBubbles([]); setQueue([...INTRO, QUESTIONS[0].prompt]); setShowTyping(false);
    setStep(0); setAwaitStep(0); setFinishing(false); setAnswers({}); setResult(null);
    setMultiSel([]); setNumVal(""); busyRef.current = false;
  };

  const toggleMulti = (v) => setMultiSel((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  const numValid = useMemo(() => {
    if (current?.type !== "number") return false;
    const n = Number(numVal);
    return Number.isFinite(n) && n >= current.min && n <= current.max;
  }, [numVal, current]);

  const showControls = !result && !!current && awaitStep === step && queue.length === 0 && !anyTyping && !showTyping && !finishing;
  const pct = result ? 100 : Math.round((step / TOTAL_STEPS) * 100);

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onOpenChange(true)}
            className="no-print fixed bottom-5 right-5 z-[70] flex items-center gap-2.5 rounded-full bg-sage-700 py-3 pl-3 pr-5 text-white shadow-hover transition-colors hover:bg-sage-800 sm:bottom-6 sm:right-6"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <Sparkles size={17} strokeWidth={1.9} />
            </span>
            <span className="text-[14.5px] font-medium">Ask GlowAI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="no-print fixed inset-x-3 bottom-3 z-[70] flex max-h-[82vh] flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-paper shadow-hover sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[640px] sm:max-h-[calc(100vh-3rem)] sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200/70 bg-white px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-sage-200 bg-sage-50 text-sage-600">
                  <Sparkles size={17} strokeWidth={1.8} />
                </span>
                <div className="leading-tight">
                  <p className="text-[14.5px] font-semibold text-stone-800">GlowAI</p>
                  <p className="flex items-center gap-1 text-[11.5px] t-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-sage-500" /> Skin consultant
                  </p>
                </div>
              </div>
              <button onClick={() => onOpenChange(false)} aria-label="Close chat" className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800">
                <X size={18} />
              </button>
            </div>

            {/* Progress */}
            <div className="h-1 w-full bg-stone-100">
              <motion.div className="h-full bg-sage-500" animate={{ width: `${pct}%` }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
            </div>

            {/* Messages */}
            <div className="scroll-soft flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {bubbles.map((b, i) => (
                <ChatBubble key={i} from={b.from} text={b.text} typing={b.typing} onTyped={() => markTyped(i)} />
              ))}
              <AnimatePresence>{showTyping && <TypingIndicator key="ti" />}</AnimatePresence>

              {result && <ResultBlock result={result} onOpenReport={onOpenReport} onRestart={restart} />}

              <div ref={endRef} />
            </div>

            {/* Controls */}
            <AnimatePresence mode="wait">
              {showControls && (
                <motion.div
                  key={`dock-${step}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-stone-200/70 bg-white p-3"
                >
                  {current.hint && <p className="mb-2 px-1 text-[11.5px] t-muted text-pretty">{current.hint}</p>}

                  {current.type === "number" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number" inputMode="numeric" autoFocus value={numVal} placeholder={current.placeholder}
                        onChange={(e) => setNumVal(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && numValid && commit(Number(numVal))}
                        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-[15px] font-medium text-stone-800 outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
                      />
                      <button disabled={!numValid} onClick={() => commit(Number(numVal))} aria-label="Send" className="btn-primary shrink-0 !px-4 !py-2.5">
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  )}

                  {current.type === "single" && (
                    <div className="grid grid-cols-2 gap-2">
                      {current.options.map((o) => (
                        <OptionButton key={o.value} option={o} onClick={() => commit(o.value)} />
                      ))}
                    </div>
                  )}

                  {current.type === "multi" && (
                    <div>
                      <div className="grid max-h-[168px] grid-cols-2 gap-2 overflow-y-auto scroll-soft pr-0.5">
                        {current.options.map((o) => (
                          <OptionButton key={o.value} option={o} selected={multiSel.includes(o.value)} multi onClick={() => toggleMulti(o.value)} />
                        ))}
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="pl-1 text-[11.5px] t-muted">{multiSel.length ? `${multiSel.length} selected` : "Select all that apply"}</span>
                        <button disabled={!multiSel.length} onClick={() => commit(multiSel)} className="btn-primary !px-4 !py-2 text-[13px]">
                          Continue <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function OptionButton({ option, selected, multi, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={option.label}
      aria-pressed={multi ? selected : undefined}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all duration-200 ${
        selected ? "border-sage-400 bg-sage-50 ring-1 ring-sage-200" : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
      }`}
    >
      <span className="text-base">{option.emoji}</span>
      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-stone-800">{option.label}</span>
      {multi && (
        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${selected ? "border-sage-500 bg-sage-500 text-white" : "border-stone-300 bg-white"}`}>
          {selected && <Check size={11} strokeWidth={3} />}
        </span>
      )}
    </button>
  );
}

function ResultBlock({ result, onOpenReport, onRestart }) {
  const { products, skinType } = result;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="pl-[46px]">
      <p className="mb-2.5 text-[12px] font-medium t-muted">
        {products.length} product{products.length === 1 ? "" : "s"} for your {skinType.toLowerCase()} skin, within budget
      </p>
      <div className="space-y-2.5">
        {products.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3 rounded-2xl border border-stone-200/80 bg-white p-2.5 shadow-sm">
            <ProductVisual id={p.id} category={p.category} className="h-14 w-14 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[14.5px] font-500 text-stone-800">{p.name}</p>
              <p className="truncate text-[11.5px] t-muted">{p.tagline}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-[14px] font-600 text-stone-800 tnum">₹{p.price}</p>
              <button className="mt-0.5 text-[11px] font-medium text-sage-700 hover:underline">View</button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-3.5 flex flex-col gap-2">
        <button onClick={() => onOpenReport(result)} className="btn-primary w-full !py-2.5 text-[13.5px]">
          <ClipboardList size={15} /> See full routine &amp; report
        </button>
        <button onClick={onRestart} className="btn-secondary w-full !py-2.5 text-[13.5px]">
          <RotateCcw size={14} /> Start over
        </button>
      </div>
    </motion.div>
  );
}
