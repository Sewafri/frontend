"use client";

import { SidebarNav, type SidebarLink } from "@/components/navigation/sidebar-nav";
import { DashboardHeader } from "@/components/layouts/header";
import { BookOpen, GraduationCap, Award, Wallet, MessagesSquare, Settings } from "lucide-react";

const STUDENT_LINKS: SidebarLink[] = [
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "My Learning", href: "/my-learning", icon: GraduationCap },
  { label: "Certificates", href: "/certificates", icon: Award },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Messages", href: "/messages", icon: MessagesSquare },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-surface-dark">
      <SidebarNav
        links={STUDENT_LINKS}
        user={{ initials: "JD", name: "John Doe", role: "Student" }}
      />
      <div className="ml-12 flex flex-1 flex-col">
        <DashboardHeader
          breadcrumb="Student"
          currentPage="Learning"
          initials="JD"
        />
        <main className="flex-1 overflow-y-auto bg-surface-dark p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
