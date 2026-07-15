"use client";

import { Users, BadgeCheck, Clock, TrendingUp, Globe, MessageCircle } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const FEATURES = [
  {
    icon: Users,
    title: "Expert Instructors",
    desc: "Courses built by professionals at Africa's leading tech companies — Paystack, Andela, Flutterwave. Real-world experience, not just theory.",
    large: true,
  },
  {
    icon: BadgeCheck,
    title: "Verified Certificates",
    desc: "Blockchain-anchored certificates that are tamper-proof and shareable. Employers verify your skills instantly.",
    accent: true,
  },
  {
    icon: Clock,
    title: "Flexible Learning",
    desc: "Study on your schedule with offline access, mobile-friendly content, and weekly live sessions you can replay.",
  },
  {
    icon: TrendingUp,
    title: "Career Outcomes",
    desc: "95% of graduates advance within 6 months. Portfolio reviews, mock interviews, and job referrals included.",
  },
  {
    icon: Globe,
    title: "African Context",
    desc: "Projects built around African markets and challenges. Skills immediately applicable in your local ecosystem.",
  },
  {
    icon: MessageCircle,
    title: "Community Driven",
    desc: "Discussion forums, peer study groups, and a network of 10,000+ learners across 18 African countries.",
  },
];

export function WhyChoose() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-10" id="why">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="mb-14 text-center">
            <div className="mb-3 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] text-landing-green">
              <span className="inline-block h-px w-6 bg-landing-green/40" />
              Why SewAfri
              <span className="inline-block h-px w-6 bg-landing-green/40" />
            </div>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.625rem)] font-extrabold -tracking-[0.03em] text-landing-text">
              Built for African learners, by African experts
            </h2>
          </div>
        </ScrollReveal>

        {/* Bento grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            const spanClass = feature.large ? "sm:col-span-2" : "";
            const accentClass = feature.accent
              ? "bg-landing-green border-landing-green text-white"
              : "border-landing-border bg-landing-card";

            return (
              <ScrollReveal key={feature.title} delay={i * 0.06}>
                <div
                  className={`group overflow-hidden rounded-2xl border p-7 transition-all duration-300 hover:shadow-md ${spanClass} ${accentClass}
                    ${feature.accent ? "" : "hover:border-landing-green/20"}`}
                >
                  <div
                    className={`mb-4 flex size-11 items-center justify-center rounded-xl ${
                      feature.accent ? "bg-white/15 text-white" : "bg-landing-green-light text-landing-green"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className={`text-base font-bold sm:text-lg ${feature.accent ? "text-white" : "text-landing-text"}`}>
                    {feature.title}
                  </h3>
                  <p
                    className={`mt-1.5 text-sm leading-relaxed ${
                      feature.accent ? "text-white/75" : "text-landing-text-mid"
                    }`}
                  >
                    {feature.desc}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
