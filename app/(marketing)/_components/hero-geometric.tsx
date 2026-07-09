"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Shield, CheckCircle } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import Companion from "@/components/companion/companion";

function springConfig(config?: Record<string, unknown>) {
  return { type: "spring" as const, stiffness: 120, damping: 22, ...config };
}

function fadeUpSpring(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: springConfig({ delay }),
  };
}

export default function HeroGeometric() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  /* ── Scroll-reactive parallax — right column fades/shifts as hero scrolls past ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const rightOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const rightY = useTransform(scrollYProgress, [0, 0.55], [0, -20]);

  if (reduced) {
    return (
      <section ref={sectionRef} className="relative min-h-[calc(100dvh-4rem)] overflow-hidden pb-20 pt-16 sm:pt-24 lg:pb-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <g>
              <path d="M550,900 L1440,350 L1440,900 Z" fill="var(--color-accent-50)" className="dark:opacity-20" />
              <path d="M850,200 L1200,450 L850,700 L500,450 Z" fill="var(--color-accent-100)" className="dark:opacity-20" />
              <path d="M1050,100 L1440,350 L1440,100 Z" fill="var(--color-accent-200)" className="dark:opacity-20" />
              <path d="M600,100 L800,250 L650,350 Z" fill="var(--color-accent-300)" className="dark:opacity-20" />
            </g>
          </svg>
        </div>
        <div className="relative mx-auto grid max-w-6xl px-6 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col justify-center pt-8 lg:pt-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-50 px-4 py-1.5 text-xs font-semibold text-accent-600">
              <Shield size={12} />
              Blockchain-verified certificates
            </div>
            <h1 className="max-w-2xl text-[clamp(2.75rem,6vw,4.5rem)] font-bold leading-[0.95] -tracking-[0.03em] text-text-primary text-balance">
              Skills that{" "}
              <span className="relative">
                <span className="text-accent-500">travel</span>
                <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 200 8" fill="none" aria-hidden="true">
                  <path d="M1 5.5C58.5 1 130-1.5 199 5.5" stroke="currentColor" strokeWidth="2.5" className="text-accent-300" strokeLinecap="round" />
                </svg>
              </span>{" "}
              with you.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">
              Courses taught by African tech professionals. Build real projects, earn blockchain-verified certificates, and level up — on your schedule, not ours.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/courses" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-600 active:scale-[0.97]">
                Browse Courses
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default bg-surface-card px-7 py-3.5 text-sm font-semibold text-text-primary transition-all hover:bg-surface-sunken active:scale-[0.97]">
                Join Free
              </Link>
            </div>
            <div className="mt-16 flex items-center gap-6">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-surface-card bg-gradient-to-br from-accent-300 to-accent-500" />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">10,000+ learners</p>
                <p className="text-xs text-text-tertiary">Across 18 African countries</p>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col items-center justify-center pt-8 lg:pt-16">
            <Companion
              message="What would you like to learn?"
              variant="waving"
              size="xxxl"
              bubblePosition="right"
              animate={false}
              glow
              onBubbleClick={() => {
                document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
              }}
            />

            <div className="mt-4 w-full max-w-sm origin-bottom-left rounded-2xl border border-border-default bg-surface-card p-6 transition-colors" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.04), 0 24px 48px rgba(0,0,0,0.03), 0 40px 80px rgba(0,0,0,0.02)" }}>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500 text-xs font-bold text-white">SA</div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">SewAfri</p>
                  <p className="text-xs text-text-tertiary">Blockchain Certificate</p>
                </div>
              </div>
              <div className="relative mb-5 flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-accent-100 to-accent-400">
                <div className="relative z-10 flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-accent-600 shadow-sm backdrop-blur-sm">
                  <CheckCircle size={14} />
                  Verified on Blockchain
                </div>
                <svg className="absolute inset-0 h-full w-full opacity-10" viewBox="0 0 200 200">
                  <defs>
                    <pattern id="cert-grid-r" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cert-grid-r)" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Full-Stack Web Development</h3>
              <p className="mt-1 text-sm text-text-secondary">Awarded upon completion</p>
              <div className="mt-4 flex items-center gap-2 border-t border-border-default pt-4">
                <CheckCircle size={14} className="text-accent-500" />
                <span className="text-xs text-text-secondary">Tamper-proof · Blockchain-secured · Lifetime access</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative min-h-[calc(100dvh-4rem)] overflow-hidden pb-20 pt-16 sm:pt-24 lg:pb-32">
      {/* ── Background geometric shapes ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <motion.g
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={springConfig({ duration: 1.2 })}
          >
            <path d="M550,900 L1440,350 L1440,900 Z" fill="var(--color-accent-50)" className="dark:opacity-20" />
            <path d="M850,200 L1200,450 L850,700 L500,450 Z" fill="var(--color-accent-100)" className="dark:opacity-20" />
            <path d="M1050,100 L1440,350 L1440,100 Z" fill="var(--color-accent-200)" className="dark:opacity-20" />
            <path d="M600,100 L800,250 L650,350 Z" fill="var(--color-accent-300)" className="dark:opacity-20" />
          </motion.g>
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="relative mx-auto grid max-w-6xl px-6 lg:grid-cols-2 lg:gap-20">
        {/* ── Left: Text ── */}
        <div className="flex flex-col justify-center pt-8 lg:pt-16">
          <motion.div {...fadeUpSpring(0.1)}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-50 px-4 py-1.5 text-xs font-semibold text-accent-600">
              <Shield size={12} />
              Blockchain-verified certificates
            </div>
          </motion.div>

          <motion.h1
            {...fadeUpSpring(0.2)}
            className="max-w-2xl text-[clamp(2.75rem,6vw,4.5rem)] font-bold leading-[0.95] -tracking-[0.03em] text-text-primary text-balance"
          >
            Skills that{" "}
            <span className="relative">
              <span className="text-accent-500">travel</span>
              <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 200 8" fill="none" aria-hidden="true">
                <path d="M1 5.5C58.5 1 130-1.5 199 5.5" stroke="currentColor" strokeWidth="2.5" className="text-accent-300" strokeLinecap="round" />
              </svg>
            </span>{" "}
            with you.
          </motion.h1>

          <motion.p {...fadeUpSpring(0.3)} className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">
            Courses taught by African tech professionals. Build real projects, earn blockchain-verified certificates, and level up — on your schedule, not ours.
          </motion.p>

          <motion.div {...fadeUpSpring(0.4)} className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/courses" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-600 active:scale-[0.97]">
              Browse Courses
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default bg-surface-card px-7 py-3.5 text-sm font-semibold text-text-primary transition-all hover:bg-surface-sunken active:scale-[0.97]">
              Join Free
            </Link>
          </motion.div>

          <motion.div {...fadeUpSpring(0.5)} className="mt-16 flex items-center gap-6">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={springConfig({ delay: 0.6 + i * 0.08 })}
                  className="h-8 w-8 rounded-full border-2 border-surface-card bg-gradient-to-br from-accent-300 to-accent-500"
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">10,000+ learners</p>
              <p className="text-xs text-text-tertiary">Across 18 African countries</p>
            </div>
          </motion.div>
        </div>

        {/* ── Right: Sproot (primary) + Certificate card ── */}
        <motion.div
          style={{ opacity: rightOpacity, y: rightY }}
          className="relative flex flex-col items-center justify-center pt-8 lg:pt-16"
        >
          {/* Sproot — co-focal point with the headline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={springConfig({ delay: 0.2, stiffness: 80, damping: 14 })}
          >
            <Companion
              message="What would you like to learn?"
              variant="waving"
              size="xxxl"
              bubblePosition="right"
              animate
              glow
              interactive
              intensity="high"
              onBubbleClick={() => {
                document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </motion.div>

          {/* Certificate card — proof of what you earn */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springConfig({ delay: 0.5 })}
            className="mt-4"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              whileHover={{ rotate: 0, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 15 } }}
              className="w-full max-w-sm origin-bottom-left rounded-2xl border border-border-default bg-surface-card p-6 transition-colors"
              style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.04), 0 24px 48px rgba(0,0,0,0.03), 0 40px 80px rgba(0,0,0,0.02)" }}
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500 text-xs font-bold text-white">SA</div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">SewAfri</p>
                  <p className="text-xs text-text-tertiary">Blockchain Certificate</p>
                </div>
              </div>

              <div className="relative mb-5 flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-accent-100 to-accent-400">
                <div className="relative z-10 flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-accent-600 shadow-sm backdrop-blur-sm">
                  <CheckCircle size={14} />
                  Verified on Blockchain
                </div>
                <svg className="absolute inset-0 h-full w-full opacity-10" viewBox="0 0 200 200">
                  <defs>
                    <pattern id="cert-grid-a" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cert-grid-a)" />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-text-primary">Full-Stack Web Development</h3>
              <p className="mt-1 text-sm text-text-secondary">Awarded upon completion</p>

              <div className="mt-4 flex items-center gap-2 border-t border-border-default pt-4">
                <CheckCircle size={14} className="text-accent-500" />
                <span className="text-xs text-text-secondary">Tamper-proof · Blockchain-secured · Lifetime access</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
