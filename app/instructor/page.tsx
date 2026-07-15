"use client";

import { useEffect, useState } from "react";
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
        <p className="text-sm text-brand-text-mid">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">My Dashboard</h1>
        <p className="mt-1 text-sm text-brand-text-mid">Your teaching overview</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl bg-brand-card p-5 ring-1 ring-brand-border">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-text">{data?.totalStudents ?? 0}</p>
            <p className="text-xs text-brand-text-light">Total Students</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl bg-brand-card p-5 ring-1 ring-brand-border">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-text">{activeCourses.length}</p>
            <p className="text-xs text-brand-text-light">Active Courses</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl bg-brand-card p-5 ring-1 ring-brand-border">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-text">{data?.averageRating.toFixed(1) ?? "—"}</p>
            <p className="text-xs text-brand-text-light">Avg Rating</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl bg-brand-card p-5 ring-1 ring-brand-border">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-text">{draftCourses.length}</p>
            <p className="text-xs text-brand-text-light">Drafts</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-brand-text">Course Performance</h2>
            <div className="rounded-xl border border-brand-border bg-brand-card p-0">
              {data?.courses && data.courses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-brand-border text-xs text-brand-text-light">
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
                          <tr key={c.id} className="border-b border-brand-border transition-colors hover:bg-brand-bg last:border-0">
                            <td className="px-6 py-3.5 font-medium text-brand-text">{c.title}</td>
                            <td className="px-6 py-3.5">
                              <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                c.status === "PUBLISHED" ? "bg-brand-green/10 text-brand-green"
                                : c.status === "DRAFT" ? "bg-brand-amber/10 text-brand-amber"
                                : "bg-accent-red/10 text-accent-red"
                              }`}>{c.status}</span>
                            </td>
                            <td className="px-6 py-3.5 text-brand-text-mid">{dash?.enrollmentCount ?? "—"}</td>
                            <td className="px-6 py-3.5 text-brand-text-mid">{dash ? `${dash.completionRate.toFixed(0)}%` : "—"}</td>
                            <td className="px-6 py-3.5">
                              <Link href={`/instructor/courses/${c.id}/edit`} className="inline-flex items-center gap-1 text-xs font-medium text-brand-green hover:underline">
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
                  <p className="text-sm text-brand-text-light">No courses yet. Create your first course to see performance data.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-brand-text">Quick Actions</h2>
            <div className="rounded-xl border border-brand-border bg-brand-card p-5">
              <div className="space-y-3">
                {draftCourses.length > 0 && (
                  <div className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-brand-bg">
                    <span className="text-sm text-brand-text-mid">Unpublished courses</span>
                    <span className="rounded-full bg-brand-amber/10 px-2 py-0.5 text-xs font-medium text-brand-amber">{draftCourses.length}</span>
                  </div>
                )}
                <Link
                  href="/instructor/courses/new"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-brand-green transition-colors hover:bg-brand-bg"
                >
                  Create new course
                </Link>
                <Link
                  href="/instructor/courses"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-brand-green transition-colors hover:bg-brand-bg"
                >
                  Manage all courses
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
