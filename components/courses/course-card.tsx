import Link from "next/link";
import type { Course } from "@/types/landing";

export function CourseCard({
  course,
}: {
  course: Course;
}) {
  return (
    <Link href={`/courses/${course.slug}`} className="group block">
      <div className="rounded-lg border border-border-subtle bg-surface-card p-5 transition-colors hover:border-white/20">
        <span className="mb-2 inline-block rounded-full border border-brand-orange/30 px-2.5 py-0.5 text-[11px] font-medium text-brand-orange">
          {course.category}
        </span>
        <h3 className="text-sm font-semibold text-white">{course.title}</h3>
        <p className="mt-2 text-lg font-bold text-brand-orange">
          {course.currency === "XAF" ? `${course.price.toLocaleString()} FCFA` : `$${course.price}`}
        </p>
      </div>
    </Link>
  );
}
