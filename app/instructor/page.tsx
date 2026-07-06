import GlassCard from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat-card";
import ChartPlaceholder from "@/components/ui/chart-placeholder";
import { PageHeader } from "@/components/ui/page-header";
import StatusBadge from "@/components/ui/status-badge";
import { INSTRUCTOR_STATS, COURSE_PERFORMANCE, RECENT_REVIEWS, PENDING_TASKS } from "@/constants/dashboard";
import { Star } from "lucide-react";

export default function InstructorDashboardPage() {
  return (
    <div className="">
      <PageHeader
        title="Instructor Dashboard"
        description="Your teaching overview and performance"
        actions={
          <span className="cursor-pointer rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">Active</span>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INSTRUCTOR_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-white">Course Performance</h2>
          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-glass text-xs text-text-secondary">
                    <th className="pb-3 font-medium">Course</th>
                    <th className="pb-3 font-medium">Students</th>
                    <th className="pb-3 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {COURSE_PERFORMANCE.map((c) => (
                    <tr key={c.id} className="border-b border-border-glass last:border-0">
                      <td className="py-3 font-medium text-white">{c.title}</td>
                      <td className="py-3 text-text-secondary">{c.students.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`text-sm ${c.trendUp ? "text-green-400" : "text-red-400"}`}>
                          {c.trendUp ? "+" : ""}{c.trend}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <div className="mt-6">
            <ChartPlaceholder title="Student Enrollment Over Time" height={220} type="line" />
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-white">Recent Reviews</h2>
            <GlassCard>
              <div className="space-y-4">
                {RECENT_REVIEWS.slice(0, 2).map((r) => (
                  <div key={r.id} className="border-b border-border-glass pb-4 last:border-0 last:pb-0">
                    <div className="mb-1 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-600"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-text-secondary">&ldquo;{r.excerpt}&rdquo;</p>
                    <p className="mt-1 text-xs text-text-secondary">{r.author} &middot; {r.date}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-white">Pending Tasks</h2>
            <GlassCard>
              <div className="space-y-3">
                {PENDING_TASKS.map((t) => (
                  <div key={t.id} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{t.title}</span>
                    <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-xs font-medium text-brand-orange">{t.count}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>
        </div>
      </div>
    </div>
  );
}
