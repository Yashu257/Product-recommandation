"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Mail, Share2, Printer, Check } from "lucide-react";

// Report actions. PDF & Print use the browser print dialog (Save as PDF);
// Email uses a mailto draft; Share uses the Web Share API with a clipboard
// fallback. All client-side, no backend required.
export default function ExportBar({ summary = "", title = "My GlowAI Skin Report" }) {
  const [toast, setToast] = useState("");

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const onPrint = () => window.print();

  const onEmail = () => {
    const body = encodeURIComponent(summary || "Here is my personalized GlowAI skin report.");
    const subject = encodeURIComponent(title);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const onShare = async () => {
    const shareData = { title, text: summary, url: typeof window !== "undefined" ? window.location.href : "" };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${title}\n\n${summary}`);
        flash("Report copied to clipboard");
      } else {
        flash("Sharing not supported");
      }
    } catch (e) {
      /* user cancelled — ignore */
    }
  };

  const actions = [
    { label: "Download PDF", icon: Download, onClick: onPrint, primary: true },
    { label: "Email Report", icon: Mail, onClick: onEmail },
    { label: "Share Result", icon: Share2, onClick: onShare },
    { label: "Print Report", icon: Printer, onClick: onPrint },
  ];

  return (
    <div className="no-print relative">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actions.map(({ label, icon: Icon, onClick, primary }) => (
          <motion.button
            key={label}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className={primary ? "btn-primary !py-2.5 text-sm" : "btn-secondary !py-2.5 text-sm"}
          >
            <Icon size={16} />
            {label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-none absolute left-1/2 top-full mt-3 flex -translate-x-1/2 items-center gap-2 rounded-full bg-sage-700 px-4 py-2 text-sm font-medium text-white shadow-card"
          >
            <Check size={15} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
