"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Check, Lock, Play, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import ProgressBar from "@/components/ui/progress-bar";
import { CONTINUE_COURSES } from "@/constants/dashboard";

const LESSONS = [
  { id: "l1", title: "Welcome & Introduction", duration: "12 min", completed: true, type: "video" },
  { id: "l2", title: "Setting Up Your Environment", duration: "15 min", completed: true, type: "video" },
  { id: "l3", title: "Core Concepts Explained", duration: "20 min", completed: true, type: "video" },
  { id: "l4", title: "Practice Exercise 1", duration: "30 min", completed: false, type: "exercise" },
  { id: "l5", title: "Advanced Topics", duration: "25 min", completed: false, type: "video" },
  { id: "l6", title: "Project: Building Your First App", duration: "45 min", completed: false, type: "project" },
  { id: "l7", title: "Quiz: Module Assessment", duration: "15 min", completed: false, type: "quiz" },
];

export default function CurriculumPage() {
  const params = useParams();
  const course = CONTINUE_COURSES.find((c) => c.id === params.courseId);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BookOpen className="mb-3 h-12 w-12 text-text-secondary" />
        <h2 className="text-xl font-semibold text-text-primary">Course not found</h2>
        <p className="mt-1 text-sm text-text-secondary">This course may have been removed.</p>
        <Link href="/my-learning" className="mt-4 text-sm text-brand-orange hover:underline">Back to My Learning</Link>
      </div>
    );
  }

  const completedCount = LESSONS.filter((l) => l.completed).length;
  const progress = Math.round((completedCount / LESSONS.length) * 100);

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/my-learning" className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> My Learning
        </Link>
      </div>

      <PageHeader
        title={course.title}
        description="Course curriculum and progress"
      />

      {/* Progress overview */}
      <GlassCard className="mb-8">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/10">
            <BookOpen className="h-7 w-7 text-brand-orange" />
          </div>
          <div className="flex-1">
            <ProgressBar value={progress} label="Course Progress" className="max-w-md" />
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-text-primary">{completedCount}</span>
            <span className="text-xs text-text-secondary"> / {LESSONS.length} lessons</span>
          </div>
        </div>
      </GlassCard>

      {/* Lesson list */}
      <div className="space-y-2">
        {LESSONS.map((lesson, i) => (
          <div
            key={lesson.id}
            className={`flex items-center gap-4 rounded-xl border px-5 py-4 transition-colors ${
              lesson.completed
                ? "border-accent-green/20 bg-accent-green/5"
                : i === completedCount
                  ? "border-brand-orange/30 bg-brand-orange/5"
                  : "border-border-glass bg-surface-dark"
            }`}
          >
            {/* Icon */}
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              lesson.completed
                ? "bg-accent-green/10"
                : i === completedCount
                  ? "bg-brand-orange/10"
                  : "bg-surface-card"
            }`}>
              {lesson.completed ? (
                <Check className="h-4 w-4 text-accent-green" />
              ) : i === completedCount ? (
                <Play className="h-4 w-4 text-brand-orange" />
              ) : (
                <Lock className="h-4 w-4 text-text-secondary" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <span className={`text-sm font-medium ${
                lesson.completed ? "text-accent-green" : "text-text-primary"
              }`}>
                {lesson.title}
              </span>
              <span className="ml-2 text-xs text-text-secondary">{lesson.duration}</span>
            </div>

            {/* Type badge */}
            <span className="rounded-full bg-surface-card px-2.5 py-0.5 text-[10px] font-medium uppercase text-text-secondary">
              {lesson.type}
            </span>

            {/* CTA */}
            {i === completedCount && (
              <button className="cursor-pointer rounded-lg bg-brand-orange px-4 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-brand-orange/90">
                Continue
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
