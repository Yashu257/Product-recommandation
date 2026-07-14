"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, ShieldCheck, Check, ArrowRight, ScanFace } from "lucide-react";
import { SCAN_STEPS, buildVisionReport } from "@/lib/recommend";

const SCAN_MS = 7000;

const TONE = {
  good: "text-sage-700 border-sage-100 bg-sage-50",
  warn: "text-amber-700 border-amber-100 bg-amber-50",
  bad: "text-rose-700 border-rose-100 bg-rose-50",
  info: "text-powder-700 border-powder-100 bg-powder-50",
};
const DOT = { good: "bg-sage-500", warn: "bg-amber-500", bad: "bg-rose-500", info: "bg-powder-500" };

export default function SelfieUpload({ onDone, answers = {} }) {
  const [image, setImage] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | scanning | report
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const report = useMemo(() => buildVisionReport(answers), [answers]);
  const msgIdx = Math.min(SCAN_STEPS.length - 1, Math.floor((progress / 100) * SCAN_STEPS.length));

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setImage(reader.result); setProgress(0); setPhase("scanning"); };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (phase !== "scanning") return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(100, ((now - start) / SCAN_MS) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else setPhase("report");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase !== "report") return;
    const t = setTimeout(() => onDone(true), 4200);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center px-6 py-16 text-center"
    >
      <span className="eyebrow">
        <ScanFace size={14} strokeWidth={1.8} /> Optional
      </span>
      <h2 className="mt-4 font-display text-3xl font-500 leading-tight text-stone-900">
        {phase === "report" ? "Your skin, analyzed" : "Add a skin scan"}
      </h2>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed t-body text-pretty">
        {phase === "idle" && "For a more precise reading, GlowAI can assess your photo for hydration, oil and tone. This is optional — you can skip it."}
        {phase === "scanning" && "Reading your skin — this takes a few seconds."}
        {phase === "report" && "A visual estimate to refine your recommendations. Continuing to your report…"}
      </p>

      <div className="mt-8 w-full">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-card">
              <button
                onClick={() => inputRef.current?.click()}
                className="group flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/60 px-6 py-12 transition-colors hover:border-sage-400 hover:bg-sage-50/50"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-50 text-sage-600 transition-transform group-hover:scale-105">
                  <Camera size={24} strokeWidth={1.7} />
                </span>
                <span className="text-[15px] font-semibold text-stone-800">Upload a photo</span>
                <span className="text-[12.5px] t-muted">JPG or PNG · front-facing works best</span>
              </button>
              <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />

              <div className="mt-5 flex flex-col items-center gap-3">
                <button onClick={() => inputRef.current?.click()} className="btn-primary w-full sm:w-auto">
                  <Upload size={17} /> Upload selfie
                </button>
                <button onClick={() => onDone(false)} className="text-[14px] font-medium t-muted transition-colors hover:text-stone-800">
                  Skip — continue without a photo
                </button>
                <p className="mt-1 flex items-center gap-1.5 text-[12px] t-muted">
                  <ShieldCheck size={13} /> Your photo never leaves your device.
                </p>
              </div>
            </motion.div>
          )}

          {phase !== "idle" && image && (
            <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6">
              <Scanner image={image} phase={phase} progress={progress} message={SCAN_STEPS[msgIdx]} />
              {phase === "report" && <VisionReport report={report} onContinue={() => onDone(true)} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

function Scanner({ image, phase, progress, message }) {
  const scanning = phase === "scanning";
  return (
    <div className="w-full max-w-[300px]">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="Your selfie" className="h-full w-full object-cover" />

        {scanning && (
          <>
            {/* soft light sweep */}
            <motion.div
              className="absolute inset-x-0 h-24 bg-gradient-to-b from-white/0 via-white/35 to-white/0"
              animate={{ top: ["-20%", "100%"] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-x-0 h-px bg-sage-300/80"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}

        {/* quiet corner ticks */}
        {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "left-3 bottom-3 border-b border-l", "right-3 bottom-3 border-b border-r"].map((c) => (
          <span key={c} className={`absolute h-5 w-5 rounded-[3px] border-white/70 ${c}`} />
        ))}

        {phase === "report" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/25 backdrop-blur-[2px]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sage-600 shadow-card">
              <Check size={24} strokeWidth={2.5} />
            </span>
            <p className="mt-2.5 text-[13.5px] font-semibold text-white">Analysis complete</p>
          </motion.div>
        )}
      </div>

      {/* caption + progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[12.5px]">
          <AnimatePresence mode="wait">
            <motion.span key={scanning ? message : "done"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="font-medium text-stone-600">
              {scanning ? message : "Complete"}
            </motion.span>
          </AnimatePresence>
          <span className="tnum font-semibold text-stone-700">{Math.round(scanning ? progress : 100)}%</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-stone-200">
          <div className="h-full rounded-full bg-sage-500 transition-[width] duration-200" style={{ width: `${scanning ? progress : 100}%` }} />
        </div>
      </div>
    </div>
  );
}

function VisionReport({ report, onContinue }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-[420px] rounded-3xl border border-stone-200/80 bg-white p-6 text-left shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13.5px] font-semibold text-stone-800">Visual analysis</p>
          <p className="text-[11.5px] t-muted">Estimate · refines your report</p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-600 text-sage-700 tnum">{report.confidence}%</p>
          <p className="-mt-1 text-[10px] font-semibold uppercase tracking-wide t-muted">Confidence</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {report.metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className={`rounded-2xl border p-3 ${TONE[m.tone] || TONE.info}`}>
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${DOT[m.tone] || DOT.info}`} />
              <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{m.label}</p>
            </div>
            <p className="mt-1 font-display text-[15.5px] font-500">{m.value}</p>
            {typeof m.pct === "number" && (
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-black/10">
                <motion.div className="h-full rounded-full bg-current" initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ duration: 0.9, delay: 0.3 }} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <button onClick={onContinue} className="btn-primary mt-5 w-full text-sm">
        Continue to my report <ArrowRight size={16} />
      </button>
      <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-stone-200">
        <motion.div className="h-full rounded-full bg-sage-400" initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 4.2, ease: "linear" }} />
      </div>
    </motion.div>
  );
}
