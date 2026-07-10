"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <section ref={ref} className="py-24">
      <motion.div
        initial={reduced ? {} : { opacity: 0, y: 24 }}
        animate={reduced || inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="rounded-2xl border border-border-default bg-surface-card p-10 text-center sm:p-16"
      >
        <h2 className="text-3xl font-bold tracking-tight text-text-primary text-balance sm:text-4xl">
          Ready to start?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-text-secondary">
          Join ambitious African students who&apos;ve chosen to stop watching tutorials and start
          building real skills, real projects, and real careers.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-text-primary px-7 py-3.5 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.97]"
          >
            Create Free Account
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default px-7 py-3.5 text-sm font-semibold text-text-primary transition-all hover:bg-surface-card-hover active:scale-[0.97]"
          >
            Browse Courses
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-text-tertiary">
          <span>100% Project-Based</span>
          <span className="h-3 w-px bg-border-default" />
          <span>Live Expert Mentorship</span>
          <span className="h-3 w-px bg-border-default" />
          <span>Portfolio Guaranteed</span>
        </div>
      </motion.div>
    </section>
  );
}
