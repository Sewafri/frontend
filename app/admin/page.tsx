import GlassCard from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat-card";
import ChartPlaceholder from "@/components/ui/chart-placeholder";
import { PageHeader } from "@/components/ui/page-header";
import { ADMIN_STATS, RECENT_ACTIVITY } from "@/constants/dashboard";
import { Activity } from "lucide-react";

export default function AdminOverviewPage() {
  return (
    <div className="">
      <PageHeader
        title="Admin Overview"
        description="Platform-wide metrics and activity"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ADMIN_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartPlaceholder title="Platform Growth" height={280} type="line" />
        <ChartPlaceholder title="Revenue Overview" height={280} type="bar" />

        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-white">Recent Activity</h2>
          <GlassCard>
            {RECENT_ACTIVITY.length > 0 ? (
              <div className="space-y-4">
                {RECENT_ACTIVITY.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 border-b border-border-glass pb-4 last:border-0 last:pb-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange/10">
                      <Activity className="h-4 w-4 text-brand-orange" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{a.text}</p>
                      <p className="text-xs text-text-secondary">{a.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-text-secondary">No recent activity</p>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
