"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, User, ChevronDown, Play } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { getCourseById, enrollInCourse } from "@/lib/data/courses";
import { getLessons } from "@/lib/data/lessons";
import { useAuth } from "@/lib/auth/auth-context";
import { ApiError } from "@/lib/api/client";
import type { Course } from "@/types/db";
import type { Lesson } from "@/types/db";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const courseId = params.slug as string;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCourseById(courseId),
      getLessons(courseId).catch(() => [] as Lesson[]),
    ])
      .then(([c, l]) => {
        setCourse(c);
        setLessons(l);
      })
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [courseId]);

  async function handleEnroll() {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }
    setEnrolling(true);
    setError(null);
    try {
      await enrollInCourse(courseId);
      router.push(`/my-learning/${courseId}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to enroll");
      }
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-text-secondary">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BookOpen className="mb-3 h-12 w-12 text-text-secondary" />
        <h2 className="text-xl font-semibold text-text-primary">Course not found</h2>
        <p className="mt-1 text-sm text-text-secondary">
          This course may have been removed or doesn&apos;t exist.
        </p>
        <Link href="/courses" className="mt-4 text-sm text-accent-500 hover:underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  const displayPrice =
    course.pricingModel === "FREE"
      ? "Free"
      : course.currency === "XAF"
        ? `${Number(course.price).toLocaleString()} FCFA`
        : `$${Number(course.price)}`;

  const instructorName = course.instructor?.fullName ?? "Instructor";

  return (
    <div>
      <PageHeader
        title={course.title}
        description={course.description}
      />

      <div className="mb-8 overflow-hidden rounded-xl border border-border-default bg-gradient-to-br from-neutral-800 to-neutral-700">
        <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center">
          <div className="flex-1">
            <span className="mb-3 inline-block rounded-full bg-accent-500/10 px-3 py-1 text-xs font-medium text-accent-500">
              {course.category}
            </span>
            <h1 className="mb-2 text-2xl font-bold text-text-primary lg:text-3xl">{course.title}</h1>
            <p className="mb-4 text-text-secondary">{course.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {instructorName}
              </span>
              {course.skillTags.length > 0 && (
                <span className="text-xs text-text-tertiary">
                  {course.skillTags.join(", ")}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 lg:items-end">
            <span className="text-3xl font-bold text-accent-500">
              {displayPrice}
            </span>
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="cursor-pointer rounded-lg bg-accent-500 px-8 py-3 font-medium text-text-on-accent transition-colors hover:bg-accent-500/90 disabled:opacity-50"
            >
              {enrolling ? "Enrolling..." : "Enroll Now"}
            </button>
            {error && (
              <p className="text-xs text-accent-red">{error}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Curriculum */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Course Curriculum</h2>
          <div className="space-y-3">
            {lessons.length > 0 ? (
              <div className="rounded-xl border border-border-default bg-surface-dark">
                {lessons.map((lesson, i) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 border-b border-border-default px-5 py-3 last:border-b-0"
                  >
                    <Play className="h-3.5 w-3.5 shrink-0 text-accent-500" />
                    <span className="text-sm text-text-secondary">{lesson.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <details className="group rounded-xl border border-border-default bg-surface-dark">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4">
                  <div>
                    <span className="text-sm font-medium text-text-primary">Course Content</span>
                    <span className="ml-3 text-xs text-text-secondary">
                      {lessons.length} lessons
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-text-secondary transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t border-border-default px-5 py-3">
                  <p className="text-sm text-text-secondary">No lessons available yet.</p>
                </div>
              </details>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="rounded-xl border border-border-default bg-surface-dark p-5">
            <h3 className="mb-3 text-sm font-semibold text-text-primary">This Course Includes</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <Play className="h-4 w-4 text-accent-500" /> {lessons.length} lessons
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-accent-500" /> {course.skillTags.length > 0 ? `${course.skillTags.length} skill areas` : "Multiple skills"}
              </li>
              <li className="flex items-center gap-2">
                <User className="h-4 w-4 text-accent-500" /> Full lifetime access
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-accent-500" /> Certificate of completion
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
