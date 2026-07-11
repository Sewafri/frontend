"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/glass-card";
import ProgressBar from "@/components/ui/progress-bar";
import { StatCard } from "@/components/ui/stat-card";
import { PageHeader } from "@/components/ui/page-header";
import { getMyEnrollments } from "@/lib/data/enrollments";
import { BookOpen, Calendar, TrendingUp, Layers } from "lucide-react";
import Link from "next/link";
import Companion from "@/components/companion/companion";
import type { Enrollment } from "@/types/db";

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

  const activeEnrollments = enrollments.filter((e) => e.status === "ACTIVE");
  const completedEnrollments = enrollments.filter(
    (e) => e.status === "COMPLETED",
  );
  const totalProgress = enrollments.reduce(
    (sum, e) => sum + (e.progressPercent ?? 0),
    0,
  );
  const avgProgress =
    enrollments.length > 0
      ? Math.round(totalProgress / enrollments.length)
      : 0;

  const stats = [
    {
      label: "Active Courses",
      value: String(activeEnrollments.length),
      icon: BookOpen,
      iconBg: "bg-gray-100 dark:bg-gray-800",
      iconColor: "text-gray-900 dark:text-gray-100",
      trend: enrollments.length > 0 ? "Active" : undefined,
      trendUp: true,
    },
    {
      label: "Completed",
      value: String(completedEnrollments.length),
      icon: Calendar,
      iconBg: "bg-gray-100 dark:bg-gray-800",
      iconColor: "text-gray-900 dark:text-gray-100",
      trend: completedEnrollments.length > 0 ? `${completedEnrollments.length} course${completedEnrollments.length > 1 ? "s" : ""}` : undefined,
      trendUp: completedEnrollments.length > 0,
    },
    {
      label: "Overall Progress",
      value: `${avgProgress}%`,
      icon: TrendingUp,
      iconBg: "bg-gray-100 dark:bg-gray-800",
      iconColor: "text-gray-900 dark:text-gray-100",
      trend: activeEnrollments.length > 0 && avgProgress >= 100 && completedEnrollments.length === 0
        ? "All active"
        : avgProgress > 50 ? "On track" : undefined,
      trendUp: avgProgress > 50,
    },
    {
      label: "Total Enrolled",
      value: String(enrollments.length),
      icon: Layers,
      iconBg: "bg-gray-100 dark:bg-gray-800",
      iconColor: "text-gray-900 dark:text-gray-100",
      trend: enrollments.length > 0 ? "Total" : undefined,
      trendUp: true,
    },
  ];

  const enrolledCourses = enrollments.map((e) => ({
    id: e.courseId,
    title: e.course?.title ?? "Unknown Course",
    category: e.course?.category ?? "",
    progress: e.progressPercent ?? 0,
  }));

  return (
    <div>
      <PageHeader
        title="My Learning"
        description="Track your progress and continue learning"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Continue Learning</h2>
        {loading ? (
          <p className="text-sm text-text-secondary">Loading enrollments...</p>
        ) : enrolledCourses.length === 0 ? (
          <GlassCard>
            <div className="flex flex-col items-center py-6">
              <Companion
                message="Ready to start? Pick a course that excites you."
                variant="thinking"
                size="lg"
                bubblePosition="top"
                animate
                className="mb-4"
              />
              <Link
                href="/courses"
                className="mt-2 rounded-lg bg-accent-500 px-5 py-2 text-sm font-medium text-text-on-accent transition-colors hover:bg-accent-500/90"
              >
                Browse Courses
              </Link>
            </div>
          </GlassCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {enrolledCourses.map((course) => (
              <Link key={course.id} href={`/my-learning/${course.id}`} className="group block">
                <GlassCard>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-500/10">
                      <BookOpen className="h-6 w-6 text-accent-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-text-primary transition-colors group-hover:text-accent-500">
                        {course.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-text-tertiary">{course.category}</p>
                      <ProgressBar value={course.progress} size="sm" className="mt-3" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
