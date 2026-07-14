"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { THINKING_STEPS } from "@/lib/recommend";
import AIAvatar from "./AIAvatar";

// Quiet processing screen: a simple progress line and a checklist.
export default function ThinkingScreen({ onDone }) {
  const [active, setActive] = useState(0);
  const perStep = 780;

  useEffect(() => {
    const timers = THINKING_STEPS.map((_, i) => setTimeout(() => setActive(i + 1), perStep * (i + 1)));
    const done = setTimeout(onDone, perStep * THINKING_STEPS.length + 650);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, [onDone]);

  const pct = Math.round((active / THINKING_STEPS.length) * 100);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center px-6 py-16 text-center"
    >
      <AIAvatar size={56} />
      <h2 className="mt-6 font-display text-2xl font-500 text-stone-900">Preparing your report</h2>
      <p className="mt-2 max-w-sm text-[14.5px] leading-relaxed t-muted text-pretty">
        GlowAI is matching your profile with Glovista's formulations.
      </p>

      <div className="mt-7 w-full">
        <div className="mb-2 flex items-center justify-between text-[12px] font-medium t-muted">
          <span>Analyzing</span>
          <span className="tnum">{pct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
          <motion.div className="h-full rounded-full bg-sage-500" animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
        </div>
      </div>

      <div className="mt-7 w-full space-y-3 rounded-3xl border border-stone-200/80 bg-white p-6 text-left shadow-card">
        {THINKING_STEPS.map((label, i) => {
          const done = i < active;
          const running = i === active;
          return (
            <div key={label} className={`flex items-center gap-3 transition-opacity ${i > active ? "opacity-40" : "opacity-100"}`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${done ? "bg-sage-500 text-white" : running ? "bg-sage-50 text-sage-600" : "bg-stone-100 text-stone-400"}`}>
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check size={13} strokeWidth={3} />
                    </motion.span>
                  ) : running ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </AnimatePresence>
              </span>
              <span className={`text-[14px] ${done || running ? "text-stone-700" : "text-stone-400"}`}>{label}</span>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
