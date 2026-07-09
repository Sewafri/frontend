"use client";

import { motion } from "motion/react";
import { useState, useCallback } from "react";
import Companion from "@/components/companion/companion";
import { cn } from "@/lib/utils";

interface LaughSceneProps {
  className?: string;
}

function Teardrop({ delay, side }: { delay: number; side: "left" | "right" }) {
  const startX = side === "left" ? -22 : 22;
  return (
    <motion.path
      d="M0 0 Q-2 4 0 6 Q2 4 0 0"
      fill="#4F7F1F" stroke="#92400e" strokeWidth="0.6"
      opacity={0.5}
      initial={{ x: startX, y: -4, opacity: 0 }}
      animate={{ opacity: [0, 0.5, 0], x: [startX, startX + (side === "left" ? -4 : 4)], y: [-4, 12] }}
      transition={{ duration: 1.5, delay, repeat: Infinity, ease: "easeIn" }}
    />
  );
}

export default function LaughScene({ className }: LaughSceneProps) {
  const [giggle, setGiggle] = useState(false);

  const handleTap = useCallback(() => {
    setGiggle(true);
    setTimeout(() => setGiggle(false), 600);
  }, []);

  return (
    <div className={cn("relative flex flex-col items-center py-10 select-none", className)}>
      <style>{`.holo{filter:drop-shadow(0 0 3px rgba(79,127,31,.5)) drop-shadow(0 0 8px rgba(79,127,31,.25));opacity:.75}`}</style>
      {/* ── Teardrops ── */}
      <div className="holo absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 200 60" className="w-full h-full opacity-60">
          <Teardrop delay={0} side="left" />
          <Teardrop delay={0.3} side="right" />
          <Teardrop delay={0.6} side="left" />
          <Teardrop delay={0.9} side="right" />
          <Teardrop delay={1.2} side="left" />
        </svg>
      </div>

      {/* ── Sproot pair ── */}
      <motion.div
        className="flex items-center -space-x-2 cursor-pointer"
        onClick={handleTap}
        animate={
          giggle
            ? { x: [0, 6, -6, 4, -4, 0] }
            : { x: [0, 3, -3, 0] }
        }
        transition={
          giggle
            ? { duration: 0.5, ease: "easeInOut" }
            : { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <motion.div
          animate={
            giggle
              ? { rotate: [0, -5, 5, -3, 3, 0], scale: [1, 1.08, 0.95, 1.05, 1] }
              : { rotate: [0, -2, 2, 0] }
          }
          transition={
            giggle
              ? { duration: 0.5 }
              : { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <Companion variant="laughing" size="default" tone="coral" animate intensity="high" interactive />
        </motion.div>

        <motion.div
          animate={
            giggle
              ? { rotate: [0, 5, -5, 3, -3, 0], scale: [1, 0.95, 1.08, 1] }
              : { rotate: [0, 2, -2, 0] }
          }
          transition={
            giggle
              ? { duration: 0.5, delay: 0.05 }
              : { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.15 }
          }
        >
          <Companion variant="happy" size="sm" tone="original" animate intensity="high" />
        </motion.div>
      </motion.div>

      {/* ── "HA" text burst ── */}
      {giggle && (
        <div className="absolute inset-0 pointer-events-none">
          {["HA!", "hehe", "😂", "HA!", "lol"].map((text, i) => {
            const angle = (i / 5) * 360;
            const rad = (angle * Math.PI) / 180;
            return (
              <motion.div
                key={i}
                className="absolute text-xs font-bold"
                style={{ left: "50%", top: "50%", color: "#4F7F1F" }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{
                  x: Math.cos(rad) * 40,
                  y: Math.sin(rad) * 40 - 10,
                  opacity: 0,
                  scale: [0.5, 1.3, 0],
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {text}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
