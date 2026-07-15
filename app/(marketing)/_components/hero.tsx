"use client";

import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

const TAGS = [
  { label: "Web Dev", query: "Web Development" },
  { label: "Blockchain", query: "Blockchain" },
  { label: "Data Science", query: "Data Science" },
  { label: "UI/UX", query: "UI/UX Design" },
  { label: "AI/ML", query: "AI & Machine Learning" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-20 pt-[148px] sm:px-6 lg:px-10">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute right-[10%] top-[20%] h-[60%] w-[80%] opacity-[0.06]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 40%, #0a7c42 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 70%, #f5a623 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left column */}
        <div>
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-landing-green-light px-3 py-1.5 text-xs font-semibold text-landing-green sm:px-4 sm:py-2 sm:text-sm">
            <span className="size-2 animate-pulse rounded-full bg-landing-green" />
            Now enrolling — Next cohort starts soon
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(2.5rem,5.5vw,4.25rem)] font-black leading-[1.05] -tracking-[0.04em] text-landing-text">
            Skills that <span className="relative text-landing-green">travel</span>{" "}
            with you.
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-lg text-base leading-relaxed text-landing-text-mid sm:text-lg">
            Learn from Africa&apos;s top tech professionals. Build real projects, earn
            blockchain-verified certificates, and grow on your own schedule.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-[10px] bg-landing-green px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-landing-green-dark active:scale-[0.97]"
              style={{ boxShadow: "0 4px 14px rgba(10,124,66,0.25)" }}
            >
              Join Free
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-[10px] border-2 border-landing-border bg-transparent px-6 py-3.5 text-sm font-semibold text-landing-text transition-all hover:border-landing-green hover:text-landing-green active:scale-[0.97]"
            >
              Browse Courses
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex max-w-sm items-center gap-4 rounded-2xl border border-landing-border bg-landing-card px-5 py-4 shadow-sm">
            <div className="flex -space-x-2.5">
              {["#e87040", "#0ea5e9", "#8b5cf6", "#0a7c42"].map((color, i) => (
                <div
                  key={i}
                  className="flex size-9 items-center justify-center rounded-full border-[2.5px] border-white text-xs font-bold text-white"
                  style={{ background: color }}
                >
                  {["SM", "JW", "LC", "AK"][i]}
                </div>
              ))}
            </div>
            <div className="text-sm leading-snug text-landing-text-mid">
              <strong className="font-bold text-landing-text">10,000+</strong> learners across
              <br />
              18 African countries
            </div>
          </div>
        </div>

        {/* Right column — Search card */}
        <div className="relative">
          <div className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full" aria-hidden>
            <div
              className="size-full rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(10,124,66,0.1), transparent 70%)",
              }}
            />
          </div>

          <div className="relative rounded-2xl border border-landing-border bg-landing-card p-8 shadow-lg">
            <h3 className="text-sm font-semibold text-landing-text">What would you like to learn?</h3>
            <p className="mb-5 text-xs text-landing-text-light">Search from 500+ expert-led courses</p>

            {/* Search bar */}
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border-2 border-landing-border bg-landing-bg px-4 py-3.5 transition-colors focus-within:border-landing-green">
              <Search size={18} className="shrink-0 text-landing-text-light" />
              <input
                type="text"
                placeholder="Web development, Data science, Design..."
                className="w-full bg-transparent text-sm text-landing-text outline-none placeholder:text-landing-text-light"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag.label}
                  className="rounded-lg border border-landing-border bg-landing-bg px-3.5 py-1.5 text-xs font-medium text-landing-text-mid transition-colors hover:border-landing-green hover:bg-landing-green-light hover:text-landing-green"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
