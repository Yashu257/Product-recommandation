"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Reveal from "./Reveal";

const FAQS = [
  {
    q: "Is the GlowAI skin analysis a medical diagnosis?",
    a: "No. GlowAI is a personalization tool that recommends products based on the information you provide. It isn't a substitute for professional dermatological advice — for persistent concerns, please consult a dermatologist.",
  },
  {
    q: "Do I need to upload a photo?",
    a: "It's entirely optional. The consultation works from your answers alone; adding a selfie simply gives a closer read on hydration, oil and tone. Any photo stays in your browser and is never uploaded.",
  },
  {
    q: "Are your products suitable for sensitive skin?",
    a: "Many are. Our formulas avoid common irritants like synthetic fragrance and sulfates, and GlowAI will steer you toward the gentlest options if you tell us your skin reacts easily.",
  },
  {
    q: "How long until I see results?",
    a: "Most people notice improvements in hydration and texture within two to four weeks, with concerns like dark spots taking longer. Your report includes a realistic, week-by-week timeline.",
  },
  {
    q: "What is your shipping and returns policy?",
    a: "We offer free shipping on orders over ₹999 and a 30-day satisfaction guarantee. If a product isn't right for you, reach out and we'll make it right.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section-y">
      <div className="container-x max-w-3xl">
        <Reveal className="text-center">
          <p className="eyebrow justify-center">Questions</p>
          <h2 className="mt-3 font-display text-3xl font-500 leading-tight text-stone-900 sm:text-[2.5rem]">
            Frequently asked
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-stone-200/80 rounded-3xl border border-stone-200/80 bg-white">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-[15.5px] font-medium text-stone-800">{f.q}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-500">
                    {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-[14.5px] leading-relaxed t-body text-pretty">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
