"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Star, Users, Clock, BookOpen } from "lucide-react";
import type { Course as LandingCourse } from "@/types/landing";
import type { Course as BackendCourse } from "@/types/db";

export function CourseCard({ course }: { course: LandingCourse }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      whileHover={reduced ? {} : { y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Link href={`/courses/${course.slug}`} className="group block">
        <div className="overflow-hidden rounded-xl border border-border-default bg-surface-card transition-colors hover:border-border-strong">
          <div className="relative flex h-40 items-center justify-center bg-surface-sunken">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-6 transition-transform duration-200 group-hover:scale-105"
            />
            <span className="absolute right-3 top-3 rounded-full bg-accent-500 px-2.5 py-0.5 text-xs font-semibold text-text-on-accent">
              {course.category}
            </span>
          </div>

          <div className="space-y-3 p-4">
            <h3 className="text-sm font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent-500">
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
                <Users className="h-3.5 w-3.5 text-accent-500" />
                {course.studentsCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-accent-500" />
                {course.duration}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border-default pt-3">
              <span className="text-xs text-text-tertiary">{course.instructor.name}</span>
              <span className="text-base font-bold text-accent-500">
                {course.currency === "XAF"
                  ? `${course.price.toLocaleString()} FCFA`
                  : `$${course.price}`}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  "Blockchain": "from-gray-700/30 to-gray-900/40",
  "Design": "from-gray-600/30 to-gray-900/40",
  "Data Science": "from-gray-700/30 to-gray-900/40",
  "Development": "from-gray-600/30 to-gray-900/40",
  "Business": "from-gray-700/30 to-gray-900/40",
  "Marketing": "from-gray-600/30 to-gray-900/40",
  "AI": "from-gray-700/30 to-gray-900/40",
};

export function BackendCourseCard({ course }: { course: BackendCourse }) {
  const reduced = useReducedMotion();
  const displayPrice = course.pricingModel === "FREE" ? 0 : Number(course.price)
  const instructorName = course.instructor?.fullName ?? "Instructor"
  const gradient = CATEGORY_GRADIENTS[course.category] ?? "from-gray-600/20 to-gray-900/30";

  return (
    <motion.div
      whileHover={reduced ? {} : { y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Link href={`/courses/${course.id}`} className="group block">
        <div className="overflow-hidden rounded-xl border border-border-default bg-surface-card transition-colors hover:border-border-strong hover:shadow-sm">
          <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${gradient}`}>
            {course.coverImageUrl ? (
              <Image
                src={course.coverImageUrl}
                alt={course.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-6 transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <BookOpen className="h-14 w-14 text-white/40" />
              </div>
            )}
            <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur-sm">
              {course.category}
            </span>
          </div>

          <div className="space-y-3 p-4">
            <h3 className="text-sm font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent-500">
              {course.title}
            </h3>
            <p className="line-clamp-2 text-xs leading-relaxed text-text-secondary">
              {course.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-text-tertiary">
              {course.skillTags.length > 0 && (
                <span className="truncate">{course.skillTags.slice(0, 3).join(", ")}</span>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-border-default pt-3">
              <span className="text-xs text-text-tertiary">{instructorName}</span>
              <span className="text-base font-bold text-accent-500">
                {course.pricingModel === "FREE"
                  ? "Free"
                  : course.currency === "XAF"
                    ? `${displayPrice.toLocaleString()} FCFA`
                    : `$${displayPrice}`}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
