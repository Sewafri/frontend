"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarNav, type SidebarLink } from "@/components/navigation/sidebar-nav";
import { DashboardHeader } from "@/components/layouts/header";
import { BookOpen, GraduationCap, Award, Wallet, MessagesSquare, Settings, Heart, Crown, CreditCard } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { getInitials, capitalizeRole } from "@/lib/utils/user";

const STUDENT_LINKS: SidebarLink[] = [
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "My Learning", href: "/my-learning", icon: GraduationCap },
  { label: "Certificates", href: "/certificates", icon: Award },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Subscription", href: "/subscription", icon: Crown },
  { label: "Messages", href: "/messages", icon: MessagesSquare },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
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
        links={STUDENT_LINKS}
        user={{
          initials: getInitials(user.fullName),
          name: user.fullName,
          role: capitalizeRole(user.role),
        }}
        mobileOpen={mobileSidebar}
        onMobileClose={() => setMobileSidebar(false)}
      />
      <div className="ml-0 flex flex-1 flex-col">
        <DashboardHeader
          breadcrumb="Student"
          currentPage="Learning"
          initials={getInitials(user.fullName)}
          userName={user.fullName}
          userRole={capitalizeRole(user.role)}
          onMenuToggle={() => setMobileSidebar(true)}
        />
        <main className="flex-1 overflow-y-auto bg-surface-dark p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
