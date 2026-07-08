import GlassCard from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat-card";
import ChartPlaceholder from "@/components/ui/chart-placeholder";
import { PageHeader } from "@/components/ui/page-header";
import StatusBadge from "@/components/ui/status-badge";
import { INSTRUCTOR_STATS, COURSE_PERFORMANCE, RECENT_REVIEWS, PENDING_TASKS } from "@/constants/dashboard";
import { Star } from "lucide-react";

export default function InstructorDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Instructor Dashboard"
        description="Your teaching overview and performance"
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1 text-xs font-medium text-accent-green ring-1 ring-accent-green/20">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            Active
          </span>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INSTRUCTOR_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-text-primary">Course Performance</h2>
            <GlassCard className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border-default text-xs text-text-tertiary">
                      <th className="px-6 pb-3 pt-4 font-medium">Course</th>
                      <th className="px-6 pb-3 pt-4 font-medium">Students</th>
                      <th className="px-6 pb-3 pt-4 font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COURSE_PERFORMANCE.map((c) => (
                      <tr key={c.id} className="border-b border-border-default transition-colors hover:bg-surface-card-hover last:border-0">
                        <td className="px-6 py-3.5 font-medium text-text-primary">{c.title}</td>
                        <td className="px-6 py-3.5 text-text-secondary">{c.students.toLocaleString()}</td>
                        <td className="px-6 py-3.5">
                          <span className={`text-sm font-medium ${c.trendUp ? "text-accent-green" : "text-accent-red"}`}>
                            {c.trendUp ? "+" : ""}{c.trend}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          <ChartPlaceholder title="Student Enrollment Over Time" subtitle="Last 30 days" height={220} type="line" />
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-text-primary">Recent Reviews</h2>
            <GlassCard>
              <div className="space-y-4">
                {RECENT_REVIEWS.slice(0, 2).map((r) => (
                  <div key={r.id} className="border-b border-border-default pb-4 last:border-0 last:pb-0">
                    <div className="mb-1 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-accent-amber text-accent-amber" : "text-border-default"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-text-secondary">&ldquo;{r.excerpt}&rdquo;</p>
                    <p className="mt-1 text-xs text-text-tertiary">{r.author} &middot; {r.date}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-text-primary">Pending Tasks</h2>
            <GlassCard>
              <div className="space-y-3">
                {PENDING_TASKS.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-surface-card-hover">
                    <span className="text-sm text-text-secondary">{t.title}</span>
                    <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-xs font-medium text-brand-500">{t.count}</span>
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
