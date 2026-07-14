"use client";

import { Code2, Monitor, Palette } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const CATEGORIES = [
  {
    icon: Code2,
    title: "Web Development",
    desc: "Build full-stack applications with modern frameworks and tools.",
    iconBg: "bg-[#e8f7ef] text-landing-green",
    courses: [
      { name: "Web Development Bootcamp", price: "$49" },
      { name: "Next.js Masterclass", price: "$39" },
      { name: "React & TypeScript", price: "$35" },
    ],
  },
  {
    icon: Monitor,
    title: "Data & AI",
    desc: "Master data science, machine learning, and AI fundamentals.",
    iconBg: "bg-[#f0f9ff] text-[#0ea5e9]",
    courses: [
      { name: "Data Science Fundamentals", price: "$39" },
      { name: "ML with Python", price: "$45" },
      { name: "Advanced DeFI Protocols", price: "$55" },
    ],
  },
  {
    icon: Palette,
    title: "Design & Creative",
    desc: "Learn product design, UX research, and creative tools.",
    iconBg: "bg-[#fef3ee] text-[#e87040]",
    courses: [
      { name: "UI/UX Design Masterclass", price: "$29" },
      { name: "Figma for Teams", price: "$25" },
      { name: "Product Design Thinking", price: "$35" },
    ],
  },
];

export function CategoriesSection() {
  return (
    <section className="bg-landing-card px-4 py-20 sm:px-6 lg:px-10" id="categories">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <div className="mb-3 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] text-landing-green">
              <span className="inline-block h-px w-6 bg-landing-green/40" />
              Explore Categories
              <span className="inline-block h-px w-6 bg-landing-green/40" />
            </div>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.625rem)] font-extrabold -tracking-[0.03em] text-landing-dark">
              Find your path
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <ScrollReveal key={cat.title} delay={i * 0.1}>
                <div className="group cursor-pointer overflow-hidden rounded-2xl border border-landing-border bg-landing-bg p-7 transition-all duration-300 hover:-translate-y-[3px] hover:border-landing-green/15 hover:shadow-md">
                  <div
                    className={`mb-4 flex size-14 items-center justify-center rounded-2xl text-2xl ${cat.iconBg}`}
                  >
                    <Icon size={26} />
                  </div>
                  <h3 className="text-base font-bold text-landing-dark sm:text-lg">{cat.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-landing-text-mid">{cat.desc}</p>

                  <ul className="space-y-2">
                    {cat.courses.map((course) => (
                      <li
                        key={course.name}
                        className="flex items-center justify-between border-b border-landing-border pb-1.5 text-xs text-landing-text-mid last:border-b-0 last:pb-0"
                      >
                        <span>{course.name}</span>
                        <span className="text-[11px] font-medium text-landing-text-light">{course.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
