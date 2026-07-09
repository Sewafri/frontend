import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { FEATURED_COURSES } from "@/constants/landing";
import { CourseCard } from "@/components/courses/course-card";

export default function CoursesSection() {
  return (
    <section className="py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/10 bg-accent-50/50 px-3 py-1 text-xs font-medium text-accent-500 mb-3">
            <Sparkles size={12} />
            Featured
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary text-balance">
            Featured courses
          </h2>
          <p className="mt-2 text-base text-text-secondary">
            Start with the courses our community recommends most
          </p>
        </div>
        <Link
          href="/courses"
          className="hidden items-center gap-1.5 text-sm font-semibold text-accent-500 transition-colors hover:text-accent-600 sm:flex"
        >
          View all courses
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_COURSES.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-500 transition-colors hover:text-accent-600"
        >
          View all courses
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
