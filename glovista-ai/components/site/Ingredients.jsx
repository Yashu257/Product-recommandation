"use client";

import Reveal from "./Reveal";

const INGREDIENTS = [
  { name: "Niacinamide", note: "Balances oil, refines pores and evens tone.", tint: "#EEF1EB", ink: "#5B6B53" },
  { name: "Hyaluronic Acid", note: "Draws moisture into skin for lasting hydration.", tint: "#EBF1F3", ink: "#547181" },
  { name: "Ceramides", note: "Rebuild and reinforce the skin's barrier.", tint: "#F4EEE3", ink: "#8a744f" },
  { name: "Vitamin C", note: "Brightens and defends against daily stressors.", tint: "#F1EFEA", ink: "#57534E" },
];

export default function Ingredients() {
  return (
    <section id="ingredients" className="section-y">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">The ingredients</p>
          <h2 className="mt-3 font-display text-3xl font-500 leading-tight text-stone-900 sm:text-[2.5rem]">
            Considered actives, clearly explained.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed t-body text-pretty">
            We use proven ingredients at meaningful concentrations — and we tell you exactly
            what each one does for your skin.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INGREDIENTS.map((ing, i) => (
            <Reveal key={ing.name} delay={i * 0.06}>
              <article className="card card-hover h-full overflow-hidden">
                <div className="flex h-32 items-center justify-center" style={{ background: ing.tint }}>
                  <svg viewBox="0 0 80 80" className="h-20 w-20" fill="none" aria-hidden>
                    <circle cx="40" cy="40" r="22" stroke={ing.ink} strokeWidth="1.6" opacity="0.5" />
                    <path d="M40 22c8 6 8 18 0 26-8-8-8-20 0-26z" fill={ing.ink} opacity="0.18" />
                    <path d="M40 22c8 6 8 18 0 26" stroke={ing.ink} strokeWidth="1.6" />
                  </svg>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-500 text-stone-800">{ing.name}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed t-muted text-pretty">{ing.note}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
