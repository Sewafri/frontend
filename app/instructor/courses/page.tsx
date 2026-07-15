"use client";

import { useEffect, useState } from "react";
import StatusBadge from "@/components/ui/status-badge";
import { BookOpen, Plus, Users } from "lucide-react";
import Link from "next/link";
import { getMyCourses } from "@/lib/data/instructor";
import type { Course } from "@/types/db";

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyCourses()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-7 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">My Courses</h1>
          <p className="mt-1 text-sm text-brand-text-mid">Manage your course catalog</p>
        </div>
        <Link
          href="/instructor/courses/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-green-dark"
        >
          <Plus className="h-4 w-4" /> New Course
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-brand-text-mid">Loading courses...</p>
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="rounded-xl border border-brand-border bg-brand-card p-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-green-light">
                  <BookOpen className="h-6 w-6 text-brand-green" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-brand-text">{course.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-brand-text-light">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {course.category}</span>
                    <StatusBadge status={course.status} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/instructor/courses/${course.id}/edit`} className="rounded-lg border border-brand-border px-3 py-1.5 text-xs font-medium text-brand-text-mid transition-colors hover:bg-brand-bg hover:text-brand-text">Edit</Link>
                  <Link href={`/instructor/courses/${course.id}/curriculum`} className="rounded-lg border border-brand-border px-3 py-1.5 text-xs font-medium text-brand-text-mid transition-colors hover:bg-brand-bg hover:text-brand-text">Curriculum</Link>
                  <Link href={`/instructor/courses/${course.id}/students`} className="rounded-lg border border-brand-border px-3 py-1.5 text-xs font-medium text-brand-text-mid transition-colors hover:bg-brand-bg hover:text-brand-text">Students</Link>
                  <Link href={`/instructor/courses/${course.id}/quiz`} className="rounded-lg border border-brand-border px-3 py-1.5 text-xs font-medium text-brand-text-mid transition-colors hover:bg-brand-bg hover:text-brand-text">Quiz</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-brand-border bg-brand-card py-20">
          <BookOpen className="mb-3 h-12 w-12 text-brand-text-light" />
          <p className="text-lg font-medium text-brand-text">No courses yet</p>
          <p className="mt-1 text-sm text-brand-text-mid">Create your first course</p>
          <Link href="/instructor/courses/new" className="mt-4 rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-green-dark">
            Create Course
          </Link>
        </div>
      )}
    </div>
  );
}
