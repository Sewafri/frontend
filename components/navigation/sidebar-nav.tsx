"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, LogOut, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/constants/brand";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/lib/auth/auth-context";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

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

const accentMap: Record<string, { active: string; hover: string }> = {
  brand: { active: "bg-accent-50 text-accent-500", hover: "hover:bg-accent-50/50 hover:text-accent-500" },
  admin: { active: "bg-accent-green/10 text-accent-green", hover: "hover:bg-accent-green/5 hover:text-accent-green" },
  instructor: { active: "bg-accent-purple/10 text-accent-purple", hover: "hover:bg-accent-purple/5 hover:text-accent-purple" },
};

function SidebarLinkItem({ link, collapsed, active, accent, onClose }: { link: SidebarLink; collapsed: boolean; active: boolean; accent: { active: string; hover: string }; onClose?: () => void }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      onClick={onClose}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center mx-auto w-11 h-11" : "",
        active
          ? accent.active + " shadow-sm"
          : "text-text-secondary " + accent.hover,
      )}
    >
      {active && !collapsed && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-accent-500"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <Icon className={cn("shrink-0", collapsed ? "h-5 w-5" : "h-4.5 w-4.5")} />
      {!collapsed && <span className="truncate">{link.label}</span>}
    </Link>
  );
}

export function SidebarNav({ links, user, accentClass = "brand", mobileOpen, onMobileClose }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const accent = accentMap[accentClass] ?? accentMap.brand;
  const { logout } = useAuth();

  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/sign-in");
    } finally {
      setLoggingOut(false);
      setLogoutOpen(false);
    }
  };

  const sidebarContent = (
    <nav
      className={cn(
        "flex h-screen flex-col border-r border-border-default bg-surface-card transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className={cn(
        "flex items-center border-b border-border-default",
        collapsed ? "justify-center py-4" : "justify-between px-4 py-3.5",
      )}>
        {!collapsed ? (
          <Link href="/" onClick={onMobileClose} className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-500 text-xs font-bold text-white">
              {BRAND.name.slice(0, 1)}
            </div>
            <span className="text-sm font-semibold text-text-primary">{BRAND.name}</span>
          </Link>
        ) : (
          <Link href="/" onClick={onMobileClose} className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-500 text-xs font-bold text-white">
            {BRAND.name.slice(0, 1)}
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "hidden md:flex items-center justify-center rounded-lg p-1.5 text-text-tertiary transition-all hover:bg-surface-card-hover hover:text-text-primary",
            collapsed && "rotate-180",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft size={15} />
        </button>
      </div>

      <div className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4 no-scrollbar">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <SidebarLinkItem
              key={link.href}
              link={link}
              collapsed={collapsed}
              active={isActive}
              accent={accent}
              onClose={onMobileClose}
            />
          );
        })}
      </div>

      <div className="border-t border-border-default">
        <div className={cn(
          "py-3",
          collapsed ? "flex flex-col items-center gap-1 px-2" : "px-3",
        )}>
          <div className={cn(
            "flex items-center rounded-xl transition-colors hover:bg-surface-card-hover",
            collapsed ? "justify-center p-2" : "gap-3 px-2 py-2",
          )}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-xs font-semibold text-white shadow-sm">
              {user.initials}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="min-w-0 flex-1 overflow-hidden"
                >
                  <p className="truncate text-sm font-medium text-text-primary">{user.name}</p>
                  <p className="truncate text-xs text-text-tertiary">{user.role}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setLogoutOpen(true)}
            className={cn(
              "flex w-full cursor-pointer items-center gap-3 rounded-xl text-sm font-medium text-accent-red transition-colors hover:bg-accent-red/5",
              collapsed ? "justify-center p-2" : "px-2 py-2",
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </nav>
  );

  const sidebarWithConfirm = (
    <>
      {sidebarContent}
      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Sign Out"
        description="Are you sure you want to sign out?"
        confirmLabel="Sign Out"
        variant="destructive"
        loading={loggingOut}
        onConfirm={handleSignOut}
      />
    </>
  );

  if (mobileOpen !== undefined) {
    return (
      <>
        <div className="hidden md:flex">{sidebarWithConfirm}</div>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onMobileClose} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full"
            >
              {sidebarWithConfirm}
            </motion.div>
          </div>
        )}
      </>
    );
  }

  return sidebarWithConfirm;
}
