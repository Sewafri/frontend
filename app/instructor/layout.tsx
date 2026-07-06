"use client";

import { SidebarNav, type SidebarLink } from "@/components/navigation/sidebar-nav";
import { DashboardHeader } from "@/components/layouts/header";
import { LayoutDashboard, BookOpen, MessagesSquare, Settings } from "lucide-react";

const INSTRUCTOR_LINKS: SidebarLink[] = [
  { label: "Dashboard", href: "/instructor", icon: LayoutDashboard },
  { label: "My Courses", href: "/instructor/courses", icon: BookOpen },
  { label: "Messages", href: "/instructor/messages", icon: MessagesSquare },
  { label: "Settings", href: "/instructor/settings", icon: Settings },
];

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-surface-dark">
      <SidebarNav
        links={INSTRUCTOR_LINKS}
        user={{ initials: "SW", name: "Dr. Sarah Wilson", role: "Instructor" }}
        accentClass="border-green-500 bg-green-500/5 text-green-400"
      />
      <div className="ml-12 flex flex-1 flex-col">
        <DashboardHeader
          breadcrumb="Instructor"
          currentPage="Dashboard"
          accentClass="bg-green-500/20 text-green-400"
          initials="SW"
        />
        <main className="flex-1 overflow-y-auto bg-surface-dark p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
