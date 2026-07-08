"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-4 top-4 z-50 rounded-xl border transition-all duration-200 ${
        scrolled
          ? "border-border-strong bg-surface-card"
          : "border-border-default bg-surface-card"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-display text-lg font-bold text-text-primary">
            {BRAND.name}
          </span>
          <span className="h-2 w-2 rounded-full bg-accent-500" />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label} className="relative">
              {link.hasDropdown ? (
                <div ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className="transition-transform duration-200"
                      style={{ transform: isDropdownOpen ? "rotate(180deg)" : undefined }}
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-52 rounded-xl border border-border-default bg-surface-card p-1.5 shadow-lg">
                      {CATEGORIES.filter((c) => c.value !== "all").map(
                        (cat) => (
                          <Link
                            key={cat.value}
                            href={`/courses?category=${cat.value}`}
                            className="block rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            {cat.label}
                          </Link>
                        ),
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Sign In
          </Link>
          <Button
            render={<Link href="/sign-up" />}
            nativeButton={false}
            className="bg-accent-500 text-text-on-accent transition-all hover:bg-accent-600"
          >
            Join Free
          </Button>
        </div>

        {/* Mobile Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger
            render={
              <button
                className="flex text-text-primary md:hidden"
                aria-label="Toggle menu"
              >
                {isSheetOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            }
          />
          <SheetContent
            side="right"
            className="w-72 border-l border-border-default bg-surface-card pt-14"
          >
            <ul className="space-y-1 px-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  {link.hasDropdown ? (
                    <details className="group">
                      <summary className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary">
                        {link.label}
                        <ChevronDown
                          size={14}
                          className="transition-transform group-open:rotate-180"
                        />
                      </summary>
                      <ul className="ml-3 mt-1 space-y-1">
                        {CATEGORIES.filter((c) => c.value !== "all").map(
                          (cat) => (
                            <li key={cat.value}>
                              <Link
                                href={`/courses?category=${cat.value}`}
                                className="block rounded-lg px-3 py-2 text-sm text-text-secondary hover:text-text-primary"
                                onClick={() => setIsSheetOpen(false)}
                              >
                                {cat.label}
                              </Link>
                            </li>
                          ),
                        )}
                      </ul>
                    </details>
                  ) : (
                    <Link
                      href={link.href}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="border-t border-border-default pt-2">
                <Link
                  href="/sign-in"
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary"
                  onClick={() => setIsSheetOpen(false)}
                >
                  Sign In
                </Link>
              </li>
              <li className="pt-1">
                <Button
                  render={
                    <Link
                      href="/sign-up"
                      onClick={() => setIsSheetOpen(false)}
                    />
                  }
                  nativeButton={false}
                  className="w-full bg-accent-500 text-text-on-accent transition-all hover:bg-accent-600"
                >
                  Join Free
                </Button>
              </li>
            </ul>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
