"use client";

import Link from "next/link";
import { ScrollReveal } from "./scroll-reveal";

const FOOTER_SECTIONS = {
  Product: [
    { label: "Courses", href: "/courses" },
    { label: "Categories", href: "#categories" },
    { label: "Pricing", href: "/pricing" },
    { label: "Certificates", href: "/certificates" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Partners", href: "/partners" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function FooterSection() {
  return (
    <footer className="bg-landing-dark px-4 pb-6 pt-14 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <ScrollReveal>
            <div className="sm:col-span-2 lg:col-span-1">
              <span className="text-xl font-extrabold">
                Sew<span className="text-landing-amber">Afri</span>
              </span>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#666]">
                Africa&apos;s project-based learning platform. Build real skills with
                expert instructors and land your next role.
              </p>
            </div>
          </ScrollReveal>

          {/* Link columns */}
          {Object.entries(FOOTER_SECTIONS).map(([title, links], colIdx) => (
            <ScrollReveal key={title} delay={0.1 + colIdx * 0.08}>
              <div>
                <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#555]">
                  {title}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#777] transition-colors hover:text-[#ccc]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom bar */}
        <ScrollReveal delay={0.4}>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#222] pt-5 text-xs text-[#555]">
            <span>&copy; 2026 SewAfri. All rights reserved.</span>
            <div className="flex gap-3">
              {/* Social icons */}
              {[
                {
                  href: "#",
                  label: "Twitter",
                  path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
                },
                {
                  href: "#",
                  label: "LinkedIn",
                  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                },
                {
                  href: "#",
                  label: "GitHub",
                  path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  title={social.label}
                  className="flex size-9 items-center justify-center rounded-xl bg-[#1a1d24] text-[#666] transition-all hover:bg-landing-green hover:text-white"
                  aria-label={social.label}
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" className="size-4">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
