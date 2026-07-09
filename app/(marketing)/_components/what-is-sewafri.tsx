"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const METRICS = [
  { value: "500+", label: "Expert-led courses" },
  { value: "2x", label: "Live sessions every week" },
  { value: "10+", label: "Real portfolio projects" },
];

export default function WhatIsSewafri() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <section ref={ref} className="py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 24 }}
          animate={reduced || inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-default px-3 py-1 text-xs font-medium text-text-tertiary">
            What is SewAfri
          </div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-text-primary text-balance sm:text-4xl">
            Learn skills that
            <br />
            build your future.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-text-secondary">
            SewAfri is a live, project-based platform designed to help ambitious African learners
            become confident, job-ready creators in just a few months.
          </p>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-text-secondary">
            Every student builds real-world projects, receives weekly mentorship, and graduates with
            a portfolio built for opportunities &mdash; not just certificates.
          </p>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-text-secondary">
            Built for young Africans who are tired of endless tutorials and ready to actually level up.
          </p>
          <Link
            href="/sign-up"
            className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-text-primary transition-colors hover:opacity-70"
          >
            Join Next Cohort
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 24 }}
          animate={reduced || inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col justify-center gap-6"
        >
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={reduced ? {} : { opacity: 0, x: 24 }}
              animate={reduced || inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-5 rounded-xl border border-border-default p-5"
            >
              <span className="text-2xl font-bold text-text-primary">{metric.value}</span>
              <span className="text-sm text-text-secondary">{metric.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
