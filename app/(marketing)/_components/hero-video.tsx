import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroVideo() {
  return (
    <section className="relative grid pb-20 pt-10 sm:pt-20 lg:grid-cols-2 lg:gap-16 lg:pb-28">
      {/* Content side */}
      <div className="flex flex-col justify-center">
        <h1 className="max-w-2xl text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-text-primary text-balance">
          Skills that
          <br />
          <span className="text-accent-500">travel with you.</span>
        </h1>

        <p className="mt-5 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">
          Courses taught by African tech professionals.
          Build real projects, earn blockchain-verified certificates,
          and level up — on your schedule, not ours.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-7 py-3.5 text-sm font-semibold text-text-on-accent transition-all hover:bg-accent-600"
          >
            Browse Courses
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default bg-surface-card px-7 py-3.5 text-sm font-semibold text-text-primary transition-all hover:bg-surface-sunken"
          >
            Join Free
          </Link>
        </div>

        <div className="mt-16">
          <p className="text-xs font-medium text-text-tertiary">
            <span className="font-semibold text-text-primary">10,000+</span> learners across 18 African countries
          </p>
        </div>
      </div>

      {/* Visual side — clean video placeholder */}
      <div className="flex items-center justify-center pb-16 lg:pb-0 lg:pt-16">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border-default bg-surface-sunken">
          {/* Subtle grid pattern */}
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
            <button
              aria-label="Play overview video"
              className="flex h-16 w-16 items-center justify-center rounded-full border border-border-default bg-surface-card transition-colors hover:bg-surface-sunken animate-pulse-ring hover:animate-none"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M5 3l8 5-8 5V3z" fill="currentColor" className="text-text-primary" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
