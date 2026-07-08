"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, type LucideIcon } from "lucide-react";
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
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function SidebarNav({ links, user, accentClass = "brand", mobileOpen, onMobileClose }: SidebarNavProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const sidebar = (
    <nav
      className={cn(
        "flex h-screen flex-col border-r border-border-default bg-surface-card transition-all duration-200",
        collapsed ? "w-14" : "w-56",
      )}
    >
      {/* Brand */}
      <div className={cn(
        "flex items-center border-b border-border-default px-3",
        collapsed ? "justify-center py-4" : "justify-between py-3",
      )}>
        {!collapsed && (
          <Link href="/" onClick={onMobileClose} className="flex items-center gap-1.5">
            <span className="font-display text-lg font-bold text-text-primary">
              {BRAND.name}
            </span>
            <span className="h-2 w-2 rounded-full bg-accent-500" />
          </Link>
        )}
        {collapsed && (
          <Link href="/" onClick={onMobileClose} className="font-display text-lg font-bold text-text-primary">
            {BRAND.name.slice(0, 1)}
          </Link>
        )}
        <button
          onClick={() => {
            if (mobileOpen !== undefined && onMobileClose) {
              onMobileClose();
            } else {
              setCollapsed(!collapsed);
            }
          }}
          className={cn(
            "flex items-center justify-center rounded-lg p-1.5 text-text-tertiary transition-all hover:bg-surface-card-hover hover:text-text-primary",
            collapsed && "rotate-180",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Navigation links */}
      <div className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3 no-scrollbar">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onMobileClose}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-accent-50 text-accent-500"
                  : "text-text-secondary hover:bg-surface-card-hover hover:text-text-primary",
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent-500" />
              )}
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <span className="truncate">{link.label}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User area */}
      <div className={cn(
        "border-t border-border-default py-3",
        collapsed ? "flex justify-center px-2" : "space-y-2 px-3",
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-card-hover text-xs font-semibold text-text-secondary">
              {user.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">{user.name}</p>
              <p className="truncate text-xs text-text-tertiary">{user.role}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-card-hover text-xs font-semibold text-text-secondary">
            {user.initials}
          </div>
        )}
      </div>
    </nav>
  );

  if (mobileOpen !== undefined) {
    return (
      <>
        {/* Desktop — persistent sidebar, hidden on mobile */}
        <div className="hidden md:flex">{sidebar}</div>
        {/* Mobile — overlay sidebar with backdrop */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            <div className="fixed left-0 top-0 h-full">{sidebar}</div>
          </div>
        )}
      </>
    );
  }

  return sidebar;
}
