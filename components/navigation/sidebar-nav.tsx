"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/constants/brand";

export interface SidebarLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarNavProps {
  links: SidebarLink[];
  user: { initials: string; name: string; role: string };
  accentClass?: string;
}

export function SidebarNav({ links, user, accentClass = "text-brand-orange" }: SidebarNavProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <nav
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border-subtle bg-surface-card transition-all duration-150",
        isHovered ? "w-40" : "w-12",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Brand mark */}
      <div className="flex items-center justify-center border-b border-border-subtle py-4">
        <span className="font-space-grotesk text-base font-bold text-white">{BRAND.name.slice(0, 1)}</span>
      </div>

      {/* Navigation links */}
      <div className="flex flex-1 flex-col items-center gap-1 px-1 pt-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors duration-150 cursor-pointer",
                isActive
                  ? accentClass
                  : "text-text-secondary hover:bg-surface-card-hover hover:text-white",
              )}
              style={isActive ? { borderLeft: "2px solid #ff7000" } : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap text-sm transition-opacity duration-150",
                  isHovered ? "opacity-100" : "opacity-0",
                )}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* User avatar */}
      <div className="flex justify-center border-t border-border-subtle py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-card-hover text-xs font-medium text-text-secondary">
          {user.initials}
        </div>
      </div>
    </nav>
  );
}
