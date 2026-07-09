"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
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
      <PageHeader
        title="My Courses"
        description="Manage your course catalog"
        actions={
          <Link
            href="/instructor/courses/new"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-500/90"
          >
            <Plus className="h-4 w-4" /> New Course
          </Link>
        }
      />

      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-text-secondary">Loading courses...</p>
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="space-y-4">
          {courses.map((course) => (
            <GlassCard key={course.id}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-500/10">
                  <BookOpen className="h-6 w-6 text-accent-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-text-primary">{course.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {course.category}</span>
                    <StatusBadge status={course.status} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/instructor/courses/${course.id}/edit`} className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-card-hover hover:text-text-primary">Edit</Link>
                  <Link href={`/instructor/courses/${course.id}/curriculum`} className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-card-hover hover:text-text-primary">Curriculum</Link>
                  <Link href={`/instructor/courses/${course.id}/students`} className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-card-hover hover:text-text-primary">Students</Link>
                  <Link href={`/instructor/courses/${course.id}/quiz`} className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-card-hover hover:text-text-primary">Quiz</Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-default bg-surface-card py-20">
          <BookOpen className="mb-3 h-12 w-12 text-text-tertiary" />
          <p className="text-lg font-medium text-text-primary">No courses yet</p>
          <p className="mt-1 text-sm text-text-secondary">Create your first course</p>
          <Link href="/instructor/courses/new" className="mt-4 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-500/90">
            Create Course
          </Link>
        </div>
      )}
    </div>
  );
}
