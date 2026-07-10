"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import Companion from "@/components/companion/companion";

export default function HeroGeometric() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -30]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100dvh-4rem)] overflow-hidden pb-16 pt-16 sm:pt-20 lg:pb-20"
    >
      {/* ── Geometric squares background ── */}
      <motion.div
        style={{ opacity, y }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <rect x="80" y="60" width="180" height="180" rx="12" fill="none" stroke="var(--color-border-default)" strokeWidth="1" opacity="0.5" />
          <rect x="1100" y="100" width="240" height="240" rx="16" fill="none" stroke="var(--color-border-default)" strokeWidth="1" opacity="0.4" />
          <rect x="60" y="400" width="120" height="120" rx="8" fill="none" stroke="var(--color-border-default)" strokeWidth="1" opacity="0.3" />
          <rect x="1200" y="450" width="160" height="160" rx="10" fill="none" stroke="var(--color-border-default)" strokeWidth="1" opacity="0.35" />
          <rect x="900" y="50" width="80" height="80" rx="6" fill="var(--color-border-default)" opacity="0.15" />
          <rect x="250" y="500" width="100" height="100" rx="8" fill="var(--color-border-default)" opacity="0.1" />
        </svg>

        {/* ── Nexus-style watermark ── */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
          <span
            className="text-[clamp(6rem,15vw,18rem)] font-bold leading-none opacity-[0.025] tracking-[-0.06em]"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            SEWAFRI
          </span>
        </div>
      </motion.div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 lg:flex-row lg:gap-16">
        <motion.div
          style={{ opacity, y }}
          className="flex flex-col items-center text-center lg:flex-1 lg:items-start lg:text-left"
        >
          <motion.h1
            initial={reduced ? {} : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-3xl text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold leading-[0.95] -tracking-[0.03em] text-text-primary text-balance"
          >
            Skills that{" "}
            <span className="text-text-primary">travel</span>
            <br />
            with you.
          </motion.h1>

          <motion.p
            initial={reduced ? {} : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg"
          >
            Courses taught by African tech professionals. Build real projects, earn blockchain-verified certificates, and level up — on your schedule, not ours.
          </motion.p>

          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/courses"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-text-primary px-7 py-3.5 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.97]"
            >
              Browse Courses
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default px-7 py-3.5 text-sm font-semibold text-text-primary transition-all hover:bg-surface-card-hover active:scale-[0.97]"
            >
              Join Free
            </Link>
          </motion.div>

          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-12 flex items-center gap-6"
          >
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-background bg-accent-400"
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
          initial={reduced ? {} : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-10 lg:mt-0 lg:flex-1"
        >
          <div className="flex flex-col items-center">
            <Companion
              message="What would you like to learn?"
              variant="waving"
              size="xxxl"
              bubblePosition="top"
              animate
              glow={false}
              onBubbleClick={() => {
                document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
