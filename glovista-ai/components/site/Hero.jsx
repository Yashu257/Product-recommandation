"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Star, Leaf } from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

export default function Hero({ onStart }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="container-x grid items-center gap-12 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-24">
        {/* Copy */}
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="eyebrow"
          >
            <Leaf size={14} strokeWidth={1.9} /> Dermatologist-tested · Clean formulas
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="mt-5 font-display text-[2.9rem] font-500 leading-[1.05] tracking-tightest text-stone-900 sm:text-6xl"
          >
            Skincare that <span className="accent-serif font-500">understands</span> your skin.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="mt-6 max-w-lg text-[17px] leading-relaxed t-body text-pretty"
          >
            Glovista pairs clinically-informed formulas with GlowAI — a personal skin
            consultant that builds a routine around your skin, not the trends.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.19, ease }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <button onClick={onStart} className="btn-primary group !px-7 !py-3.5 text-base">
              <Sparkles size={17} strokeWidth={1.9} />
              Start AI Analysis
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
            <a href="#best-sellers" className="btn-secondary !px-7 !py-3.5 text-base">
              Shop best sellers
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] t-muted"
          >
            <span className="flex items-center gap-1.5">
              <span className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={13} className="fill-sand-400 text-sand-400" />
                ))}
              </span>
              4.8 · 12,000+ reviews
            </span>
            <span className="hidden h-3 w-px bg-stone-300 sm:block" />
            <span>Cruelty-free</span>
            <span className="hidden h-3 w-px bg-stone-300 sm:block" />
            <span>Made without parabens &amp; sulfates</span>
          </motion.div>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="relative"
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[440px]">
      {/* Soft product panel */}
      <div
        className="absolute inset-0 overflow-hidden rounded-[2.25rem] border border-stone-200/70 shadow-card"
        style={{ background: "linear-gradient(160deg, #EEF1EB 0%, #F4EEE3 100%)" }}
      >
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/40 blur-2xl" />
        <div className="absolute bottom-8 left-6 h-40 w-40 rounded-full bg-sage-100/60 blur-2xl" />

        {/* Serum bottle illustration */}
        <svg viewBox="0 0 240 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
          <ellipse cx="120" cy="256" rx="70" ry="10" fill="#000" opacity="0.05" />
          <g fill="none" stroke="#5B6B53" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
            <rect x="86" y="120" width="68" height="120" rx="18" fill="#ffffff" fillOpacity="0.55" />
            <path d="M104 120v-16h32v16" />
            <rect x="102" y="66" width="36" height="26" rx="8" fill="#5B6B53" stroke="none" />
            <path d="M138 78h20v14" />
            <line x1="98" y1="176" x2="142" y2="176" stroke="#5B6B53" strokeOpacity="0.4" strokeWidth="2" />
          </g>
          <text x="120" y="205" textAnchor="middle" className="font-display" fontSize="15" fill="#5B6B53" opacity="0.85">
            Glovista
          </text>
        </svg>
      </div>

      {/* Subtle AI hint card (present, not dominant) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl border border-stone-200/80 bg-white/95 px-4 py-3 shadow-card backdrop-blur sm:-left-8"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-50 text-sage-600">
          <Sparkles size={16} strokeWidth={1.9} />
        </span>
        <div className="leading-tight">
          <p className="text-[13px] font-semibold text-stone-800">GlowAI skin analysis</p>
          <p className="text-[12px] t-muted">Personalized in ~60 seconds</p>
        </div>
      </motion.div>
    </div>
  );
}
