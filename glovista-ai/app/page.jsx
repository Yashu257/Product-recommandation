"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import Benefits from "@/components/site/Benefits";
import WhyGlovista from "@/components/site/WhyGlovista";
import BestSellers from "@/components/site/BestSellers";
import AISection from "@/components/site/AISection";
import Reviews from "@/components/site/Reviews";
import Certifications from "@/components/site/Certifications";
import Ingredients from "@/components/site/Ingredients";
import FAQ from "@/components/site/FAQ";
import Footer from "@/components/site/Footer";
import BrandMark from "@/components/site/BrandMark";
import ChatWidget from "@/components/site/ChatWidget";
import Results from "@/components/Results";

// GlowAI lives as a docked chatbot. The full routine/report opens on request.
export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [report, setReport] = useState(null);

  const openChat = useCallback(() => setChatOpen(true), []);
  const openReport = useCallback((rec) => {
    setReport(rec);
    setChatOpen(false);
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <main className="relative">
      <Header onStart={openChat} />
      <Hero onStart={openChat} />
      <Benefits />
      <WhyGlovista />
      <BestSellers />
      <AISection onStart={openChat} />
      <Certifications />
      <Ingredients />
      <Reviews />
      <FAQ />
      <Footer onStart={openChat} />

      {/* Docked GlowAI chatbot */}
      <ChatWidget open={chatOpen} onOpenChange={setChatOpen} onOpenReport={openReport} />

      {/* Full report overlay (opened from the chat) */}
      <AnimatePresence>
        {report && (
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[80] overflow-y-auto bg-paper"
          >
            <div className="sticky top-0 z-10 border-b border-stone-200/70 bg-paper/85 backdrop-blur-xl">
              <div className="container-x flex h-16 items-center justify-between">
                <BrandMark />
                <button
                  onClick={() => setReport(null)}
                  aria-label="Close report"
                  className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-[14px] font-medium text-stone-700 transition-colors hover:bg-stone-50"
                >
                  Close <X size={16} />
                </button>
              </div>
            </div>
            <Results
              recommendation={report}
              onRestart={() => { setReport(null); setChatOpen(true); }}
              onClose={() => setReport(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
