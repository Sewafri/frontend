"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import StatusBadge from "@/components/ui/status-badge";
import { ALL_COURSES } from "@/constants/dashboard";
import { getAdminCourses } from "@/lib/data/admin";
import type { Course } from "@/types/db";
import { BookOpen, Users, DollarSign } from "lucide-react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCourses()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  // MOCK: fall back to hardcoded data if API fails
  const displayCourses = (courses.length > 0 ? courses : ALL_COURSES) as unknown as Record<string, unknown>[];
  const hasBackendData = courses.length > 0;

  const totalStudents = hasBackendData
    ? 0
    : (ALL_COURSES as Array<{ students: number }>).reduce((acc, c) => acc + c.students, 0);
  const totalRevenue = hasBackendData
    ? 0
    : (ALL_COURSES as Array<{ students: number; price: number }>).reduce((acc, c) => acc + c.students * c.price, 0);

  const summaryCards = [
    { label: "Total Courses", value: String(displayCourses.length), icon: BookOpen, accent: "brand" as const },
    { label: "Total Students", value: totalStudents.toLocaleString(), icon: Users, accent: "blue" as const },
    { label: "Est. Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, accent: "green" as const },
  ];

  return (
    <div>
      <PageHeader
        title="Courses"
        description="Moderate platform courses"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <div key={card.label} className="flex items-center gap-4 rounded-xl bg-surface-card p-5 shadow-sm ring-1 ring-border-default">
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${
              card.accent === "brand" ? "bg-brand-500/10 text-brand-500" :
              card.accent === "blue" ? "bg-accent-blue/10 text-accent-blue" :
              "bg-accent-green/10 text-accent-green"
            }`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{card.value}</p>
              <p className="text-xs text-text-tertiary">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-text-secondary">Loading courses...</p>
        </div>
      )}

      {!loading && (
        <GlassCard className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-default text-xs text-text-tertiary">
                  <th className="px-6 pb-3 pt-4 font-medium">Course</th>
                  <th className="px-6 pb-3 pt-4 font-medium">Category</th>
                  <th className="px-6 pb-3 pt-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {displayCourses.map((c, i: number) => (
                  <tr key={String(c.id ?? i)} className="border-b border-border-default transition-colors hover:bg-surface-card-hover last:border-0">
                    <td className="px-6 py-3.5 font-medium text-text-primary">{String(c.title ?? "")}</td>
                    <td className="px-6 py-3.5 text-text-secondary">{String(c.category ?? "")}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={String(c.status ?? "draft")} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
