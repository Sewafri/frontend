"use client";

import { useRouter } from "next/navigation";
import { Menu, LogOut, User, Bell, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/auth-context";

interface DashboardHeaderProps {
  breadcrumb: string;
  currentPage: string;
  accentClass?: string;
  initials: string;
  userName?: string;
  userRole?: string;
  onMenuToggle?: () => void;
}

export function DashboardHeader({
  breadcrumb,
  currentPage,
  initials,
  userName,
  userRole,
  onMenuToggle,
}: DashboardHeaderProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await logout();
    router.push("/sign-in");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border-default bg-surface-card/80 backdrop-blur-xl px-4 md:px-6">
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
        <span className="text-border-strong">/</span>
        <span className="font-medium text-text-primary">{currentPage}</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-all hover:bg-surface-card-hover hover:text-text-primary">
          <Search size={16} />
        </button>
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-all hover:bg-surface-card-hover hover:text-text-primary">
          <Bell size={16} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent-500 ring-2 ring-surface-card" />
        </button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-xs font-bold text-white shadow-sm ring-2 ring-transparent transition-all hover:ring-accent-500/30">
            {initials}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl border-border-default p-1.5">
            {userName && (
              <DropdownMenuLabel className="px-2 py-1.5">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text-primary">{userName}</span>
                  {userRole && <span className="text-xs text-text-tertiary">{userRole}</span>}
                </div>
              </DropdownMenuLabel>
            )}
            <DropdownMenuSeparator className="my-1 bg-border-subtle" />
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="cursor-pointer rounded-lg py-2 text-sm text-text-secondary"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-border-subtle" />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer rounded-lg py-2 text-sm text-accent-red focus:text-accent-red">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
