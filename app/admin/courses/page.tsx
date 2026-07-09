"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { getAdminCourses } from "@/lib/data/admin";
import type { Course } from "@/types/db";
import { BookOpen, Users } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-accent-amber/10 text-accent-amber",
  PUBLISHED: "bg-accent-green/10 text-accent-green",
  UNPUBLISHED: "bg-accent-red/10 text-accent-red",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCourses()
      .then((res) => {
        setCourses(res.courses);
        setTotal(res.total);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Courses"
        description={`${total} total courses`}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Courses", value: String(total), icon: BookOpen },
          { label: "Published", value: String(courses.filter((c) => c.status === "PUBLISHED").length), icon: BookOpen },
          { label: "Instructors", value: String(new Set(courses.map((c) => c.instructorId)).size), icon: Users },
        ].map((card) => (
          <div key={card.label} className="flex items-center gap-4 rounded-xl bg-surface-card p-5 ring-1 ring-border-default">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-500/10 text-accent-500">
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
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-text-secondary">Loading courses...</p>
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-text-tertiary">No courses found.</p>
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border-default bg-surface-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default text-xs text-text-tertiary">
                <th className="px-5 pb-3 pt-4 font-medium">Course</th>
                <th className="px-5 pb-3 pt-4 font-medium">Instructor</th>
                <th className="px-5 pb-3 pt-4 font-medium">Category</th>
                <th className="px-5 pb-3 pt-4 font-medium">Status</th>
                <th className="px-5 pb-3 pt-4 font-medium">Enrollments</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border-default transition-colors hover:bg-surface-card-hover last:border-0"
                >
                  <td className="px-5 py-3.5 font-medium text-text-primary">{c.title}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{c.instructor?.fullName ?? c.instructorId}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{c.category}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[c.status] || STATUS_COLORS.DRAFT}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-text-secondary">
                    {(c as unknown as { _count?: { enrollments: number } })._count?.enrollments ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
