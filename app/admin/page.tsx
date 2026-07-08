"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat-card";
import ChartPlaceholder from "@/components/ui/chart-placeholder";
import { PageHeader } from "@/components/ui/page-header";
import { ADMIN_STATS, RECENT_ACTIVITY } from "@/constants/dashboard";
import { getAdminDashboard } from "@/lib/data/admin";
import { Activity } from "lucide-react";

export default function AdminOverviewPage() {
  const [_stats, setStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    getAdminDashboard()
      .then((data) => setStats(data.stats ?? null))
      .catch(() => {});
  }, []);

  return (
    <div>
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
        <ChartPlaceholder title="Platform Growth" subtitle="Monthly active users" height={280} type="line" />
        <ChartPlaceholder title="Revenue Overview" subtitle="Monthly revenue breakdown" height={280} type="bar" />

        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Recent Activity</h2>
          <GlassCard>
            {RECENT_ACTIVITY.length > 0 ? (
              <div className="space-y-1">
                {RECENT_ACTIVITY.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-card-hover">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/10">
                      <Activity className="h-4 w-4 text-brand-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-text-primary">{a.text}</p>
                      <p className="text-xs text-text-tertiary">{a.timestamp}</p>
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
