"use client";

import { motion } from "motion/react";
import { useState, useCallback } from "react";
import Companion from "@/components/companion/companion";
import { cn } from "@/lib/utils";

interface ThinkSceneProps {
  className?: string;
}

function FloatingQ({ delay, x }: { delay: number; x: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: [0, 0.5, 0.3, 0.6, 0], y: [10, -6, -2, -8, -16] }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
      transform={`translate(${x}, 0)`}
    >
      <path d="M0 -2 Q0 -6 3 -6 Q6 -6 6 -3 Q6 0 3 1 Q3 2 3 3" stroke="#8b5cf6" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity={0.5} />
      <circle cx="3" cy="5" r="0.7" fill="#8b5cf6" opacity={0.5} />
    </motion.g>
  );
}

export default function ThinkScene({ className }: ThinkSceneProps) {
  const [lightbulb, setLightbulb] = useState(false);

  const handleTap = useCallback(() => {
    setLightbulb(true);
    setTimeout(() => setLightbulb(false), 1200);
  }, []);

  return (
    <div className={cn("relative flex flex-col items-center py-10 select-none", className)}>
      {/* ── Floating question marks ── */}
      <svg
        width="100"
        height="30"
        viewBox="0 0 100 20"
        className="mb-[-8px] overflow-visible pointer-events-none"
      >
        <FloatingQ delay={0} x={20} />
        <FloatingQ delay={0.8} x={50} />
        <FloatingQ delay={1.6} x={75} />
        <FloatingQ delay={2.4} x={35} />
        <FloatingQ delay={3.2} x={65} />
      </svg>

      {/* ── Lightbulb (hidden until tap) ── */}
      {lightbulb && (
        <motion.div
          className="absolute top-4 z-20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 0.5, ease: "backOut" }}
        >
          <svg width="24" height="32" viewBox="0 0 24 32">
            <defs>
              <radialGradient id="bulb-glow">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="12" cy="16" r="14" fill="url(#bulb-glow)" />
            <motion.path
              d="M12 2 Q18 2 18 10 Q18 16 14 20 L10 20 Q6 16 6 10 Q6 2 12 2 Z"
              fill="#fbbf24"
              stroke="#f59e0b"
              strokeWidth="0.8"
              animate={{ fill: ["#fbbf24", "#fef3c7", "#fbbf24"] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <rect x="10" y="20" width="4" height="4" rx="1" fill="#f59e0b" />
            <rect x="9" y="24" width="6" height="2" rx="0.8" fill="#f59e0b" />
            <path d="M10 20 L8 23" stroke="#f59e0b" strokeWidth="0.6" />
            <path d="M14 20 L16 23" stroke="#f59e0b" strokeWidth="0.6" />
            {/* Light rays */}
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a = (i / 6) * 360;
              const rad = (a * Math.PI) / 180;
              return (
                <motion.line
                  key={i}
                  x1="12" y1="2"
                  x2={12 + Math.cos(rad) * 10}
                  y2={2 + Math.sin(rad) * 10}
                  stroke="#fbbf24"
                  strokeWidth="1"
                  strokeLinecap="round"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                />
              );
            })}
          </svg>
        </motion.div>
      )}

      {/* ── Sprout thinking ── */}
      <motion.div
        className="relative cursor-pointer"
        onClick={handleTap}
        animate={lightbulb ? { scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] } : {}}
        transition={lightbulb ? { duration: 0.5, ease: "easeInOut" } : {}}
      >
        <Companion variant="thinking" size="default" tone="lavender" animate intensity="normal" interactive />
      </motion.div>
    </div>
  );
}
