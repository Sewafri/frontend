"use client";

import { useRef } from "react";
import { GraduationCap, Clock, TrendingUp, Globe, Users, Shield } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const FOCUS_ITEMS = [
  {
    icon: GraduationCap,
    title: "Expert Instructors",
    description: "Working professionals from African tech companies who build curriculum around the problems they actually solve — not textbook theory.",
  },
  {
    icon: Clock,
    title: "Flexible Learning",
    description: "Every course includes offline-capable materials and mobile-friendly lessons. Learn on the bus, during lunch, or late at night — no reliable connection required.",
  },
  {
    icon: TrendingUp,
    title: "Career Outcomes",
    description: "95% of graduates advance within six months. Not a stat we made up — we track and publish it because it is the only number that matters.",
  },
  {
    icon: Globe,
    title: "African Context",
    description: "Projects built around African markets, challenges, and opportunities. You are not learning to build for Silicon Valley — you are learning to build for Lagos, Nairobi, and Accra.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Direct access to instructors and peers through discussion threads and direct messaging. Learning alone is harder than it needs to be.",
  },
  {
    icon: Shield,
    title: "Verified Certificates",
    description: "Each certificate anchored on-chain so employers can verify it independently. Shareable on LinkedIn, your portfolio, or your CV.",
  },
];

function FocusCard({ item, index }: { item: typeof FOCUS_ITEMS[number]; index: number }) {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  if (reduced) {
    const Icon = item.icon;
    return (
      <article className="group rounded-xl border border-border-default bg-surface-card p-6 transition-colors hover:border-accent-500/30 hover:shadow-sm sm:p-7">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-border-default text-text-secondary transition-colors group-hover:border-accent-500/30 group-hover:text-accent-500">
          <Icon size={18} />
        </div>
        <h3 className="text-sm font-semibold text-text-primary">{item.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{item.description}</p>
      </article>
    );
  }

  const show = inView;
  const Icon = item.icon;

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 100, damping: 22, delay: index * 0.06 }}
      whileHover={{ y: -4, scale: 1.01, transition: { type: "spring", stiffness: 300, damping: 15 } }}
      className="group rounded-xl border border-border-default bg-surface-card p-6 transition-colors hover:border-accent-500/30 hover:shadow-sm sm:p-7"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-border-default text-text-secondary transition-colors group-hover:border-accent-500/30 group-hover:text-accent-500">
        <Icon size={18} />
      </div>
      <h3 className="text-sm font-semibold text-text-primary">{item.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{item.description}</p>
    </motion.article>
  );
}

export default function FocusCards() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <section className="py-24">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/10 bg-accent-50/50 px-3 py-1 text-xs font-medium text-accent-500 mb-4">Why SewAfri</div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary text-balance">Six ways we are different</h2>
          <p className="mt-3 text-base text-text-secondary max-w-lg">Every feature designed around one question: does this actually help African learners?</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FOCUS_ITEMS.map((item, index) => (
            <FocusCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 100, damping: 22 }}
        className="mb-14"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/10 bg-accent-50/50 px-3 py-1 text-xs font-medium text-accent-500 mb-4">Why SewAfri</div>
        <h2 className="text-3xl font-bold tracking-tight text-text-primary text-balance">Six ways we are different</h2>
        <p className="mt-3 text-base text-text-secondary max-w-lg">Every feature designed around one question: does this actually help African learners?</p>
      </motion.div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FOCUS_ITEMS.map((item, index) => (
          <FocusCard key={item.title} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
