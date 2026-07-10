"use client";

import { motion } from "motion/react";
import { useState, useCallback } from "react";
import Companion from "@/components/companion/companion";
import { cn } from "@/lib/utils";

interface ScrollSceneProps {
  className?: string;
}

const MESSAGES = ["💡", "❤️", "🔥", "⭐", "🎯"];

function PhoneGlow() {
  return (
    <motion.div
      className="absolute -inset-3 rounded-2xl bg-accent-400/10 blur-md"
      animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.04, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function ScrollScene({ className }: ScrollSceneProps) {
  const [reactEmoji, setReactEmoji] = useState<string | null>(null);
  const [isReacting, setIsReacting] = useState(false);

  const handleTap = useCallback(() => {
    if (isReacting) return;
    setIsReacting(true);
    const emoji = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setReactEmoji(emoji);
    setTimeout(() => {
      setReactEmoji(null);
      setIsReacting(false);
    }, 900);
  }, [isReacting]);

  return (
    <div className={cn("relative flex flex-col items-center py-10 select-none", className)}>
      <style>{`.holo{filter:drop-shadow(0 0 3px rgba(148,163,184,.5)) drop-shadow(0 0 8px rgba(148,163,184,.25));opacity:.75}`}</style>
      {/* ── Phone with glow ── */}
      <div className="holo relative mb-1">
        <PhoneGlow />
        <motion.div
          className="relative z-10 cursor-pointer"
          onClick={handleTap}
          animate={
            isReacting
              ? { y: [0, -6, 2, 0], rotate: [0, -5, 3, 0] }
              : { y: [0, -2, 0] }
          }
          transition={
            isReacting
              ? { duration: 0.4, ease: "easeInOut" }
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <svg width="28" height="40" viewBox="0 0 28 40">
            <rect x="1" y="1" width="26" height="38" rx="4" fill="#1f2937" stroke="#374151" strokeWidth="1.2" />
            <rect x="4" y="4" width="20" height="28" rx="2" fill="#64748b" stroke="#475569" strokeWidth="0.4" />
            {/* Screen content */}
            <motion.g
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <rect x="6" y="6" width="16" height="2" rx="1" fill="#64748b" stroke="#475569" strokeWidth="0.3" opacity={0.6} />
              <rect x="6" y="10" width="12" height="1.5" rx="0.75" fill="#64748b" stroke="#475569" strokeWidth="0.3" opacity={0.4} />
              <rect x="6" y="13" width="14" height="1.5" rx="0.75" fill="#64748b" stroke="#475569" strokeWidth="0.3" opacity={0.4} />
              <rect x="6" y="17" width="16" height="2" rx="1" fill="#64748b" stroke="#475569" strokeWidth="0.3" opacity={0.5} />
              <rect x="6" y="21" width="10" height="1.5" rx="0.75" fill="#64748b" stroke="#475569" strokeWidth="0.3" opacity={0.4} />
              <rect x="6" y="25" width="14" height="1.5" rx="0.75" fill="#64748b" stroke="#475569" strokeWidth="0.3" opacity={0.4} />
            </motion.g>
            {/* Home indicator */}
            <rect x="9" y="35" width="10" height="2" rx="1" fill="#4b5563" />
            {/* Camera dot */}
            <circle cx="14" cy="2.5" r="0.8" fill="#4b5563" />
            {/* Notification badge */}
            <motion.circle
              cx="19" cy="7" r="3"
              fill="#94a3b8"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <text x="19" y="8.2" textAnchor="middle" fontSize="3" fill="white" fontWeight="bold">1</text>
          </svg>

          {/* ── Reaction emoji ── */}
          {isReacting && reactEmoji && (
            <motion.div
              className="absolute -top-4 -right-5 text-base"
              initial={{ scale: 0, opacity: 1, y: 0 }}
              animate={{ scale: [0, 1.4, 0], opacity: [1, 1, 0], y: [0, -16] }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {reactEmoji}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ── Screen reflection shine ── */}
      <motion.div
        className="h-1 w-16 rounded-full bg-accent-300/20 blur-[2px]"
        animate={{ scaleX: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Sprout scrolling ── */}
      <motion.div
        className="mt-1"
        animate={isReacting ? { x: [0, 3, -3, 0], rotate: [0, 4, -4, 0] } : {}}
        transition={isReacting ? { duration: 0.35 } : {}}
      >
        <Companion
          variant="scrolling"
          size="default"
          tone="sky"
          animate
          intensity={isReacting ? "high" : "normal"}
          interactive
        />
      </motion.div>
    </div>
  );
}
