"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useMotionValueEvent } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export default function ProgressBar({
  value,
  label,
  showPercentage = true,
  size = "md",
  className = "",
}: ProgressBarProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const reduced = useReducedMotion();
  const clamped = Math.min(100, Math.max(0, value));
  const [displayWidth, setDisplayWidth] = useState(reduced ? clamped : 0);

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: reduced ? 9999 : 60,
    damping: reduced ? 100 : 20,
  });

  useMotionValueEvent(spring, "change", (latest) => {
    setDisplayWidth(Math.round(latest));
  });

  useEffect(() => {
    if (inView || reduced) {
      motionValue.set(clamped);
    }
  }, [inView, reduced, motionValue, clamped]);

  const heights = { sm: "h-1.5", md: "h-2" };

  return (
    <div ref={ref} className={cn("", className)}>
      {(label || showPercentage) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <span className="text-xs font-medium text-text-secondary">{label}</span>
          )}
          {showPercentage && (
            <motion.span
              initial={reduced ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="text-xs font-semibold text-brand-500"
            >
              {displayWidth}%
            </motion.span>
          )}
        </div>
      )}
      <div className={cn(
        "w-full overflow-hidden rounded-full bg-surface-sunken",
        heights[size],
      )}>
        <motion.div
          className={cn(
            "rounded-full bg-brand-500",
            heights[size],
          )}
          style={{ width: `${displayWidth}%` }}
          initial={false}
        />
      </div>
    </div>
  );
}
