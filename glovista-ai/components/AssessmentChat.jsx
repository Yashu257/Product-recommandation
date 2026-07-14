"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { QUESTIONS, TOTAL_STEPS } from "@/data/questions";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";

const INTRO = [
  "Hello — I'm GlowAI, Glovista's skin consultant.",
  "I'll ask a few short questions to understand your skin, then suggest a routine that fits. This takes about a minute.",
];

function formatAnswer(q, value) {
  if (q.type === "number") return `${value}`;
  if (q.type === "single") return q.options.find((o) => o.value === value)?.label ?? value;
  if (q.type === "multi")
    return value.map((v) => q.options.find((o) => o.value === v)?.label ?? v).join(", ");
  return String(value);
}

function ackFor(q, value) {
  const displayed = formatAnswer(q, value);
  switch (q.id) {
    case "age": return "Thank you.";
    case "gender": return "Noted.";
    case "skinType": return `${displayed} skin — that tells me a lot about what your skin needs.`;
    case "concerns": return `Understood. I'll focus on ${displayed}.`;
    case "severity": return "Got it — I'll calibrate the strength of the actives accordingly.";
    case "duration": return "That helps me set a realistic timeline for you.";
    case "routine": return "Good to know — I'll keep the routine easy to maintain.";
    case "allergies": return value === "yes" ? "Noted — I'll lean toward gentle, fragrance-free options." : "Thank you.";
    case "budget": return "That's everything I need. Let me put your report together.";
    default: return "Thank you.";
  }
}

export default function AssessmentChat({ onComplete, onExit }) {
  const [bubbles, setBubbles] = useState([]);
  const [queue, setQueue] = useState([...INTRO, QUESTIONS[0].prompt]);
  const [showTyping, setShowTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [awaitStep, setAwaitStep] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [answers, setAnswers] = useState({});
  const [multiSel, setMultiSel] = useState([]);
  const [numVal, setNumVal] = useState("");

  const busyRef = useRef(false);
  const endRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const current = QUESTIONS[awaitStep];
  const anyTyping = bubbles.some((b) => b.typing);

  useEffect(() => {
    if (busyRef.current || anyTyping) return;
    if (queue.length > 0) {
      const next = queue[0];
      busyRef.current = true;
      setShowTyping(true);
      const t = setTimeout(() => {
        setShowTyping(false);
        setBubbles((prev) => [...prev, { from: "ai", text: next, typing: true }]);
        setQueue((q) => q.slice(1));
        busyRef.current = false;
      }, 560);
      return () => { clearTimeout(t); busyRef.current = false; };
    }
    if (finishing) {
      busyRef.current = true;
      const t = setTimeout(() => onCompleteRef.current(answers), 650);
      return () => { clearTimeout(t); busyRef.current = false; };
    }
  }, [bubbles, queue, finishing, anyTyping, answers]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [bubbles, showTyping, awaitStep]);

  useEffect(() => { setMultiSel([]); setNumVal(""); }, [awaitStep]);

  const markTyped = (idx) =>
    setBubbles((prev) => prev.map((b, i) => (i === idx ? { ...b, typing: false } : b)));

  const commit = (value) => {
    const q = QUESTIONS[step];
    const nextAnswers = { ...answers, [q.id]: value };
    setAnswers(nextAnswers);
    setBubbles((prev) => [...prev, { from: "user", text: formatAnswer(q, value), typing: false }]);
    setAwaitStep(-1);
    const ack = ackFor(q, value);
    if (step + 1 >= TOTAL_STEPS) {
      setQueue([ack]);
      setFinishing(true);
    } else {
      const nextStep = step + 1;
      setQueue([ack, QUESTIONS[nextStep].prompt]);
      setStep(nextStep);
      setAwaitStep(nextStep);
    }
  };

  const toggleMulti = (val) =>
    setMultiSel((s) => (s.includes(val) ? s.filter((v) => v !== val) : [...s, val]));

  const numValid = useMemo(() => {
    if (current?.type !== "number") return false;
    const n = Number(numVal);
    return Number.isFinite(n) && n >= current.min && n <= current.max;
  }, [numVal, current]);

  const showControls =
    !!current && awaitStep === step && queue.length === 0 && !anyTyping && !showTyping && !finishing;

  const pct = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-2xl px-6 pb-40 pt-10"
    >
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-[12.5px] font-medium t-muted">
          <span>Skin consultation</span>
          <span className="tnum">Question {Math.min(step + 1, TOTAL_STEPS)} of {TOTAL_STEPS}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
          <motion.div
            className="h-full rounded-full bg-sage-500"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Conversation */}
      <div className="space-y-5">
        {bubbles.map((b, i) => (
          <ChatBubble key={i} from={b.from} text={b.text} typing={b.typing} onTyped={() => markTyped(i)} />
        ))}
        <AnimatePresence>{showTyping && <TypingIndicator key="ti" />}</AnimatePresence>
      </div>

      {/* Answer dock */}
      <AnimatePresence mode="wait">
        {showControls && (
          <motion.div
            key={`dock-${step}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 rounded-3xl border border-stone-200/80 bg-white p-5 shadow-card"
          >
            {current.hint && <p className="mb-3 text-[12.5px] t-muted text-pretty">{current.hint}</p>}

            {current.type === "number" && (
              <NumberInput
                value={numVal}
                onChange={setNumVal}
                placeholder={current.placeholder}
                valid={numValid}
                onSubmit={() => numValid && commit(Number(numVal))}
              />
            )}
            {current.type === "single" && (
              <OptionGrid options={current.options} onPick={(v) => commit(v)} />
            )}
            {current.type === "multi" && (
              <div>
                <OptionGrid options={current.options} selected={multiSel} multi onPick={toggleMulti} />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[12.5px] t-muted">
                    {multiSel.length ? `${multiSel.length} selected` : "Select all that apply"}
                  </span>
                  <button disabled={!multiSel.length} onClick={() => commit(multiSel)} className="btn-primary !px-5 !py-2.5 text-sm">
                    Continue <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={endRef} />
    </motion.section>
  );
}

function NumberInput({ value, onChange, placeholder, valid, onSubmit }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        inputMode="numeric"
        autoFocus
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        className="w-full rounded-2xl border border-stone-300 bg-white px-5 py-3.5 text-[16px] font-medium text-stone-800 outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
      <button disabled={!valid} onClick={onSubmit} aria-label="Continue" className="btn-primary shrink-0 !px-5 !py-3.5">
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

function OptionGrid({ options, selected = [], onPick, multi = false }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {options.map((o) => {
        const isSel = selected.includes(o.value);
        return (
          <button
            key={o.value}
            onClick={() => onPick(o.value)}
            aria-label={o.label}
            aria-pressed={multi ? isSel : undefined}
            className={`group relative flex flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left transition-all duration-200 ease-smooth ${
              isSel
                ? "border-sage-400 bg-sage-50 ring-1 ring-sage-200"
                : "border-stone-200 bg-white hover:-translate-y-[1px] hover:border-stone-300 hover:bg-stone-50"
            }`}
          >
            <span className="flex w-full items-center justify-between">
              <span className="text-lg">{o.emoji}</span>
              {multi && (
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${isSel ? "border-sage-500 bg-sage-500 text-white" : "border-stone-300 bg-white"}`}>
                  {isSel && <Check size={12} strokeWidth={3} />}
                </span>
              )}
            </span>
            <span className="text-[14px] font-medium text-stone-800">{o.label}</span>
            {o.desc && <span className="text-[11.5px] leading-tight t-muted">{o.desc}</span>}
          </button>
        );
      })}
    </div>
  );
}
