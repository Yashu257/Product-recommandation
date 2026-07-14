"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, User, Menu, X, Sparkles } from "lucide-react";
import BrandMark from "./BrandMark";

const NAV = [
  { label: "Products", href: "#best-sellers" },
  { label: "AI Skin Analysis", href: "#ai" },
  { label: "Wellness", href: "#ingredients" },
  { label: "About", href: "#why" },
  { label: "Contact", href: "#footer" },
];

export default function Header({ onStart }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`no-print sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-stone-200/70 bg-paper/85 backdrop-blur-xl" : "border-b border-transparent bg-paper/0"
      }`}
    >
      <div className="container-x flex h-[68px] items-center justify-between">
        <a href="#top" className="shrink-0" aria-label="Glovista home">
          <BrandMark />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="text-[14.5px] font-medium text-stone-600 transition-colors duration-200 hover:text-stone-950"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button aria-label="Search" className="hidden h-10 w-10 items-center justify-center rounded-full text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 sm:flex">
            <Search size={19} strokeWidth={1.8} />
          </button>
          <button aria-label="Profile" className="hidden h-10 w-10 items-center justify-center rounded-full text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 sm:flex">
            <User size={19} strokeWidth={1.8} />
          </button>
          <button onClick={onStart} className="btn-primary ml-1 hidden !px-5 !py-2.5 !text-[14px] sm:inline-flex">
            <Sparkles size={15} strokeWidth={1.9} />
            Start AI Analysis
          </button>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-stone-100 lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-stone-200/70 bg-paper lg:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {NAV.map((n) => (
                <a
                  key={n.label}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-[15px] font-medium text-stone-700 transition-colors hover:bg-stone-100"
                >
                  {n.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  onStart();
                }}
                className="btn-primary mt-2 w-full"
              >
                <Sparkles size={16} /> Start AI Analysis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
