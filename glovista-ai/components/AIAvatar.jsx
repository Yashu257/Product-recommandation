"use client";

import { Sparkles } from "lucide-react";

// Minimal GlowAI mark — a calm sage disc, no glow, no motion.
// Accepts legacy props (pulse/rings/breathe) and simply ignores them.
export default function AIAvatar({ size = 48 }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full border border-sage-200 bg-sage-50 text-sage-600"
      style={{ width: size, height: size }}
    >
      <Sparkles size={size * 0.42} strokeWidth={1.8} />
    </span>
  );
}
