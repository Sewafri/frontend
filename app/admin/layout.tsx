"use client";

import { useState } from "react";
import { SidebarNav, type SidebarLink } from "@/components/navigation/sidebar-nav";
import { DashboardHeader } from "@/components/layouts/header";
import { LayoutDashboard, Users, ClipboardCheck, BookOpen, Award, DollarSign, BarChart3, Settings } from "lucide-react";

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
  const [mobileSidebar, setMobileSidebar] = useState(false);

  return (
    <div className="flex h-screen bg-surface-dark">
      <SidebarNav
        links={ADMIN_LINKS}
        user={{ initials: "AD", name: "Admin User", role: "Admin" }}
        accentClass="admin"
        mobileOpen={mobileSidebar}
        onMobileClose={() => setMobileSidebar(false)}
      />
      <div className="ml-0 flex flex-1 flex-col md:ml-56">
        <DashboardHeader
          breadcrumb="Admin"
          currentPage="Overview"
          accentClass="admin"
          initials="AD"
          onMenuToggle={() => setMobileSidebar(true)}
        />
        <main className="flex-1 overflow-y-auto bg-surface-dark p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
