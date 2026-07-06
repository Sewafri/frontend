import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import StatusBadge from "@/components/ui/status-badge";
import { ALL_COURSES } from "@/constants/dashboard";
import { BookOpen, Plus, Users, Eye } from "lucide-react";
import Link from "next/link";

export default function InstructorCoursesPage() {
  return (
    <div className="">
      <PageHeader
        title="My Courses"
        description="Manage your course catalog"
        actions={
          <Link
            href="/instructor/courses/new"
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90"
          >
            <Plus className="h-4 w-4" /> New Course
          </Link>
        }
      />

      {ALL_COURSES.length > 0 ? (
        <div className="space-y-4">
          {ALL_COURSES.map((course) => (
            <GlassCard key={course.id}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-orange/10">
                  <BookOpen className="h-6 w-6 text-brand-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{course.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {course.students} students</span>
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {course.rating}/5 rating</span>
                    <StatusBadge status={course.status} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/instructor/courses/${course.id}/edit`} className="rounded-lg border border-border-glass px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-white">Edit</Link>
                  <Link href={`/instructor/courses/${course.id}/curriculum`} className="rounded-lg border border-border-glass px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-white">Curriculum</Link>
                  <Link href={`/instructor/courses/${course.id}/students`} className="rounded-lg border border-border-glass px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-white">Students</Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-glass bg-surface-dark py-20">
          <BookOpen className="mb-3 h-12 w-12 text-text-secondary" />
          <p className="text-lg font-medium text-white">No courses yet</p>
          <p className="mt-1 text-sm text-text-secondary">Create your first course</p>
          <Link href="/instructor/courses/new" className="mt-4 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90">
            Create Course
          </Link>
        </div>
      )}
    </div>
  );
}
