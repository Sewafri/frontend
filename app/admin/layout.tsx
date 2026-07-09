"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarNav, type SidebarLink } from "@/components/navigation/sidebar-nav";
import { DashboardHeader } from "@/components/layouts/header";
import { LayoutDashboard, Users, ClipboardCheck, BookOpen, Award, DollarSign, BarChart3, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { getInitials, capitalizeRole } from "@/lib/utils/user";

const ADMIN_LINKS: SidebarLink[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Applications", href: "/admin/applications", icon: ClipboardCheck },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Certificates", href: "/admin/certificates", icon: Award },
  { label: "Payments", href: "/admin/payments", icon: DollarSign },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-dark">
        <div className="text-sm text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface-dark">
      <SidebarNav
        links={ADMIN_LINKS}
        user={{
          initials: getInitials(user.fullName),
          name: user.fullName,
          role: capitalizeRole(user.role),
        }}
        accentClass="admin"
        mobileOpen={mobileSidebar}
        onMobileClose={() => setMobileSidebar(false)}
      />
      <div className="ml-0 flex flex-1 flex-col md:ml-56">
        <DashboardHeader
          breadcrumb="Admin"
          currentPage="Overview"
          accentClass="admin"
          initials={getInitials(user.fullName)}
          userName={user.fullName}
          userRole={capitalizeRole(user.role)}
          onMenuToggle={() => setMobileSidebar(true)}
        />
        <main className="flex-1 overflow-y-auto bg-surface-dark p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
