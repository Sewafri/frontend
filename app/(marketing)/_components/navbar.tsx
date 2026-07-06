"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { BRAND } from "@/constants/brand";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { CATEGORIES } from "@/constants/landing";

const NAV_LINKS = [
  { label: "Courses", href: "#catalog", hasDropdown: true },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed inset-x-4 top-4 z-50 rounded-2xl border border-border-subtle bg-surface-card shadow-lg shadow-black/20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex cursor-pointer items-center gap-1.5">
          <span className="font-space-grotesk text-xl font-bold text-white">
            {BRAND.name}
          </span>
          <span className="h-2 w-2 rounded-full bg-brand-orange" />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label} className="relative">
              {link.hasDropdown ? (
                <div ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="group relative flex cursor-pointer items-center gap-1 text-sm font-medium text-text-secondary transition-colors hover:text-white"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className="transition-transform group-hover:rotate-180"
                    />
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-brand-orange transition-all duration-300 group-hover:w-full" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-border-subtle bg-surface-card p-2 shadow-lg shadow-black/20">
                      {CATEGORIES.filter((c) => c.value !== "all").map(
                        (cat) => (
                          <Link
                            key={cat.value}
                            href={`/courses?category=${cat.value}`}
                            className="block cursor-pointer rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-card hover:text-white"
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
                  className="group relative cursor-pointer text-sm font-medium text-text-secondary transition-colors hover:text-white"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-brand-orange transition-all duration-300 group-hover:w-full" />
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="cursor-pointer text-sm font-medium text-text-secondary transition-colors hover:text-white"
          >
            Sign In
          </Link>
          <Button
            render={<Link href="/sign-up" />}
            nativeButton={false}
            className="bg-brand-orange text-white transition-colors hover:bg-brand-orange/90"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger
            render={
              <button
                className="cursor-pointer text-white md:hidden"
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
            }
          />
          <SheetContent
            side="right"
            className="w-72 border-l border-border-subtle bg-surface-card pt-10 transition-all duration-300"
          >
            <ul className="space-y-1 px-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  {link.hasDropdown ? (
                    <details className="group">
                      <summary className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-card hover:text-white">
                        {link.label}
                        <ChevronDown
                          size={14}
                          className="transition-transform group-open:rotate-180"
                        />
                      </summary>
                      <ul className="ml-4 mt-1 space-y-1">
                        {CATEGORIES.filter((c) => c.value !== "all").map(
                          (cat) => (
                            <li key={cat.value}>
                              <Link
                                href={`/courses?category=${cat.value}`}
                                className="block cursor-pointer rounded-lg px-3 py-2 text-sm text-text-secondary hover:text-white"
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
                      className="block cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-card hover:text-white"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/sign-in"
                  className="block cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-card hover:text-white"
                  onClick={() => setIsSheetOpen(false)}
                >
                  Sign In
                </Link>
              </li>
              <li className="pt-2">
                <Button
                  render={
                    <Link
                      href="/sign-up"
                      onClick={() => setIsSheetOpen(false)}
                    />
                  }
                  nativeButton={false}
                  className="w-full bg-brand-orange text-white transition-colors hover:bg-brand-orange/90"
                >
                  Get Started
                </Button>
              </li>
            </ul>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
