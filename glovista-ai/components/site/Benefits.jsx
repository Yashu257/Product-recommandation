"use client";

import { FlaskConical, Leaf, Sparkles, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";

const ITEMS = [
  { icon: FlaskConical, title: "Clinically formulated", text: "Actives at researched concentrations, nothing superfluous." },
  { icon: Leaf, title: "Clean ingredients", text: "Free from parabens, sulfates and synthetic fragrance." },
  { icon: Sparkles, title: "AI-personalized", text: "GlowAI tailors a routine to your skin in under a minute." },
  { icon: ShieldCheck, title: "Cruelty-free", text: "Never tested on animals. Vegan across the range." },
];

export default function Benefits() {
  return (
    <section className="border-y border-stone-200/70 bg-white">
      <div className="container-x grid gap-x-8 gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.06} className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-50 text-sage-600">
              <it.icon size={20} strokeWidth={1.7} />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-stone-800">{it.title}</h3>
              <p className="mt-1 text-[13.5px] leading-relaxed t-muted text-pretty">{it.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
