"use client";

import { motion } from "motion/react";
import { useState, useCallback } from "react";
import Companion from "@/components/companion/companion";
import { cn } from "@/lib/utils";

interface WaveSceneProps {
  className?: string;
}

function FloatingHeart({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0], y: [0, -20] }}
      transition={{ duration: 2.5, delay, repeat: Infinity, ease: "easeOut" }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12">
        <path d="M6 10.5 C2 7 0 5 0 3 C0 1.5 1 0.5 2.5 0.5 C4 0.5 5.5 2 6 3 C6.5 2 8 0.5 9.5 0.5 C11 0.5 12 1.5 12 3 C12 5 10 7 6 10.5 Z" fill="#94a3b8" stroke="#475569" strokeWidth="0.6" />
      </svg>
    </motion.div>
  );
}

export default function WaveScene({ className }: WaveSceneProps) {
  const [isWaving, setIsWaving] = useState(false);

  const handleTap = useCallback(() => {
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 800);
  }, []);

  return (
    <div className={cn("relative flex flex-col items-center py-10 select-none", className)}>
      <style>{`.holo{filter:drop-shadow(0 0 3px rgba(148,163,184,.5)) drop-shadow(0 0 8px rgba(148,163,184,.25));opacity:.75}`}</style>
      {/* ── Floating hearts ── */}
      <div className="holo absolute inset-0 pointer-events-none">
        <FloatingHeart delay={0} x={20} y={35} />
        <FloatingHeart delay={0.6} x={75} y={30} />
        <FloatingHeart delay={1.2} x={45} y={20} />
        <FloatingHeart delay={1.8} x={85} y={40} />
        <FloatingHeart delay={2.4} x={10} y={25} />
      </div>

      {/* ── Sprout waving ── */}
      <motion.div
        className="cursor-pointer"
        onClick={handleTap}
        animate={
          isWaving
            ? { x: [0, 6, -6, 4, -4, 0], scale: [1, 1.08, 1] }
            : { x: [0, 2, -2, 0] }
        }
        transition={
          isWaving
            ? { duration: 0.5, ease: "easeInOut" }
            : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <Companion variant="waving" size="lg" tone="mint" animate intensity={isWaving ? "high" : "normal"} interactive />
      </motion.div>

      {/* ── Hearts burst on tap ── */}
      {isWaving && (
        <div className="absolute inset-0 pointer-events-none">
          {[
            { x: 0, y: -30, delay: 0 },
            { x: -20, y: -25, delay: 0.05 },
            { x: 20, y: -25, delay: 0.05 },
            { x: -12, y: -35, delay: 0.1 },
            { x: 12, y: -35, delay: 0.1 },
            { x: 0, y: -40, delay: 0.15 },
          ].map((h, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `calc(50% + ${h.x}px)`, top: `calc(50% + ${h.y}px)` }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 1.4, 0], opacity: [1, 1, 0] }}
              transition={{ duration: 0.6, delay: h.delay, ease: "easeOut" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14">
                <path d="M7 12 C2.5 8 0 6 0 3.5 C0 2 1 1 2.5 1 C4 1 5.5 2.5 7 3.5 C8.5 2.5 10 1 11.5 1 C13 1 14 2 14 3.5 C14 6 11.5 8 7 12 Z" fill="#94a3b8" stroke="#475569" strokeWidth="0.6" />
              </svg>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
