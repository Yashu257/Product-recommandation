"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Reveal from "./Reveal";

const POINTS = [
  { title: "Formulated with intent", text: "Every product earns its place. We publish full ingredient lists and the reasoning behind each active." },
  { title: "Guided, not guessed", text: "GlowAI reads your skin profile and recommends only what's relevant — no 12-step routines you won't keep." },
  { title: "Proven, gentle actives", text: "Ceramides, niacinamide, hyaluronic acid and vitamin C, at concentrations your barrier can tolerate." },
];

export default function WhyGlovista() {
  return (
    <section id="why" className="section-y">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Visual */}
        <Reveal className="order-last lg:order-first">
          <div
            className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-stone-200/70 shadow-card"
            style={{ background: "linear-gradient(155deg, #EBF1F3 0%, #EEF1EB 100%)" }}
          >
            <div className="absolute -left-8 top-8 h-40 w-40 rounded-full bg-white/50 blur-2xl" />
            <svg viewBox="0 0 320 260" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
              <g fill="none" stroke="#547181" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
                <rect x="70" y="96" width="60" height="108" rx="16" fill="#fff" fillOpacity="0.55" />
                <rect x="82" y="72" width="36" height="24" rx="7" fill="#547181" stroke="none" />
                <rect x="150" y="120" width="52" height="84" rx="14" fill="#fff" fillOpacity="0.5" />
                <rect x="160" y="100" width="32" height="20" rx="6" fill="#5B6B53" stroke="none" />
                <rect x="216" y="108" width="46" height="96" rx="14" fill="#fff" fillOpacity="0.5" />
                <rect x="224" y="88" width="30" height="20" rx="6" fill="#547181" stroke="none" />
              </g>
              <ellipse cx="170" cy="216" rx="120" ry="8" fill="#000" opacity="0.04" />
            </svg>
          </div>
        </Reveal>

        {/* Copy */}
        <div>
          <Reveal>
            <p className="eyebrow">Why Glovista</p>
            <h2 className="mt-4 font-display text-3xl font-500 leading-tight text-stone-900 sm:text-[2.5rem]">
              Skincare designed to be understood.
            </h2>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed t-body text-pretty">
              We believe good skincare should be transparent and easy to trust — from what's
              inside the bottle to why it's right for you.
            </p>
          </Reveal>

          <div className="mt-8 space-y-6">
            {POINTS.map((p, i) => (
              <Reveal key={p.title} delay={0.08 + i * 0.08}>
                <div className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                    <Check size={14} strokeWidth={2.6} />
                  </span>
                  <div>
                    <h3 className="text-[15.5px] font-semibold text-stone-800">{p.title}</h3>
                    <p className="mt-1 max-w-md text-[14px] leading-relaxed t-muted text-pretty">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
