"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AIAvatar from "./AIAvatar";

// A single chat message. AI messages type out; user messages are a solid sage bubble.
export default function ChatBubble({ from = "ai", children, text, typing = false, onTyped }) {
  const isAI = from === "ai";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-end gap-3 ${isAI ? "justify-start" : "justify-end"}`}
    >
      {isAI && <AIAvatar size={34} />}
      <div
        className={
          isAI
            ? "max-w-[84%] text-pretty rounded-2xl rounded-tl-md border border-stone-200/80 bg-white px-4 py-3 text-[15px] leading-[1.55] text-stone-700 shadow-sm"
            : "max-w-[84%] text-pretty rounded-2xl rounded-tr-md bg-sage-700 px-4 py-3 text-[15px] leading-[1.55] text-white"
        }
      >
        {typing && text ? <Typewriter text={text} onDone={onTyped} /> : text || children}
      </div>
    </motion.div>
  );
}

function Typewriter({ text, onDone, speed = 16 }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  const done = shown.length >= text.length;
  return <span className={done ? "" : "typed-caret"}>{shown}</span>;
}
