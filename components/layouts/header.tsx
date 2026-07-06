"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";

interface DashboardHeaderProps {
  breadcrumb: string;
  currentPage: string;
  accentClass?: string;
  initials: string;
}

export function DashboardHeader({
  breadcrumb,
  currentPage,
  accentClass = "bg-brand-orange/20 text-brand-orange",
  initials,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border-subtle bg-surface-card px-6">
      <div className="text-sm text-text-secondary">
        {breadcrumb} / <span className="text-text-primary font-medium">{currentPage}</span>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs font-bold ${accentClass}`}>
          {initials}
        </div>
      </div>
    </header>
  );
}
