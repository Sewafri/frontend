"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const BADGES = [
  { text: "Free to start" },
  { text: "No credit card required" },
  { text: "Cancel anytime" },
];

export function CTASection() {
  return (
    <section
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-10"
      style={{
        background: "linear-gradient(135deg, #065c30 0%, #0a7c42 50%, #10a85a 100%)",
      }}
    >
      {/* Decorative circles */}
      <div
        className="pointer-events-none absolute -right-20 -top-40 size-[500px] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.06), transparent 65%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 size-[400px] rounded-full opacity-[0.08]"
        style={{
          background: "radial-gradient(circle, rgba(245,166,35,0.08), transparent 65%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <ScrollReveal>
          <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-black -tracking-[0.03em] leading-tight text-white">
            Ready to start?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/70">
            Join thousands of African learners building real skills for real careers.
            Your first step starts here.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-landing-green-dark transition-all hover:bg-gray-100 active:scale-[0.97]"
              style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}
            >
              Create Free Account
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/50 active:scale-[0.97]"
            >
              Browse Courses
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {BADGES.map((badge) => (
              <div
                key={badge.text}
                className="flex items-center gap-2 text-xs font-medium text-white/65"
              >
                <Check size={15} className="text-landing-amber" />
                {badge.text}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
