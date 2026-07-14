"use client";

import { motion } from "framer-motion";
import AIAvatar from "./AIAvatar";

// Quiet "typing…" indicator with three soft dots.
export default function TypingIndicator({ label = "GlowAI is typing" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-end gap-3"
    >
      <AIAvatar size={34} />
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-stone-200/80 bg-white px-4 py-3 shadow-sm">
        <span className="text-[13px] font-medium t-muted">{label}</span>
        <span className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-1.5 w-1.5 rounded-full bg-sage-400"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
            />
          ))}
        </span>
      </div>
    </motion.div>
  );
}
