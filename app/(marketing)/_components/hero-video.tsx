import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function HeroVideo() {
  return (
    <section className="relative grid overflow-hidden lg:grid-cols-2 lg:gap-12 lg:pt-8">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -right-60 -top-60 h-[600px] w-[600px] rounded-full bg-brand-500/8 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent-amber/8 blur-[100px]" />

      {/* Content side */}
      <div className="relative z-10 flex flex-col justify-center pb-16 pt-16 sm:pt-24 lg:pb-24">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border-default bg-surface-card px-4 py-1.5 text-xs font-medium text-text-secondary">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Empowering African talent worldwide
        </div>

        <h1 className="mt-6 max-w-2xl text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-text-primary">
          Skills that
          <span className="text-brand-500"> travel</span>
          <br />
          with you.
        </h1>

        <p className="mt-4 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">
          Courses built for African learners by industry experts.
          Master in-demand skills, earn verified certificates,
          and advance your career — anywhere, at your pace.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-7 py-3.5 text-sm font-semibold text-text-primary dark:text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30 active:scale-[0.98]"
          >
            Browse Courses
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default bg-surface-card px-7 py-3.5 text-sm font-semibold text-text-primary shadow-sm transition-all hover:bg-surface-card-hover active:scale-[0.98]"
          >
            <Play size={16} className="text-brand-500" />
            Watch Overview
          </Link>
        </div>

        {/* Trusted bar */}
        <div className="mt-14">
          <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
            Trusted by learners at
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-3">
            {["Google", "Microsoft", "Amazon", "Stripe", "Figma"].map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-text-disabled"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Visual side — full-bleed video placeholder */}
      <div className="relative z-10 flex items-center justify-center pb-16 lg:pb-24 lg:pt-16">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-sunken ring-1 ring-border-default">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-surface-sunken to-accent-amber/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,theme(colors.brand.500/8),transparent_70%)]" />

          {/* Decorative grid lines */}
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.04]"
            aria-hidden="true"
          >
            <defs>
              <pattern id="hero-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 shadow-lg shadow-brand-500/30 transition-transform hover:scale-105">
              <Play size={24} className="ml-0.5 text-text-primary dark:text-white" />
            </div>
          </div>

          {/* Bottom-right stat card */}
          <div className="absolute bottom-4 right-4 rounded-xl bg-surface-card/90 px-4 py-3 shadow-lg backdrop-blur-sm ring-1 ring-border-default">
            <p className="text-2xl font-bold text-text-primary">10,000+</p>
            <p className="text-xs text-text-tertiary">Active learners</p>
          </div>

          {/* Top-left stat card */}
          <div className="absolute left-4 top-4 rounded-xl bg-surface-card/90 px-4 py-3 shadow-lg backdrop-blur-sm ring-1 ring-border-default">
            <p className="text-2xl font-bold text-brand-500">95%</p>
            <p className="text-xs text-text-tertiary">Career rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
