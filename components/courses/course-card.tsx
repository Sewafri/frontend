import Link from "next/link";
import Image from "next/image";
import { Star, Users, Clock } from "lucide-react";
import type { Course } from "@/types/landing";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-surface-card shadow-sm ring-1 ring-border-subtle transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative flex h-40 items-center justify-center bg-surface-sunken">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute right-3 top-3 rounded-full bg-brand-500/90 px-2.5 py-0.5 text-[11px] font-semibold text-text-primary dark:text-white backdrop-blur-sm">
            {course.category}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          <h3 className="text-sm font-semibold leading-snug text-text-primary group-hover:text-brand-500 transition-colors">
            {course.title}
          </h3>

          <p className="line-clamp-2 text-xs leading-relaxed text-text-secondary">
            {course.description}
          </p>

          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent-amber text-accent-amber" />
              {course.rating}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {course.studentsCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {course.duration}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-border-subtle pt-3">
            <span className="text-xs text-text-tertiary">
              {course.instructor.name}
            </span>
            <span className="text-base font-bold text-brand-500">
              {course.currency === "XAF"
                ? `${course.price.toLocaleString()} FCFA`
                : `$${course.price}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
