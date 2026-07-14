"use client";

import { Star, Quote } from "lucide-react";
import Reveal from "./Reveal";

const REVIEWS = [
  {
    quote: "The AI analysis actually understood my combination skin. Three products, not thirty — and my breakouts have calmed right down.",
    name: "Ananya R.",
    meta: "Combination skin · 3 months",
  },
  {
    quote: "Finally a brand that explains what's in the bottle and why. The Cera Restore moisturizer fixed my winter dryness.",
    name: "Meera K.",
    meta: "Dry skin · 6 weeks",
  },
  {
    quote: "I was skeptical about an AI consultant, but it felt like talking to a thoughtful dermatologist. Genuinely helpful.",
    name: "Rahul V.",
    meta: "Oily skin · 2 months",
  },
];

export default function Reviews() {
  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Loved by our community</p>
          <h2 className="mt-3 font-display text-3xl font-500 leading-tight text-stone-900 sm:text-[2.5rem]">
            Real skin, real results.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.08}>
              <figure className="card card-hover flex h-full flex-col p-7">
                <Quote size={22} className="text-sage-300" />
                <div className="mt-3 flex">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} size={15} className="fill-sand-400 text-sand-400" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-stone-700 text-pretty">
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-stone-100 pt-4">
                  <p className="text-[14px] font-semibold text-stone-800">{r.name}</p>
                  <p className="text-[12.5px] t-muted">{r.meta}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
