"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import BrandMark from "./BrandMark";
import Reveal from "./Reveal";

const COLUMNS = [
  { title: "Shop", links: ["Cleansers", "Moisturizers", "Treatments", "Wellness", "Kits"] },
  { title: "Company", links: ["About", "Ingredients", "Sustainability", "Journal", "Careers"] },
  { title: "Support", links: ["Contact", "Shipping & returns", "FAQ", "Track order", "Privacy"] },
];

export default function Footer({ onStart }) {
  return (
    <footer id="footer" className="no-print">
      {/* CTA band */}
      <div className="container-x">
        <Reveal>
          <div
            className="overflow-hidden rounded-[2.25rem] border border-stone-200/70 px-8 py-14 text-center shadow-card sm:px-12"
            style={{ background: "linear-gradient(155deg, #EEF1EB 0%, #F4EEE3 100%)" }}
          >
            <p className="eyebrow justify-center">
              <Sparkles size={14} strokeWidth={1.9} /> Two minutes to better skin
            </p>
            <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl font-500 leading-tight text-stone-900 sm:text-[2.4rem]">
              Let GlowAI build your routine.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed t-body text-pretty">
              A short, thoughtful consultation — and a routine chosen for your skin, not the trends.
            </p>
            <button onClick={onStart} className="btn-primary group mx-auto mt-8 !px-7 !py-3.5 text-base">
              <Sparkles size={17} strokeWidth={1.9} />
              Start AI Skin Analysis
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </Reveal>
      </div>

      {/* Footer body */}
      <div className="container-x pb-12 pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <BrandMark />
            <p className="mt-4 text-[14px] leading-relaxed t-muted text-pretty">
              Clinically-informed skincare, intelligently personalized. Made without parabens,
              sulfates or synthetic fragrance.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex items-center gap-2 rounded-full border border-stone-300 bg-white p-1.5 pl-4"
            >
              <input
                type="email"
                placeholder="Email for skin tips"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent text-[14px] text-stone-700 outline-none placeholder:text-stone-400"
              />
              <button type="submit" aria-label="Subscribe" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-700 text-white transition-colors hover:bg-sage-800">
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[13px] font-semibold uppercase tracking-wideish text-stone-400">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[14px] text-stone-600 transition-colors hover:text-stone-900">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-stone-200 pt-6 text-[12.5px] t-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Glovista. All rights reserved.</p>
          <p className="max-w-lg text-pretty">
            GlowAI recommendations are informational and not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
