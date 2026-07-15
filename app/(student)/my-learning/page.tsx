"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  TrendingUp,
  Layers,
  ArrowRight,
  Award,
  Star,
  Clock,
  Flame,
  ChevronRight,
} from "lucide-react";
import { getMyEnrollments } from "@/lib/data/enrollments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StreakHeatmap } from "@/components/learning/streak-heatmap";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";
import Companion from "@/components/companion/companion";
import type { Enrollment } from "@/types/db";

/* ── Stat card with animated counter ── */

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bgLight,
  suffix = "",
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgLight: string;
  suffix?: string;
}) {
  const animated = useAnimatedCounter(value, suffix);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-brand-border bg-brand-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-brand-text-mid uppercase">
            {label}
          </p>
          <p
            className="mt-1.5 text-2xl font-bold tracking-tight text-brand-text"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {animated}
          </p>
        </div>
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${bgLight}`}>
          <Icon className={`size-5 ${color}`} />
        </div>
      </div>
      {/* Accent bar */}
      <div className={`absolute right-0 bottom-0 left-0 h-0.5 ${color.replace("text-", "bg-")} scale-x-0 transition-transform duration-300 group-hover:scale-x-100`} />
    </div>
  );
}

/* ── Empty state ── */

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-12">
      <Companion
        message="Ready to start? Pick a course that excites you."
        variant="thinking"
        size="lg"
        bubblePosition="top"
        animate
        className="mb-6"
      />
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-green-dark"
      >
        Browse Courses
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

/* ── Main Page ── */

export default function MyLearningPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyEnrollments()
      .then((data) => {
        if (data && data.length > 0) setEnrollments(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ── Derived data ── */
  const activeEnrollments = useMemo(
    () => enrollments.filter((e) => e.status === "ACTIVE"),
    [enrollments],
  );
  const completedEnrollments = useMemo(
    () => enrollments.filter((e) => e.status === "COMPLETED"),
    [enrollments],
  );

  const totalProgress = useMemo(
    () => enrollments.reduce((sum, e) => sum + (e.progressPercent ?? 0), 0),
    [enrollments],
  );
  const avgProgress = enrollments.length > 0
    ? Math.round(totalProgress / enrollments.length)
    : 0;

  const enrolledCourses = useMemo(
    () =>
      enrollments.map((e) => ({
        id: e.courseId,
        title: e.course?.title ?? "Unknown Course",
        category: e.course?.category ?? "",
        coverImageUrl: e.course?.coverImageUrl ?? null,
        instructor: e.course?.instructor ?? null,
        progress: e.progressPercent ?? 0,
        status: e.status,
      })),
    [enrollments],
  );

  const activeCourseList = enrolledCourses.filter((c) => c.status === "ACTIVE");
  const completedCourseList = enrolledCourses.filter((c) => c.status === "COMPLETED");

  /* Active dates for streak heatmap (from enrollment dates) */
  const activeDateStrings = useMemo(
    () =>
      enrollments
        .map((e) => {
          const d = e.enrolledAt?.slice(0, 10);
          return d || null;
        })
        .filter(Boolean) as string[],
    [enrollments],
  );

  /* ── Stats ── */
  const stats = [
    {
      label: "Active Courses",
      value: activeEnrollments.length,
      icon: BookOpen,
      color: "text-brand-green",
      bgLight: "bg-brand-green-light",
    },
    {
      label: "Completed",
      value: completedEnrollments.length,
      icon: Calendar,
      color: "text-brand-amber",
      bgLight: "bg-brand-amber-light",
    },
    {
      label: "Avg. Progress",
      value: avgProgress,
      icon: TrendingUp,
      color: "text-brand-green",
      bgLight: "bg-brand-green-light",
      suffix: "%",
    },
    {
      label: "Total Enrolled",
      value: enrollments.length,
      icon: Layers,
      color: "text-brand-amber",
      bgLight: "bg-brand-amber-light",
    },
  ];

  if (loading) {
    return <MyLearningSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="animate-fade-up">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">
              My Learning
            </h1>
            <p className="mt-1 text-sm text-brand-text-mid">
              Track your progress and continue learning
            </p>
          </div>
          {/* Streak badge */}
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-brand-border bg-brand-card px-4 py-2 text-sm">
            <Flame className="size-4 text-brand-amber" />
            <span className="font-semibold text-brand-text">
              {activeEnrollments.length + completedEnrollments.length > 0
                ? `${activeEnrollments.length} active`
                : "Start learning"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Streak Heatmap ── */}
      <div className="animate-fade-up" style={{ animationDelay: "0.05s" }}>
        <StreakHeatmap activeDates={activeDateStrings} />
      </div>

      {/* ── Stats Grid ── */}
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        style={{ animationDelay: "0.1s" }}
      >
        {stats.map((stat, i) => (
          <div key={stat.label} className="animate-fade-up" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* ── Continue Learning ── */}
      <section className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-text">Continue Learning</h2>
          {activeCourseList.length > 0 && (
            <span className="text-xs text-brand-text-light">
              {activeCourseList.length} course{activeCourseList.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="rounded-xl border border-brand-border bg-brand-card">
            <EmptyState />
          </div>
        ) : activeCourseList.length === 0 && completedCourseList.length > 0 ? (
          <div className="rounded-xl border border-brand-border bg-brand-card p-8 text-center">
            <Award className="mx-auto mb-3 size-10 text-brand-amber" />
            <p className="font-semibold text-brand-text">All courses completed!</p>
            <p className="mt-1 text-sm text-brand-text-mid">
              You&apos;ve finished everything. Great work!
            </p>
            <Link
              href="/courses"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-brand-green-dark"
            >
              Find new courses <ChevronRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activeCourseList.map((course, i) => (
              <CourseRow
                key={course.id}
                {...course}
                style={{ animationDelay: `${0.25 + i * 0.05}s` }}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Completed Courses ── */}
      {completedCourseList.length > 0 && (
        <section className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-text">Completed</h2>
            <Link
              href="/courses"
              className="text-xs font-medium text-brand-green hover:text-brand-green-dark"
            >
              Browse more courses &rarr;
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completedCourseList.slice(0, 6).map((course, i) => (
              <CompletedCard
                key={course.id}
                {...course}
                style={{ animationDelay: `${0.35 + i * 0.05}s` }}
              />
            ))}
          </div>

          {completedCourseList.length > 6 && (
            <p className="mt-3 text-center text-xs text-brand-text-light">
              +{completedCourseList.length - 6} more completed course
              {completedCourseList.length - 6 !== 1 ? "s" : ""}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

/* ── Course Row (Continue Learning) ── */

function CourseRow({
  id,
  title,
  category,
  coverImageUrl,
  instructor,
  progress,
  style,
}: {
  id: string;
  title: string;
  category: string;
  coverImageUrl: string | null;
  instructor: { id: string; fullName: string } | null;
  progress: number;
  style?: React.CSSProperties;
}) {
  return (
    <Link
      href={`/my-learning/${id}`}
      className="group block animate-fade-up rounded-xl border border-brand-border bg-brand-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={style}
    >
      <div className="flex items-center gap-4 p-4 sm:gap-6">
        {/* Cover image */}
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg sm:size-16">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-brand-green-light">
              <BookOpen className="size-6 text-brand-green" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-brand-text transition-colors group-hover:text-brand-green">
              {title}
            </h3>
            {category && (
              <Badge variant="secondary" className="hidden shrink-0 sm:inline-flex">
                {category}
              </Badge>
            )}
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs text-brand-text-mid">
            {instructor && (
              <span className="truncate">{instructor.fullName}</span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {progress}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-brand-green-light/60">
            <div
              className="h-full rounded-full bg-brand-green transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Category badge (mobile) */}
        {category && (
          <Badge variant="secondary" className="sm:hidden">
            {category}
          </Badge>
        )}

        {/* CTA */}
        <div className="hidden shrink-0 sm:block">
          <Button
            size="sm"
            className="pointer-events-none gap-1.5 bg-brand-green text-white hover:bg-brand-green-dark"
          >
            Continue
            <ArrowRight className="size-3.5" />
          </Button>
        </div>

        <ChevronRight className="size-4 shrink-0 text-brand-text-light sm:hidden" />
      </div>
    </Link>
  );
}

/* ── Completed Course Card ── */

function CompletedCard({
  id,
  title,
  category,
  coverImageUrl,
  style,
}: {
  id: string;
  title: string;
  category: string;
  coverImageUrl: string | null;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="animate-fade-up rounded-xl border border-brand-border bg-brand-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={style}
    >
      <div className="flex items-start gap-3">
        {/* Cover */}
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-brand-amber-light">
              <Award className="size-5 text-brand-amber" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-brand-text">{title}</h3>
          {category && (
            <p className="mt-0.5 text-xs text-brand-text-light">{category}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <Link
          href={`/my-learning/${id}`}
          className="flex-1 rounded-lg border border-brand-border bg-brand-card px-3 py-1.5 text-center text-xs font-medium text-brand-text-mid transition-colors hover:bg-brand-green-light hover:text-brand-green"
        >
          <span className="flex items-center justify-center gap-1.5">
            <Award className="size-3.5" />
            Certificate
          </span>
        </Link>
        <Link
          href={`/my-learning/${id}`}
          className="flex-1 rounded-lg border border-brand-border bg-brand-card px-3 py-1.5 text-center text-xs font-medium text-brand-text-mid transition-colors hover:bg-brand-amber-light hover:text-brand-amber"
        >
          <span className="flex items-center justify-center gap-1.5">
            <Star className="size-3.5" />
            Review
          </span>
        </Link>
      </div>
    </div>
  );
}

/* ── Skeleton Loading State ── */

function MyLearningSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-brand-green-light/60" />
        <div className="mt-2 h-4 w-64 rounded bg-brand-green-light/40" />
      </div>

      {/* Heatmap skeleton */}
      <div className="animate-pulse rounded-xl border border-brand-border bg-brand-card p-5">
        <div className="mb-4 h-4 w-32 rounded bg-brand-green-light/40" />
        <div className="flex gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              {Array.from({ length: 7 }).map((_, j) => (
                <div
                  key={j}
                  className="size-3 rounded-sm bg-brand-green-light/30"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-brand-border bg-brand-card p-5"
          >
            <div className="h-3 w-20 rounded bg-brand-green-light/40" />
            <div className="mt-3 h-7 w-12 rounded bg-brand-green-light/30" />
          </div>
        ))}
      </div>

      {/* Course list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex items-center gap-4 rounded-xl border border-brand-border bg-brand-card p-4"
          >
            <div className="size-14 shrink-0 rounded-lg bg-brand-green-light/40 sm:size-16" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/5 rounded bg-brand-green-light/40" />
              <div className="h-3 w-1/3 rounded bg-brand-green-light/30" />
              <div className="h-2 w-full rounded-full bg-brand-green-light/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
