"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <motion.section
      ref={ref}
      initial={reduced ? {} : { opacity: 0, y: 32, scale: 0.98 }}
      animate={reduced || inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="py-16"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-600 via-accent-500 to-accent-700 px-8 py-16 text-center sm:px-16">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" aria-hidden="true">
            <defs>
              <pattern id="cta-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>

        <motion.h2
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          animate={reduced || inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          First course starts in under 2 minutes
        </motion.h2>
        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          animate={reduced || inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative mx-auto mt-3 max-w-md text-base text-white/85"
        >
          No onboarding flow, no credit card, no &ldquo;talk to sales.&rdquo;
          Pick a course and start learning — free, right now.
        </motion.p>
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          animate={reduced || inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/sign-up"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-accent-700 shadow-sm transition-all hover:bg-white/90 active:scale-[0.97]"
          >
            <Sparkles size={16} />
            Create Free Account
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.97]"
          >
            Browse Courses
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
