"use client";

import { motion } from "motion/react";
import { useState, useCallback } from "react";
import Companion from "@/components/companion/companion";
import { cn } from "@/lib/utils";

interface EatSceneProps {
  className?: string;
}

function Crumb({ delay, side }: { delay: number; side: "left" | "right" }) {
  const x = side === "left" ? -16 : 16;
  return (
    <motion.circle
      cx={0} cy={0} r="1.5"
      fill="#d4d4d4"
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{ opacity: [0, 0.7, 0], x: [0, x], y: [0, -12] }}
      transition={{ duration: 1.2, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

export default function EatScene({ className }: EatSceneProps) {
  const [bite, setBite] = useState(false);

  const handleTap = useCallback(() => {
    setBite(true);
    setTimeout(() => setBite(false), 400);
  }, []);

  return (
    <div className={cn("relative flex flex-col items-center py-10 select-none", className)}>
      {/* ── Floating sparkle particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[0.3, 0.7, 1.1, 1.6, 2.0].map((d, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${30 + i * 12}%`, top: `${40 + (i % 3) * 15}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 0], y: [-8, -24], scale: [0, 1, 0] }}
            transition={{ duration: 2.5, delay: d, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8">
              <path d="M4 0 L4.8 3.2 L8 4 L4.8 4.8 L4 8 L3.2 4.8 L0 4 L3.2 3.2 Z" fill="#94a3b8" stroke="#475569" strokeWidth="0.4" opacity={0.7} />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* ── Cake ── */}
      <motion.div
        className="relative z-10 mb-[-6px] cursor-pointer"
        onClick={handleTap}
        initial={{ scale: 1 }}
        animate={
          bite
            ? { scale: [1, 0.85, 0.95, 1], rotate: [0, -4, 3, 0] }
            : { y: [0, -3, 0] }
        }
        transition={
          bite
            ? { duration: 0.4, ease: "easeInOut" }
            : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <svg width="36" height="30" viewBox="0 0 36 30">
          {/* Crumb particles */}
          <Crumb delay={0.2} side="left" />
          <Crumb delay={0.6} side="right" />
          <Crumb delay={1.0} side="left" />
          <Crumb delay={1.4} side="right" />

          {/* Cake slice */}
          <path d="M6 18 L18 6 L30 18 Z" fill="#d4d4d4" stroke="#737373" strokeWidth="0.8" />
          <path d="M6 18 L18 24 L30 18 Z" fill="#e5e5e5" stroke="#a3a3a3" strokeWidth="0.8" />
          <path d="M8 20 L18 26 L28 20" fill="none" stroke="#a3a3a3" strokeWidth="0.5" opacity="0.5" />
          <path d="M10 22 L18 28 L26 22" fill="none" stroke="#a3a3a3" strokeWidth="0.5" opacity="0.3" />
          {/* Frosting drip */}
          <path d="M8 18 Q10 20 12 18 Q14 19 16 18 Q18 20 20 18 Q22 19 24 18 Q26 20 28 18" fill="none" stroke="#d4d4d4" strokeWidth="1.5" />
          {/* Cherry */}
          <circle cx="18" cy="6" r="3" fill="#94a3b8" />
          <path d="M18 3 Q20 1 22 2" stroke="#64748b" strokeWidth="0.8" fill="none" />
          {/* Candle */}
          <rect x="16" y="1" width="2" height="5" rx="0.5" fill="#94a3b8" />
          <motion.path
            d="M17 1 Q17 -1 18 0 Q17 1 17 1"
            fill="#64748b"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          />

          {bite && (
            <motion.path
              d="M18 6 Q22 8 22 12 Q18 12 16 10 Z"
      fill="#94a3b8" stroke="#475569" strokeWidth="0.5"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], x: [0, 6], y: [0, -4] }}
              transition={{ duration: 0.4 }}
            />
          )}
        </svg>

        {/* ── Bite particle burst ── */}
        {bite && (
          <svg width="50" height="40" viewBox="0 0 50 40" className="holo absolute -left-2 -top-2">
            {[{
              x1: 18, y1: 18, x2: 8, y2: 8,
            }, {
              x1: 18, y1: 18, x2: 28, y2: 6,
            }, {
              x1: 18, y1: 18, x2: 6, y2: 22,
            }, {
              x1: 18, y1: 18, x2: 30, y2: 20,
            }, {
              x1: 18, y1: 18, x2: 12, y2: 4,
            }, {
              x1: 18, y1: 18, x2: 24, y2: 2,
            }].map((l, i) => (
              <line
                key={i}
                x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="origin-center"
                style={{ animation: `eat-burst-${i} 0.4s ease-out forwards` }}
              />
            ))}
          </svg>
        )}
      </motion.div>

      {/* ── Cake shadow ── */}
      <motion.div
        className="h-2 w-10 rounded-full bg-text-tertiary/15"
        animate={bite ? { scale: [1, 0.7, 1] } : { scale: [1, 0.85, 1] }}
        transition={bite ? { duration: 0.4 } : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Sprout eating ── */}
      <motion.div
        className="mt-1"
        animate={bite ? { x: [0, 2, -2, 0], rotate: [0, 3, -3, 0] } : {}}
        transition={bite ? { duration: 0.35 } : {}}
      >
        <Companion variant="eating" size="lg" tone="rose" animate intensity="high" interactive />
      </motion.div>

      <style>{`
        .holo { filter: drop-shadow(0 0 3px rgba(148,163,184,.5)) drop-shadow(0 0 8px rgba(148,163,184,.25)); opacity: .75; }
        @keyframes eat-burst-0 { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; transform: translate(-4px, -4px); } }
        @keyframes eat-burst-1 { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; transform: translate(4px, -6px); } }
        @keyframes eat-burst-2 { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; transform: translate(-6px, 2px); } }
        @keyframes eat-burst-3 { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; transform: translate(6px, 1px); } }
        @keyframes eat-burst-4 { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; transform: translate(-3px, -7px); } }
        @keyframes eat-burst-5 { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; transform: translate(3px, -8px); } }
      `}</style>
    </div>
  );
}
