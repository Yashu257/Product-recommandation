"use client";

import { ShieldCheck, Leaf, FlaskConical, Rabbit, Droplets, BadgeCheck } from "lucide-react";
import Reveal from "./Reveal";

const CERTS = [
  { icon: FlaskConical, label: "Dermatologist tested" },
  { icon: Rabbit, label: "Cruelty-free" },
  { icon: Leaf, label: "Vegan formulas" },
  { icon: Droplets, label: "pH balanced" },
  { icon: ShieldCheck, label: "Paraben & sulfate free" },
  { icon: BadgeCheck, label: "Made in GMP labs" },
];

export default function Certifications() {
  return (
    <section className="border-y border-stone-200/70 bg-paper">
      <div className="container-x py-12">
        <Reveal className="text-center">
          <p className="text-[12px] font-semibold uppercase tracking-wideish text-stone-400">
            Formulated to standards you can trust
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {CERTS.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.05} className="flex flex-col items-center gap-2.5 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white text-sage-600">
                <c.icon size={21} strokeWidth={1.6} />
              </span>
              <span className="text-[13px] font-medium text-stone-600">{c.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
