"use client";

import { motion } from "framer-motion";

// Subtle, consistent entrance: fade + gentle slide-up on scroll into view.
// The single primitive used across the site so motion stays quiet and uniform.
export default function Reveal({ children, className = "", delay = 0, y = 18, once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-90px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
