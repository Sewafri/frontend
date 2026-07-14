"use client";

import { useEffect, useState } from "react";
import { getAdminCourses } from "@/lib/data/admin";
import type { Course } from "@/types/db";
import { BookOpen, Users } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-brand-amber/10 text-brand-amber",
  PUBLISHED: "bg-brand-green/10 text-brand-green",
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
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Courses</h1>
        <p className="mt-1 text-sm text-brand-text-mid">{total} total courses</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Courses", value: String(total), icon: BookOpen },
          { label: "Published", value: String(courses.filter((c) => c.status === "PUBLISHED").length), icon: BookOpen },
          { label: "Instructors", value: String(new Set(courses.map((c) => c.instructorId)).size), icon: Users },
        ].map((card) => (
          <div key={card.label} className="flex items-center gap-4 rounded-xl bg-brand-card p-5 ring-1 ring-brand-border">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text">{card.value}</p>
              <p className="text-xs text-brand-text-light">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-brand-text-mid">Loading courses...</p>
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-brand-text-light">No courses found.</p>
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-brand-border bg-brand-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-border text-xs text-brand-text-light">
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
                  className="border-b border-brand-border transition-colors hover:bg-brand-bg last:border-0"
                >
                  <td className="px-5 py-3.5 font-medium text-brand-text">{c.title}</td>
                  <td className="px-5 py-3.5 text-brand-text-mid">{c.instructor?.fullName ?? c.instructorId}</td>
                  <td className="px-5 py-3.5 text-brand-text-mid">{c.category}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[c.status] || STATUS_COLORS.DRAFT}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-brand-text-mid">
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
