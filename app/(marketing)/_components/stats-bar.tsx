"use client";

import { useRef, useState, useEffect } from "react";

const STATS = [
  { target: 10000, suffix: "+", label: "Active Students" },
  { target: 500, suffix: "+", label: "Expert Courses" },
  { target: 95, suffix: "%", label: "Career Advancement" },
  { target: 4.8, suffix: "", label: "Average Rating", decimal: true },
];

function AnimatedNumber({ target, suffix, decimal = false }: { target: number; suffix: string; decimal?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [counted, setCounted] = useState(false);
  const [display, setDisplay] = useState(decimal ? "0.0" : "0");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted) {
          setCounted(true);
          const duration = 1500;
          const start = performance.now();

          function tick(now: number) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = decimal
              ? (eased * target).toFixed(1)
              : Math.floor(eased * target).toLocaleString();
            setDisplay(val);
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [counted, target, decimal]);

  return (
    <div ref={ref} className="text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold -tracking-[0.03em] text-landing-dark tabular-nums">
      {display}
      <span className="font-bold text-landing-green">{suffix}</span>
    </div>
  );
}

export function StatsBar() {
  return (
    <section className="border-y border-landing-border bg-landing-card px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`relative text-center ${i < STATS.length - 1 ? "md:after:absolute md:after:right-0 md:after:top-1/4 md:after:h-1/2 md:after:w-px md:after:bg-landing-border" : ""}`}
            >
              <AnimatedNumber target={stat.target} suffix={stat.suffix} decimal={stat.decimal} />
              <p className="mt-1 text-xs font-medium text-landing-text-light sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
