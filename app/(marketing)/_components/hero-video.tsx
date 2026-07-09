"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export default function HeroVideo() {
  const reduced = useReducedMotion();

  return (
    <section className="relative grid pb-20 pt-16 sm:pt-24 lg:grid-cols-2 lg:gap-16 lg:pb-32">
      <motion.div
        initial={reduced ? {} : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col justify-center"
      >
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-50 px-4 py-1.5 text-xs font-semibold text-accent-500"
        >
          <Sparkles size={12} />
          Blockchain-verified certificates
        </motion.div>

        <h1 className="max-w-2xl text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight text-text-primary text-balance">
          Skills that{" "}
          <span className="relative">
            <span className="text-accent-500">travel</span>
            <svg
              className="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 200 8"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 5.5C58.5 1 130-1.5 199 5.5"
                stroke="currentColor"
                strokeWidth="2"
                className="text-accent-300"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          with you.
        </h1>

        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-5 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg"
        >
          Courses taught by African tech professionals.
          Build real projects, earn blockchain-verified certificates,
          and level up — on your schedule, not ours.
        </motion.p>

        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-8 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/courses"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-600 active:scale-[0.97]"
          >
            Browse Courses
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default bg-surface-card px-7 py-3.5 text-sm font-semibold text-text-primary transition-all hover:bg-surface-sunken active:scale-[0.97]"
          >
            Join Free
          </Link>
        </motion.div>

        <motion.div
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="mt-16 flex items-center gap-6"
        >
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full border-2 border-surface-card bg-gradient-to-br from-accent-300 to-accent-500"
              />
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">10,000+ learners</p>
            <p className="text-xs text-text-tertiary">Across 18 African countries</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={reduced ? {} : { opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative flex items-center justify-center pb-16 lg:pb-0 lg:pt-16"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border-default bg-gradient-to-br from-accent-50 to-surface-sunken shadow-sm">
          <svg className="absolute inset-0 h-full w-full opacity-[0.03]" aria-hidden="true">
            <defs>
              <pattern id="hero-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Play overview video"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-card shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="absolute inset-0 rounded-full bg-accent-500/10 animate-ping" style={{ animationDuration: "3s" }} />
              <Play size={20} className="relative text-accent-500 ml-0.5" />
            </motion.button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl bg-surface-card/90 backdrop-blur-sm px-4 py-3 border border-border-default">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/10 text-accent-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary">How SewAfri Works</p>
              <p className="text-xs text-text-tertiary">Watch in 2 minutes</p>
            </div>
            <span className="text-xs text-accent-500 font-medium">1:58</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
