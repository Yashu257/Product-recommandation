"use client";

import { motion } from "framer-motion";
import { Star, Check, ArrowRight } from "lucide-react";
import ProductVisual from "./site/ProductVisual";

// Clean, premium product card — white surface, soft elevation on hover.
export default function ProductCard({ product, index = 0, showWhy = false }) {
  const { id, name, category, tagline, price, rating, reviews, benefits, ingredients, suitableFor, why } = product;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      <div className="relative">
        <ProductVisual id={id} category={category} className="aspect-[4/3] w-full" />
        <span className="absolute left-4 top-4 chip !border-stone-200/70 !bg-white/90 backdrop-blur">
          {category}
        </span>
        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-stone-700 shadow-xs backdrop-blur">
          <Star size={12} className="fill-sand-400 text-sand-400" />
          <span className="tnum">{rating}</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-500 leading-snug t-head">{name}</h3>
        <p className="mt-1 text-sm t-muted text-pretty">{tagline}</p>

        {showWhy && why && (
          <div className="mt-4 rounded-2xl border border-sage-100 bg-sage-50/70 p-3">
            <p className="text-[12.5px] leading-relaxed t-body text-pretty">
              <span className="font-semibold text-sage-700">Why GlowAI chose this — </span>
              {why}
            </p>
          </div>
        )}

        <ul className="mt-4 space-y-1.5">
          {benefits.slice(0, showWhy ? 3 : 2).map((b) => (
            <li key={b} className="flex items-start gap-2 text-[13.5px] leading-snug t-body text-pretty">
              <Check size={15} className="mt-0.5 shrink-0 text-sage-500" strokeWidth={2.4} />
              {b}
            </li>
          ))}
        </ul>

        {ingredients && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {ingredients.slice(0, 3).map((ing) => (
              <span key={ing} className="chip !text-[11px]">{ing}</span>
            ))}
          </div>
        )}

        {suitableFor && showWhy && (
          <p className="mt-3 text-[12px] t-muted">
            <span className="font-medium text-stone-600">Suitable for:</span> {suitableFor}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-5">
          <div>
            <p className="font-display text-xl font-600 t-head tnum">₹{price}</p>
            <p className="text-[11px] t-muted tnum">{reviews.toLocaleString()} reviews</p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition-colors duration-200 hover:border-stone-400 hover:bg-stone-50">
            View product
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
