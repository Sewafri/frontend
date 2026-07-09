"use client";

import { motion } from "motion/react";
import { useState, useCallback } from "react";
import Companion from "@/components/companion/companion";
import { cn } from "@/lib/utils";

function BallSvg() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26">
      <circle cx="13" cy="13" r="12" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.2" />
      <polygon points="13,4 16,9.5 22,9.5 17,13 18.5,19 13,15 7.5,19 9,13 4,9.5 10,9.5" fill="#9ca3af" opacity="0.4" />
      <polygon points="13,4 16,9.5 22,9.5 17,13 18.5,19 13,15 7.5,19 9,13 4,9.5 10,9.5" fill="none" stroke="#6b7280" strokeWidth="0.4" opacity="0.25" />
      <circle cx="10" cy="10" r="2.8" fill="white" opacity="0.2" />
    </svg>
  );
}

interface PlaySceneProps {
  className?: string;
}

export default function PlayScene({ className }: PlaySceneProps) {
  const [celebrate, setCelebrate] = useState(false);

  const handleTap = useCallback(() => {
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 900);
  }, []);

  return (
    <div className={cn("relative flex flex-col items-center py-10 select-none", className)}>
      {/* ── Ball ── */}
      <motion.div
        className="relative z-10 mb-1 cursor-pointer"
        onClick={handleTap}
        animate={
          celebrate
            ? { y: [-50, -80, -30, 0], rotate: [0, 360, 720, 1080], scale: [1.2, 0.8, 1.4, 0] }
            : { y: [0, -55, 0], x: [0, 14, 0] }
        }
        transition={
          celebrate
            ? { duration: 0.7, ease: "easeInOut" }
            : { duration: 1.3, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <BallSvg />
        {/* ── Star burst lines ── */}
        {celebrate && (
          <svg width="50" height="50" viewBox="0 0 50 50" className="holo absolute -left-3 -top-3 -z-10">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
              const r = (a * Math.PI) / 180;
              const x = 25 + Math.cos(r) * 18;
              const y = 25 + Math.sin(r) * 18;
              return (
                <line
                  key={a} x1="25" y1="25" x2={x} y2={y}
                  stroke="#4F7F1F" strokeWidth="2.5" strokeLinecap="round"
                  className="origin-center"
                  style={{ animation: `sprout-burst 0.5s ease-out forwards` }}
                />
              );
            })}
          </svg>
        )}
      </motion.div>

      {/* ── Ball shadow ── */}
      <motion.div
        className="h-2 rounded-full bg-text-tertiary/15"
        style={{ width: celebrate ? 12 : 20 }}
        animate={celebrate ? { scale: [1, 0.3, 0], opacity: [0.15, 0.05, 0] } : { scale: [1, 0.55, 1], opacity: [0.15, 0.06, 0.15] }}
        transition={celebrate ? { duration: 0.7 } : { duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Sproots ── */}
      <motion.div
        className="flex items-center -space-x-3 mt-1"
        animate={celebrate ? { x: [0, 10, -8, 4, 0] } : {}}
        transition={celebrate ? { duration: 0.5, ease: "easeInOut" } : {}}
      >
        <Companion variant="playing" size="default" tone="original" animate intensity="high" interactive />

        <motion.div
          className="relative"
          animate={celebrate ? { scale: [1, 1.25, 1], rotate: [0, -8, 0, 8, 0] } : {}}
          transition={celebrate ? { duration: 0.4 } : {}}
        >
          <Companion variant="celebrating" size="sm" tone="sky" animate intensity={celebrate ? "high" : "normal"} />
          {celebrate && (
            <svg width="16" height="16" viewBox="0 0 16 16" className="holo absolute -top-2 -right-3">
              <path d="M8 2 L8.8 5.2 L12 6 L8.8 6.8 L8 10 L7.2 6.8 L4 6 L7.2 5.2 Z" fill="#4F7F1F" stroke="#92400e" strokeWidth="0.8" />
              <path d="M4 1 L4.4 2.8 L6.2 3.2 L4.4 3.6 L4 5.4 L3.6 3.6 L1.8 3.2 L3.6 2.8 Z" fill="#4F7F1F" stroke="#78350f" strokeWidth="0.5" opacity="0.6" />
            </svg>
          )}
        </motion.div>

        <Companion variant="laughing" size="sm" tone="mint" animate intensity={celebrate ? "high" : "normal"} />
      </motion.div>

      {/* ── Keyframes for burst ── */}
      <style>{`
        @keyframes sprout-burst {
          0% { opacity: 0; transform: scale(0); }
          40% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.3); }
        }
        .holo {
          filter: drop-shadow(0 0 3px rgba(79,127,31,.5)) drop-shadow(0 0 8px rgba(79,127,31,.25));
          opacity: .75;
        }
      `}</style>
    </div>
  );
}
