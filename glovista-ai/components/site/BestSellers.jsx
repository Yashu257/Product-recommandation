"use client";

import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import ProductCard from "../ProductCard";
import Reveal from "./Reveal";

const IDS = ["ceraRestore", "freshBloom", "koziGleam", "simplyMatte", "hairDase", "lipRevive"];

export default function BestSellers() {
  const products = IDS.map((id) => PRODUCTS[id]).filter(Boolean);
  return (
    <section id="best-sellers" className="section-y bg-white">
      <div className="container-x">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">The edit</p>
            <h2 className="mt-3 font-display text-3xl font-500 leading-tight text-stone-900 sm:text-[2.5rem]">
              Best sellers
            </h2>
            <p className="mt-3 max-w-md text-[16px] leading-relaxed t-body text-pretty">
              Quietly effective formulas our community reaches for again and again.
            </p>
          </div>
          <a href="#ai" className="btn-ghost shrink-0 !px-0">
            View full range <ArrowRight size={16} />
          </a>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
