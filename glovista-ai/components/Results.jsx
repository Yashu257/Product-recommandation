"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Sunrise, Moon, CalendarDays, FlaskConical, Droplets, Target, RotateCcw,
  ShoppingBag, Droplet, Sun, Wind, Leaf, Utensils, Activity, Gauge, ShieldCheck,
  TrendingUp, Check, ArrowLeft,
} from "lucide-react";
import ProductCard from "./ProductCard";
import ExportBar from "./ExportBar";

const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.05, ease } }),
};

const ROUTINE_META = {
  morning: { icon: Sunrise, label: "Morning" },
  night: { icon: Moon, label: "Night" },
  weekly: { icon: CalendarDays, label: "Weekly" },
};
const LIFE_ICONS = { droplet: Droplet, sun: Sun, moon: Moon, wind: Wind, leaf: Leaf, utensils: Utensils, activity: Activity };

export default function Results({ recommendation, onRestart, onClose }) {
  const {
    skinType, primaryConcern, primaryConcerns, secondaryConcerns, products, routines,
    reasons, confidence, skinScore, hydrationScore, oilBalance, barrierHealth,
    ingredients, lifestyle, timeline,
  } = recommendation;

  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 500); return () => clearTimeout(t); }, []);

  const total = products.reduce((s, p) => s + p.price, 0);
  const summary = useMemo(() => [
    "Glovista · GlowAI skin report",
    `Skin type: ${skinType} (confidence ${confidence}%)`,
    `Primary concerns: ${primaryConcerns.join(", ")}`,
    `Scores — Skin ${skinScore}, Hydration ${hydrationScore}, Oil balance ${oilBalance}, Barrier ${barrierHealth}`,
    "", "Recommended:", ...products.map((p) => `• ${p.name} — ₹${p.price}`),
  ].join("\n"), [recommendation]);

  if (!ready) return <ReportSkeleton />;

  const scores = [
    { label: "Skin Score", value: skinScore, icon: Gauge },
    { label: "Hydration", value: hydrationScore, icon: Droplets },
    { label: "Oil Balance", value: oilBalance, icon: Sun },
    { label: "Barrier Health", value: barrierHealth, icon: ShieldCheck },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-10">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mx-auto max-w-2xl text-center">
        <p className="eyebrow justify-center">
          <Check size={14} strokeWidth={2.2} /> Analysis complete
        </p>
        <h1 className="mt-4 font-display text-[2.4rem] font-500 leading-tight text-stone-900 sm:text-5xl">
          Your personalized skin report
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed t-body text-pretty">
          Based on your consultation, here's a routine chosen for your skin — with the
          reasoning behind every recommendation.
        </p>
      </motion.div>

      {/* Summary */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show" className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
        <SummaryTile icon={Droplets} label="Skin type" value={skinType} />
        <SummaryTile icon={Target} label="Primary concern" value={primaryConcern} />
        <div className="card flex items-center gap-4 p-5">
          <Radial value={confidence} size={58} />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide t-muted">Confidence</p>
            <p className="font-display text-lg font-500 t-head">Strong match</p>
          </div>
        </div>
      </motion.div>

      {(primaryConcerns.length + secondaryConcerns.length > 1) && (
        <div className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-2">
          {primaryConcerns.map((c) => <span key={c} className="chip !bg-sage-50 !border-sage-100 !text-sage-700">{c}</span>)}
          {secondaryConcerns.map((c) => <span key={c} className="chip">{c}</span>)}
        </div>
      )}

      {/* Scores */}
      <Section eyebrow="Skin diagnostics" title="Your skin analysis" subtitle="Estimated across four key dimensions.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {scores.map((s, i) => <ScoreCard key={s.label} {...s} index={i} />)}
        </div>
      </Section>

      {/* Products */}
      <Section eyebrow="Curated for you" title="Recommended products" subtitle={`A ${products.length}-product regimen · ₹${total} total`}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} showWhy />)}
        </div>
      </Section>

      {/* Ingredients */}
      {ingredients.length > 0 && (
        <Section eyebrow="Actives that work" title="Recommended ingredients" subtitle="The hero actives in your routine and what each one does.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ingredients.map((ing, i) => (
              <motion.div key={ing.name} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} className="card p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-50 text-sage-600"><FlaskConical size={18} strokeWidth={1.7} /></span>
                <h3 className="mt-3 font-display text-[17px] font-500 t-head">{ing.name}</h3>
                <p className="mt-1 text-[13.5px] leading-relaxed t-muted text-pretty">{ing.benefit}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Routines */}
      <Section eyebrow="Your daily ritual" title="Morning, night & weekly" subtitle="Follow consistently for four to six weeks to see the full effect.">
        <div className="grid gap-6 lg:grid-cols-3">
          {["morning", "night", "weekly"].map((k, i) => <RoutineCard key={k} type={k} steps={routines[k]} index={i} />)}
        </div>
      </Section>

      {/* Reasons */}
      <Section eyebrow="The reasoning" title="Why these picks" subtitle="Every recommendation is grounded in your specific profile.">
        <div className="grid gap-4 sm:grid-cols-2">
          {reasons.map((r, i) => (
            <motion.div key={r.title} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} className="card flex gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-50 text-sage-600"><FlaskConical size={18} strokeWidth={1.7} /></span>
              <div>
                <h3 className="font-display text-[16px] font-500 t-head">{r.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed t-muted text-pretty">{r.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Lifestyle */}
      <Section eyebrow="Beyond products" title="Lifestyle notes" subtitle="Small daily habits that amplify your results.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lifestyle.map((tip, i) => {
            const Icon = LIFE_ICONS[tip.icon] || Leaf;
            return (
              <motion.div key={tip.text} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} className="card flex items-start gap-3 p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-50 text-sage-600"><Icon size={17} strokeWidth={1.7} /></span>
                <p className="text-[14px] leading-relaxed t-body text-pretty">{tip.text}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Timeline */}
      <Section eyebrow="What to expect" title="Your improvement timeline" subtitle="A realistic view of your skin journey with this routine.">
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-stone-200 sm:left-1/2" />
          <div className="space-y-6">
            {timeline.map((t, i) => (
              <motion.div key={t.week} initial={{ opacity: 0, x: i % 2 ? 24 : -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, ease }}
                className={`relative flex items-start gap-4 pl-11 sm:w-1/2 sm:pl-0 ${i % 2 ? "sm:ml-auto sm:pl-10" : "sm:pr-10 sm:text-right sm:flex-row-reverse"}`}>
                <span className="absolute left-2.5 top-5 z-10 h-2.5 w-2.5 rounded-full bg-sage-500 ring-4 ring-paper sm:left-1/2 sm:-translate-x-1/2" />
                <div className="card w-full p-5">
                  <span className="chip !bg-sage-50 !border-sage-100 !text-sage-700">{t.week}</span>
                  <h3 className="mt-2 font-display text-[16px] font-500 t-head">{t.title}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed t-muted text-pretty">{t.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Export + CTA */}
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-20 rounded-[2rem] border border-stone-200/70 bg-white p-10 text-center shadow-card">
        <h2 className="font-display text-2xl font-500 text-stone-900">Take your report with you</h2>
        <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed t-body text-pretty">Download, email, share or print your GlowAI report.</p>
        <div className="mt-6"><ExportBar summary={summary} /></div>
        <div className="no-print mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button className="btn-primary text-base"><ShoppingBag size={17} /> Add routine to cart · <span className="tnum">₹{total}</span></button>
          <button onClick={onRestart} className="btn-secondary text-base"><RotateCcw size={16} /> Retake analysis</button>
          {onClose && <button onClick={onClose} className="btn-ghost text-base"><ArrowLeft size={16} /> Back to shop</button>}
        </div>
      </motion.div>
    </section>
  );
}

function Section({ eyebrow, title, subtitle, children }) {
  return (
    <div className="mt-20">
      <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-xl text-center">
        <p className="eyebrow justify-center">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl font-500 leading-tight text-stone-900">{title}</h2>
        <p className="mt-2 text-[15px] leading-relaxed t-muted text-pretty">{subtitle}</p>
      </motion.div>
      <div className="mt-10">{children}</div>
    </div>
  );
}

function SummaryTile({ icon: Icon, label, value }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-50 text-sage-600"><Icon size={20} strokeWidth={1.7} /></span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide t-muted">{label}</p>
        <p className="font-display text-lg font-500 t-head">{value}</p>
      </div>
    </div>
  );
}

function ScoreCard({ label, value, icon: Icon, index }) {
  const status = value >= 75 ? "Great" : value >= 55 ? "Good" : value >= 40 ? "Fair" : "Needs care";
  return (
    <motion.div variants={fadeUp} custom={index} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} className="card card-hover flex flex-col items-center p-6 text-center">
      <Radial value={value} size={86} />
      <div className="mt-3 flex items-center gap-1.5">
        <Icon size={14} className="text-sage-500" strokeWidth={1.8} />
        <p className="text-[14px] font-semibold t-head">{label}</p>
      </div>
      <p className="mt-0.5 text-[12px] t-muted">{status}</p>
    </motion.div>
  );
}

function Radial({ value, size = 86 }) {
  const stroke = size < 66 ? 6 : 7;
  const r = (size - stroke) / 2 - 1;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E7E5E4" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#74856A" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} whileInView={{ strokeDashoffset: c - (value / 100) * c }} viewport={{ once: true }}
          transition={{ duration: 1.1, ease, delay: 0.15 }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display font-600 t-head tnum" style={{ fontSize: size * 0.26 }}>{value}</span>
    </div>
  );
}

function RoutineCard({ type, steps, index }) {
  const { icon: Icon, label } = ROUTINE_META[type];
  return (
    <motion.div variants={fadeUp} custom={index} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} className="card p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-50 text-sage-600"><Icon size={20} strokeWidth={1.7} /></span>
      <h3 className="mt-4 font-display text-lg font-500 t-head">{label}</h3>
      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3 text-[14px] leading-snug t-body">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-semibold text-stone-600 tnum">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

function ReportSkeleton() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-10">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto h-4 w-32 skeleton rounded-full" />
        <div className="mx-auto mt-4 h-10 w-80 skeleton rounded-2xl" />
        <div className="mx-auto mt-3 h-4 w-96 max-w-full skeleton rounded-full" />
      </div>
      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => <div key={i} className="h-20 skeleton rounded-3xl" />)}
      </div>
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-44 skeleton rounded-3xl" />)}
      </div>
    </section>
  );
}
