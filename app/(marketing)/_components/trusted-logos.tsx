"use client";

import { ScrollReveal } from "./scroll-reveal";

const LOGOS = ["Paystack", "Flutterwave", "Andela", "M-Pesa", "Safaricom", "Jumo"];

export function TrustedLogos() {
  return (
    <section className="px-4 py-10 text-center sm:px-6 lg:px-10">
      <ScrollReveal>
        <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.15em] text-landing-text-light">
          Our instructors are trusted by
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {LOGOS.map((name) => (
            <span
              key={name}
              className="text-base font-extrabold tracking-tight text-landing-dark opacity-30 transition-opacity hover:opacity-50 sm:text-lg"
            >
              {name}
            </span>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
