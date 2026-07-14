"use client";

import { ScrollReveal } from "./scroll-reveal";

const STEPS = [
  { num: 1, title: "Register & Choose", desc: "Create your free account and pick a course that matches your goals and schedule." },
  { num: 2, title: "Learn by Building", desc: "Join live sessions, work on real projects with instructor feedback, and collaborate with peers." },
  { num: 3, title: "Land Your Next Role", desc: "Get career support, portfolio reviews, and a blockchain-verified certificate employers trust." },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-10" id="how">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <div className="mb-14 text-center">
            <div className="mb-3 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] text-landing-green">
              <span className="inline-block h-px w-6 bg-landing-green/40" />
              How It Works
              <span className="inline-block h-px w-6 bg-landing-green/40" />
            </div>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.625rem)] font-extrabold -tracking-[0.03em] text-landing-dark">
              Simple. Structured. Serious.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-landing-text-mid sm:text-base">
              Three steps from enrollment to career growth — no fluff, just results.
            </p>
          </div>
        </ScrollReveal>

        {/* Steps with connector line */}
        <div className="relative grid gap-10 sm:grid-cols-3">
          {/* Connector line (desktop) */}
          <div
            className="pointer-events-none absolute left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] top-10 hidden h-0.5 sm:block"
            style={{
              background: "linear-gradient(90deg, #0a7c42, #f5a623)",
              opacity: 0.2,
            }}
          />

          {STEPS.map((step, i) => (
            <ScrollReveal key={step.num} delay={i * 0.15}>
              <div className="text-center">
                <div
                  className={`mx-auto mb-5 flex size-[56px] items-center justify-center rounded-full text-xl font-extrabold text-white transition-transform duration-300 hover:scale-110 ${
                    step.num === 1
                      ? "bg-landing-green"
                      : step.num === 2
                        ? "bg-gradient-to-br from-landing-green to-landing-amber"
                        : "bg-landing-amber"
                  }`}
                >
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-landing-dark sm:text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-landing-text-mid">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
