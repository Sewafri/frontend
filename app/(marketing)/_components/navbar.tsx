"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { CATEGORIES } from "@/constants/landing";
import { BRAND } from "@/constants/brand";

const NAV_LINKS = [
  { label: "Courses", href: "#catalog", hasDropdown: true },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-surface-card/80 backdrop-blur-xl border-b border-border-default"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-500 text-sm font-bold text-white transition-transform group-hover:scale-105">
            {BRAND.name.slice(0, 1)}
          </div>
          <span className="font-display text-lg font-bold text-text-primary">
            {BRAND.name}
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <div key={link.label} className="relative">
              {link.hasDropdown ? (
                <div
                  ref={dropdownRef}
                  onMouseEnter={() => {
                    clearTimeout(dropdownTimer.current);
                    setIsDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    dropdownTimer.current = setTimeout(() => setIsDropdownOpen(false), 150);
                  }}
                >
                  <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-card-hover hover:text-text-primary">
                    {link.label}
                    <ChevronDown
                      size={14}
                      className="transition-transform duration-200"
                      style={{ transform: isDropdownOpen ? "rotate(180deg)" : undefined }}
                    />
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute left-0 top-full mt-1 w-52 rounded-xl border border-border-default bg-surface-card p-1.5 shadow-lg"
                      >
                        {CATEGORIES.filter((c) => c.value !== "all").map((cat) => (
                          <Link
                            key={cat.value}
                            href={`/courses?category=${cat.value}`}
                            className="block rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            {cat.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-card-hover hover:text-text-primary"
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-600 active:scale-[0.97]"
          >
            <Sparkles size={14} />
            Join Free
          </Link>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex text-text-primary md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border-default bg-surface-card md:hidden"
          >
            <div className="space-y-1 px-4 pb-6 pt-3">
              {NAV_LINKS.map((link) => (
                <div key={link.label}>
                  {link.hasDropdown ? (
                    <details className="group">
                      <summary className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary">
                        {link.label}
                        <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="ml-3 mt-1 space-y-1">
                        {CATEGORIES.filter((c) => c.value !== "all").map((cat) => (
                          <Link
                            key={cat.value}
                            href={`/courses?category=${cat.value}`}
                            className="block rounded-lg px-3 py-2 text-sm text-text-secondary hover:text-text-primary"
                            onClick={() => setIsMobileOpen(false)}
                          >
                            {cat.label}
                          </Link>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <Link
                      href={link.href}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="border-t border-border-default pt-3 mt-3 space-y-2">
                <Link
                  href="/sign-in"
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-600"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Sparkles size={14} />
                  Join Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function cn(...inputs: (string | false | null | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}
