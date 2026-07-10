"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const COMPANIES = [
  "Google", "Microsoft", "Flutterwave", "Andela", "Paystack",
  "Google", "Microsoft", "Flutterwave", "Andela", "Paystack",
  "Google", "Microsoft", "Flutterwave", "Andela", "Paystack",
];

export default function TrustedEmployers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  return (
    <section ref={ref} className="py-16">
      <motion.div
        initial={reduced ? {} : { opacity: 0, y: 16 }}
        animate={reduced || inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="mb-8 text-center"
      >
        <p className="text-xs font-medium tracking-widest uppercase text-text-tertiary">
          Our Instructors Are Trusted By
        </p>
      </motion.div>

      <div className="relative overflow-hidden">
        <div className={`flex gap-12 ${reduced ? "" : "animate-marquee"} items-center`}>
          {COMPANIES.map((company, i) => (
            <span
              key={`${company}-${i}`}
              className="shrink-0 text-sm font-semibold tracking-wide text-text-tertiary/60 transition-colors hover:text-text-secondary"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
