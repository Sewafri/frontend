"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 800; // ms

/**
 * Animates a numeric value from 0 to `target` on mount,
 * with an optional leading suffix (e.g. "%").
 */
export function useAnimatedCounter(target: number, suffix = "") {
  const [display, setDisplay] = useState("0");
  const startTime = useRef<number>(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (target === 0) {
      setDisplay(`0${suffix}`);
      return;
    }

    startTime.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / DURATION, 1);

      /* Ease-out cubic */
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      setDisplay(`${current}${suffix}`);

      if (progress < 1) {
        raf.current = requestAnimationFrame(tick);
      }
    };

    raf.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf.current);
  }, [target, suffix]);

  return display;
}
