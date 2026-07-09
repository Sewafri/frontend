"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Check, Lock, Play, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import ProgressBar from "@/components/ui/progress-bar";
import { getCourseById } from "@/lib/data/courses";
import { getLessons, completeLesson } from "@/lib/data/lessons";
import { CONTINUE_COURSES } from "@/constants/dashboard";
import type { Course } from "@/types/db";
import type { Lesson } from "@/types/db";
import { ApiError } from "@/lib/api/client";

export default function CurriculumPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCourseById(courseId).catch(() => null),
      getLessons(courseId).catch(() => [] as Lesson[]),
    ])
      .then(([c, l]) => {
        setCourse(c);
        setLessons(l);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  // MOCK: backend GET /enrollments is a stub — tracking completed lessons in memory only
  // see MIGRATION.md
  async function handleComplete(lessonId: string) {
    setCompletingId(lessonId);
    try {
      await completeLesson(lessonId);
      setCompletedIds((prev) => new Set(prev).add(lessonId));
    } catch (err) {
      if (err instanceof ApiError) {
        console.error("Failed to complete lesson:", err.message);
      }
    } finally {
      setCompletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-text-secondary">Loading...</p>
      </div>
    );
  }

  // Fallback to mock data if API fails
  const displayCourse = course ?? CONTINUE_COURSES.find((c) => c.id === courseId);
  const displayLessons = lessons.length > 0
    ? lessons.map((l) => ({
        id: l.id,
        title: l.title,
        completed: completedIds.has(l.id),
        type: l.contentType === "VIDEO" ? "video" as const : l.contentType === "TEXT" ? "article" as const : "exercise" as const,
      }))
    : // MOCK: lessons list for non-enrolled courses only shows preview
      // see MIGRATION.md
      [
        { id: "m1", title: "Lesson 1", completed: false, type: "video" as const },
        { id: "m2", title: "Lesson 2", completed: false, type: "video" as const },
        { id: "m3", title: "Lesson 3", completed: false, type: "exercise" as const },
      ];

  const completedCount = displayLessons.filter((l) => l.completed).length;
  const progress = displayLessons.length > 0
    ? Math.round((completedCount / displayLessons.length) * 100)
    : 0;

  if (!displayCourse) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BookOpen className="mb-3 h-12 w-12 text-text-secondary" />
        <h2 className="text-xl font-semibold text-text-primary">Course not found</h2>
        <p className="mt-1 text-sm text-text-secondary">This course may have been removed.</p>
        <Link href="/my-learning" className="mt-4 text-sm text-accent-500 hover:underline">Back to My Learning</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/my-learning" className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> My Learning
        </Link>
      </div>

      <PageHeader
        title={displayCourse.title}
        description="Course curriculum and progress"
      />

      {/* Progress overview */}
      <GlassCard className="mb-8">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/10">
            <BookOpen className="h-7 w-7 text-accent-500" />
          </div>
          <div className="flex-1">
            <ProgressBar value={progress} label="Course Progress" className="max-w-md" />
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-text-primary">{completedCount}</span>
            <span className="text-xs text-text-secondary"> / {displayLessons.length} lessons</span>
          </div>
        </div>
      </GlassCard>

      {/* Lesson list */}
      <div className="space-y-2">
        {displayLessons.map((lesson, i) => (
          <Link
            key={lesson.id}
            href={`/my-learning/${courseId}/lessons/${lesson.id}`}
            className={`flex items-center gap-4 rounded-xl border px-5 py-4 transition-colors ${
              lesson.completed
                ? "border-accent-green/20 bg-accent-green/5"
                : i === completedCount
                  ? "border-accent-500/30 bg-accent-500/5"
                  : "border-border-glass bg-surface-dark"
            }`}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              lesson.completed
                ? "bg-accent-green/10"
                : i === completedCount
                  ? "bg-accent-500/10"
                  : "bg-surface-card"
            }`}>
              {lesson.completed ? (
                <Check className="h-4 w-4 text-accent-green" />
              ) : i === completedCount ? (
                <Play className="h-4 w-4 text-accent-500" />
              ) : (
                <Lock className="h-4 w-4 text-text-secondary" />
              )}
            </div>

            <div className="flex-1">
              <span className={`text-sm font-medium ${
                lesson.completed ? "text-accent-green" : "text-text-primary"
              }`}>
                {lesson.title}
              </span>
            </div>

            <span className="rounded-full bg-surface-card px-2.5 py-0.5 text-[10px] font-medium uppercase text-text-secondary">
              {lesson.type}
            </span>

            {i === completedCount && !lesson.completed && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleComplete(lesson.id);
                }}
                disabled={completingId === lesson.id}
                className="cursor-pointer rounded-lg bg-accent-500 px-4 py-1.5 text-xs font-medium text-text-on-accent transition-colors hover:bg-accent-500/90 disabled:opacity-50"
              >
                {completingId === lesson.id ? "..." : "Complete"}
              </button>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
