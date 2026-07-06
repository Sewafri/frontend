"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  breadcrumb: string;
  currentPage: string;
  accentClass?: string;
  initials: string;
  onMenuToggle?: () => void;
}

const accentBgMap: Record<string, string> = {
  brand: "bg-brand-500/15 text-brand-500",
  admin: "bg-accent-red/15 text-accent-red",
  instructor: "bg-accent-green/15 text-accent-green",
};

export function DashboardHeader({
  breadcrumb,
  currentPage,
  accentClass = "brand",
  initials,
  onMenuToggle,
}: DashboardHeaderProps) {
  const bgClass = accentBgMap[accentClass] ?? accentBgMap.brand;

  return (
    <header className="flex h-14 items-center justify-between border-b border-border-default bg-surface-card px-4 md:px-6">
      <div className="flex items-center gap-2 text-sm">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="flex items-center justify-center rounded-lg p-1.5 text-text-tertiary transition-all hover:bg-surface-card-hover hover:text-text-primary md:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>
        )}
        <span className="text-text-tertiary">{breadcrumb}</span>
        <span className="text-text-tertiary">/</span>
        <span className="font-medium text-text-primary">{currentPage}</span>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
          bgClass,
        )}>
          {initials}
        </div>
      </div>
    </header>
  );
}
