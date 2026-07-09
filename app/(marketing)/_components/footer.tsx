"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { BRAND } from "@/constants/brand";

const footerLinks = {
  product: [
    { label: "Courses", href: "/courses" },
    { label: "Certificates", href: "/certificates" },
    { label: "Pricing", href: "/pricing" },
    { label: "For Teams", href: "/teams" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  return (
    <motion.footer
      ref={ref}
      initial={reduced ? {} : { opacity: 0 }}
      animate={reduced || inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4 }}
      className="border-t border-border-default py-16"
    >
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          animate={reduced || inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="lg:col-span-2"
        >
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-500 text-sm font-bold text-white transition-transform group-hover:scale-105">
              {BRAND.name.slice(0, 1)}
            </div>
            <span className="font-display text-xl font-bold text-text-primary">
              {BRAND.name}
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
            {BRAND.description}
          </p>
        </motion.div>

        {Object.entries(footerLinks).map(([key, links], colIdx) => (
          <motion.div
            key={key}
            initial={reduced ? {} : { opacity: 0, y: 12 }}
            animate={reduced || inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 + colIdx * 0.08, duration: 0.4 }}
          >
            <h4 className="text-sm font-semibold capitalize text-text-primary">
              {key}
            </h4>
            <ul className="mt-3 space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={reduced ? {} : { opacity: 0 }}
        animate={reduced || inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-12 flex items-center justify-between border-t border-border-default pt-6 text-xs text-text-tertiary"
      >
        <span>{BRAND.copyright}</span>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:text-text-primary transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
          <Link href="/cookies" className="hover:text-text-primary transition-colors">Cookies</Link>
        </div>
      </motion.div>
    </motion.footer>
  );
}
