"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const STEPS = [
  {
    number: "01",
    title: "Register",
    description: "Pick your course, secure your spot, and join the next cohort. No experience needed.",
  },
  {
    number: "02",
    title: "Learn Live",
    description: "Attend live sessions, build real projects, and get graded every week.",
  },
  {
    number: "03",
    title: "Get Hired",
    description: "Graduate with a portfolio, a certificate, and direct support landing your first client or job.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <section ref={sectionRef} className="py-20">
      <motion.div
        initial={reduced ? {} : { opacity: 0, y: 16 }}
        animate={reduced || inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-12"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-default px-3 py-1 text-xs font-medium text-text-tertiary">
          How It Works
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-text-primary text-balance">
          Simple. Structured. Serious.
        </h2>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            initial={reduced ? {} : { opacity: 0, y: 24 }}
            animate={reduced || inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="rounded-xl border border-border-default p-6"
          >
            <span className="text-xs font-semibold tracking-widest text-text-tertiary">
              STEP {step.number}
            </span>
            <h3 className="mt-3 text-lg font-bold text-text-primary">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
