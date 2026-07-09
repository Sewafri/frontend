"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { getInstructorDashboard, type InstructorDashboardData } from "@/lib/data/instructor";
import { Users, BookOpen, TrendingUp, Star, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function InstructorDashboardPage() {
  const [data, setData] = useState<InstructorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInstructorDashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const activeCourses = data?.courses.filter((c) => c.status !== "DRAFT") ?? [];
  const draftCourses = data?.courses.filter((c) => c.status === "DRAFT") ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-text-secondary">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Dashboard"
        description="Your teaching overview"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl bg-surface-card p-5 ring-1 ring-border-default">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-500/10 text-accent-500">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{data?.totalStudents ?? 0}</p>
            <p className="text-xs text-text-tertiary">Total Students</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl bg-surface-card p-5 ring-1 ring-border-default">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-500/10 text-accent-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{activeCourses.length}</p>
            <p className="text-xs text-text-tertiary">Active Courses</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl bg-surface-card p-5 ring-1 ring-border-default">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-500/10 text-accent-500">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{data?.averageRating.toFixed(1) ?? "—"}</p>
            <p className="text-xs text-text-tertiary">Avg Rating</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl bg-surface-card p-5 ring-1 ring-border-default">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-500/10 text-accent-500">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{draftCourses.length}</p>
            <p className="text-xs text-text-tertiary">Drafts</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-text-primary">Course Performance</h2>
            <GlassCard className="p-0">
              {data?.courses && data.courses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border-default text-xs text-text-tertiary">
                        <th className="px-6 pb-3 pt-4 font-medium">Course</th>
                        <th className="px-6 pb-3 pt-4 font-medium">Status</th>
                        <th className="px-6 pb-3 pt-4 font-medium">Students</th>
                        <th className="px-6 pb-3 pt-4 font-medium">Completion</th>
                        <th className="px-6 pb-3 pt-4 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.courses.map((c) => {
                        const dash = data.courseDashboards[c.id];
                        return (
                          <tr key={c.id} className="border-b border-border-default transition-colors hover:bg-surface-card-hover last:border-0">
                            <td className="px-6 py-3.5 font-medium text-text-primary">{c.title}</td>
                            <td className="px-6 py-3.5">
                              <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                c.status === "PUBLISHED" ? "bg-accent-green/10 text-accent-green"
                                : c.status === "DRAFT" ? "bg-accent-amber/10 text-accent-amber"
                                : "bg-accent-red/10 text-accent-red"
                              }`}>{c.status}</span>
                            </td>
                            <td className="px-6 py-3.5 text-text-secondary">{dash?.enrollmentCount ?? "—"}</td>
                            <td className="px-6 py-3.5 text-text-secondary">{dash ? `${dash.completionRate.toFixed(0)}%` : "—"}</td>
                            <td className="px-6 py-3.5">
                              <Link href={`/instructor/courses/${c.id}/edit`} className="inline-flex items-center gap-1 text-xs font-medium text-accent-500 hover:underline">
                                Manage <ArrowUpRight className="h-3 w-3" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-text-tertiary">No courses yet. Create your first course to see performance data.</p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-text-primary">Quick Actions</h2>
            <GlassCard>
              <div className="space-y-3">
                {draftCourses.length > 0 && (
                  <div className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-surface-card-hover">
                    <span className="text-sm text-text-secondary">Unpublished courses</span>
                    <span className="rounded-full bg-accent-amber/10 px-2 py-0.5 text-xs font-medium text-accent-amber">{draftCourses.length}</span>
                  </div>
                )}
                <Link
                  href="/instructor/courses/new"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-accent-500 transition-colors hover:bg-surface-card-hover"
                >
                  Create new course
                </Link>
                <Link
                  href="/instructor/courses"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-accent-500 transition-colors hover:bg-surface-card-hover"
                >
                  Manage all courses
                </Link>
              </div>
            </GlassCard>
          </section>
        </div>
      </div>
    </div>
  );
}
