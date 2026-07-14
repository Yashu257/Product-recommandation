"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, MessageSquareText, ScanFace, ClipboardList } from "lucide-react";
import Reveal from "./Reveal";

const STEPS = [
  { icon: MessageSquareText, title: "A short consultation", text: "Answer a few considered questions about your skin and goals." },
  { icon: ScanFace, title: "Optional skin scan", text: "Add a selfie for a closer read on hydration, oil and tone." },
  { icon: ClipboardList, title: "Your routine", text: "Receive a personalized regimen with the reasoning behind each pick." },
];

export default function AISection({ onStart }) {
  return (
    <section id="ai" className="section-y">
      <div className="container-x">
        <div
          className="overflow-hidden rounded-[2.25rem] border border-stone-200/70 shadow-card"
          style={{ background: "linear-gradient(155deg, #F1F4EF 0%, #EBF1F3 100%)" }}
        >
          <div className="grid items-center gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
            {/* Copy */}
            <div>
              <Reveal>
                <p className="eyebrow">
                  <Sparkles size={14} strokeWidth={1.9} /> Introducing GlowAI
                </p>
                <h2 className="mt-4 font-display text-3xl font-500 leading-tight text-stone-900 sm:text-[2.6rem]">
                  Meet GlowAI, your personal skin consultant.
                </h2>
                <p className="mt-5 max-w-md text-[16.5px] leading-relaxed t-body text-pretty">
                  Not a chatbot bolted on — a considered consultation built into Glovista.
                  GlowAI listens, reads your skin, and recommends only what's right for you.
                </p>
              </Reveal>

              <div className="mt-8 space-y-5">
                {STEPS.map((s, i) => (
                  <Reveal key={s.title} delay={0.08 + i * 0.07}>
                    <div className="flex gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sage-200 bg-white text-sage-600">
                        <s.icon size={18} strokeWidth={1.7} />
                      </span>
                      <div>
                        <h3 className="text-[15px] font-semibold text-stone-800">{s.title}</h3>
                        <p className="mt-0.5 max-w-sm text-[13.5px] leading-relaxed t-muted text-pretty">{s.text}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.3}>
                <button onClick={onStart} className="btn-primary group mt-9 !px-7 !py-3.5 text-base">
                  <Sparkles size={17} strokeWidth={1.9} />
                  Start AI Skin Analysis
                  <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
                <p className="mt-3 text-[12.5px] t-muted">Free · ~60 seconds · your data stays in your browser</p>
              </Reveal>
            </div>

            {/* Analysis preview */}
            <Reveal delay={0.15}>
              <AnalysisPreview />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalysisPreview() {
  const metrics = [
    { label: "Skin type", value: "Combination" },
    { label: "Hydration", value: "82%", pct: 82 },
    { label: "Oil balance", value: "Moderate" },
    { label: "Barrier", value: "Healthy" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="rounded-[1.75rem] border border-stone-200/80 bg-white/95 p-6 shadow-card backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-50 text-sage-600">
              <Sparkles size={16} strokeWidth={1.9} />
            </span>
            <div className="leading-tight">
              <p className="text-[13.5px] font-semibold text-stone-800">GlowAI skin report</p>
              <p className="text-[11.5px] t-muted">Sample analysis</p>
            </div>
          </div>
          <span className="rounded-full bg-sage-50 px-2.5 py-1 text-[11px] font-semibold text-sage-700">96% match</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-2xl border border-stone-100 bg-stone-50/60 p-3.5">
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-stone-400">{m.label}</p>
              <p className="mt-1 font-display text-[17px] font-500 text-stone-800">{m.value}</p>
              {m.pct && (
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                  <motion.div
                    className="h-full rounded-full bg-sage-400"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${m.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-sage-100 bg-sage-50/60 p-3.5">
          <p className="text-[12.5px] leading-relaxed text-sage-800 text-pretty">
            “A gentle ceramide cleanser and a niacinamide moisturizer will calm your T-zone
            without over-drying.”
          </p>
        </div>
      </div>
    </div>
  );
}
