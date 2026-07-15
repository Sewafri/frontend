"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const NAV_LINKS = [
  { label: "Courses", href: "#courses" },
  { label: "How It Works", href: "#how" },
  { label: "Why Us", href: "#why" },
  { label: "Categories", href: "#categories" },
];

const themeToggleClass =
  "border-landing-border bg-landing-card text-landing-text-mid hover:bg-landing-bg hover:text-landing-text";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-landing-border/80 bg-landing-bg/72 shadow-sm backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Left */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-[22px] font-extrabold -tracking-[0.03em] text-landing-green">
              Sew<span className="text-landing-amber">Afri</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-lg px-3.5 py-2 text-sm font-medium text-landing-text-mid transition-all hover:bg-surface-overlay hover:text-landing-text"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right — desktop */}
          <div className="hidden items-center gap-2.5 md:flex">
            <ThemeToggle className={themeToggleClass} />
            <Link
              href="/sign-in"
              className="rounded-[10px] border-2 border-landing-border bg-transparent px-5 py-2 text-sm font-semibold text-landing-text transition-all hover:border-landing-green hover:text-landing-green"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-[10px] bg-landing-green px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-landing-green-dark"
              style={{ boxShadow: "0 4px 14px rgba(10,124,66,0.25)" }}
            >
              Join Free
            </Link>
          </div>

          {/* Mobile: theme + menu */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle className={themeToggleClass} />
            <button
              onClick={() => setMobileOpen(true)}
              className="flex size-10 items-center justify-center rounded-[10px] border border-landing-border bg-landing-card"
              aria-label="Open menu"
            >
              <Menu size={20} className="text-landing-text-mid" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute right-0 top-0 flex h-full w-[280px] flex-col gap-2 bg-landing-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <ThemeToggle className={themeToggleClass} />
              <button
                onClick={() => setMobileOpen(false)}
                className="flex size-9 items-center justify-center rounded-[10px] border border-landing-border bg-landing-card"
                aria-label="Close menu"
              >
                <X size={18} className="text-landing-text-mid" />
              </button>
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-[10px] px-4 py-3 text-sm font-medium text-landing-text-mid transition-colors hover:bg-landing-bg hover:text-landing-text"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-auto flex flex-col gap-2 border-t border-landing-border pt-4">
              <Link
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="block rounded-[10px] border-2 border-landing-border px-4 py-2.5 text-center text-sm font-semibold text-landing-text transition-colors hover:border-landing-green hover:text-landing-green"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileOpen(false)}
                className="block rounded-[10px] bg-landing-green px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-landing-green-dark"
              >
                Join Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
