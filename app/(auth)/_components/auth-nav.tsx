"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function AuthNav() {
  return (
    <div className="auth-nav flex items-center justify-between gap-3">
      <Link href="/" className="text-[22px] font-extrabold -tracking-[0.03em] text-landing-green">
        Sew<span className="text-landing-amber">Afri</span>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle className="border-landing-border bg-landing-card text-landing-text-mid hover:bg-landing-bg hover:text-landing-text" />
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-landing-text-light transition-all hover:bg-surface-overlay hover:text-landing-text"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>
    </div>
  );
}
