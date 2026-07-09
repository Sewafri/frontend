"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useMotionValueEvent } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { STATS } from "@/constants/landing";

function parseNumericValue(raw: string): { prefix: string; value: number; suffix: string } {
  const match = raw.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { prefix: "", value: 0, suffix: "" };
  return { prefix: match[1], value: parseFloat(match[2]), suffix: match[3] };
}

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const { prefix, value: target, suffix } = parseNumericValue(value);
  const [display, setDisplay] = useState(reduced ? value : `${prefix}0${suffix}`);

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 50, damping: 15 });

  useMotionValueEvent(spring, "change", (latest) => {
    const formatted = Number.isInteger(target) ? Math.round(latest) : Math.round(latest * 10) / 10;
    setDisplay(`${prefix}${formatted}${suffix}`);
  });

  useEffect(() => {
    if (inView && !reduced) {
      motionValue.set(target);
    } else if (reduced) {
      setDisplay(value);
    }
  }, [inView, reduced, motionValue, target, value]);

  return (
    <div ref={ref} className="text-center lg:text-left">
      <p className="text-4xl font-bold leading-none tracking-tighter text-text-primary">
        {display}
      </p>
      <p className="mt-1.5 text-sm leading-snug text-text-tertiary">
        {label}
      </p>
    </div>
  );
}

export default function StatBlock() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <motion.section
      ref={sectionRef}
      initial={reduced ? {} : { opacity: 0, y: 24 }}
      animate={reduced || inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="py-14"
    >
      <div className="rounded-2xl border border-border-default bg-gradient-to-br from-surface-card to-surface-sunken px-8 py-12 sm:px-16 sm:py-14 shadow-sm">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
