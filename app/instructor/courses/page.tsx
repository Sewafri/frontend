"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import StatusBadge from "@/components/ui/status-badge";
import { BookOpen, Plus, Users, Star } from "lucide-react";
import Link from "next/link";
import { getMyCourses } from "@/lib/data/courses";
import { ALL_COURSES } from "@/constants/dashboard";
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

  // MOCK: fall back to hardcoded data if API fails
  const displayCourses = courses.length > 0 ? courses : ALL_COURSES;

  return (
    <div>
      <PageHeader
        title="My Courses"
        description="Manage your course catalog"
        actions={
          <Link
            href="/instructor/courses/new"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition-all hover:bg-brand-600 active:scale-[0.97]"
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

      {!loading && displayCourses.length > 0 && (
        <div className="space-y-4">
          {displayCourses.map((course) => {
            const title = "title" in course ? (course as Course).title : (course as typeof ALL_COURSES[0]).title;
            const students = "students" in course ? (course as unknown as Record<string, unknown>).students : undefined;
            const rating = "rating" in course ? (course as unknown as Record<string, unknown>).rating : undefined;
            const status = "status" in course ? (course as Course).status : (course as typeof ALL_COURSES[0]).status;
            const id = "id" in course ? course.id : "";

            return (
              <GlassCard key={id}>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-500/10">
                    <BookOpen className="h-6 w-6 text-brand-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-text-primary">{title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
                      {students !== undefined && (
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {String(students)} students</span>
                      )}
                      {rating !== undefined && (
                        <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent-amber text-accent-amber" /> {String(rating)}/5</span>
                      )}
                      <StatusBadge status={status as string} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/instructor/courses/${id}/edit`} className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-card-hover hover:text-text-primary">Edit</Link>
                    <Link href={`/instructor/courses/${id}/curriculum`} className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-card-hover hover:text-text-primary">Curriculum</Link>
                    <Link href={`/instructor/courses/${id}/students`} className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-card-hover hover:text-text-primary">Students</Link>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {!loading && displayCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-default bg-surface-card py-20">
          <BookOpen className="mb-3 h-12 w-12 text-text-tertiary" />
          <p className="text-lg font-medium text-text-primary">No courses yet</p>
          <p className="mt-1 text-sm text-text-secondary">Create your first course</p>
          <Link href="/instructor/courses/new" className="mt-4 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition-all hover:bg-brand-600">
            Create Course
          </Link>
        </div>
      )}
    </div>
  );
}
