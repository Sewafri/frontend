import { FEATURED_COURSES } from "@/constants/landing";
import { CourseCard } from "@/components/courses/course-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CoursesSection() {
  return (
    <section className="py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">
            Featured courses
          </h2>
          <p className="mt-2 text-base text-text-secondary">
            Most popular courses picked by our community
          </p>
        </div>
        <Link
          href="/courses"
          className="hidden items-center gap-1.5 text-sm font-semibold text-brand-500 transition-colors hover:text-brand-600 sm:flex"
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
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 transition-colors hover:text-brand-600"
        >
          View all courses
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
