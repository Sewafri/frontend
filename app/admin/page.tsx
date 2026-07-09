"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { getAdminDashboard, type AdminDashboardData } from "@/lib/data/admin";
import { Users, BookOpen, Award, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const totalUsers = data
    ? Object.values(data.usersByRole).reduce((a, b) => a + b, 0)
    : 0;

  const statCards = data
    ? [
        {
          label: "Total Users",
          value: totalUsers.toLocaleString(),
          sub: `${data.usersByRole["STUDENT"] ?? 0} students · ${data.usersByRole["INSTRUCTOR"] ?? 0} instructors`,
          icon: Users,
        },
        {
          label: "Enrollments",
          value: data.totalEnrollments.toLocaleString(),
          sub: `${data.certificatesIssued} certificates issued`,
          icon: BookOpen,
        },
        {
          label: "Revenue",
          value: `$${data.totalRevenue.toLocaleString()}`,
          sub: "Total confirmed payments",
          icon: DollarSign,
        },
        {
          label: "Open Reports",
          value: String(data.openReports),
          sub: data.openReports > 0 ? "Needs attention" : "No open issues",
          icon: AlertTriangle,
          highlight: data.openReports > 0,
        },
      ]
    : [];

  return (
    <div>
      <PageHeader title="Admin Overview" description="Platform-wide metrics and activity" />

      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-text-secondary">Loading dashboard...</p>
        </div>
      )}

      {!loading && !data && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-text-tertiary">Could not load dashboard data.</p>
        </div>
      )}

      {!loading && data && (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-surface-card p-5 ring-1 ring-border-default"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    s.highlight ? "bg-accent-red/10 text-accent-red" : "bg-accent-500/10 text-accent-500"
                  }`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-text-primary">{s.value}</p>
                <p className="mt-0.5 text-xs text-text-tertiary">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-surface-card p-5 ring-1 ring-border-default">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-text-tertiary" />
                <h2 className="text-sm font-semibold text-text-primary">Users by Role</h2>
              </div>
              <div className="space-y-3">
                {(["STUDENT", "INSTRUCTOR", "ADMIN"] as const).map((role) => {
                  const count = data.usersByRole[role] ?? 0;
                  const pct = totalUsers > 0 ? (count / totalUsers) * 100 : 0;
                  return (
                    <div key={role}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-text-secondary">{role.charAt(0) + role.slice(1).toLowerCase()}s</span>
                        <span className="font-medium text-text-primary">{count.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surface-sunken">
                        <div
                          className="h-1.5 rounded-full bg-accent-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl bg-surface-card p-5 ring-1 ring-border-default">
              <div className="mb-4 flex items-center gap-2">
                <Award className="h-4 w-4 text-text-tertiary" />
                <h2 className="text-sm font-semibold text-text-primary">Revenue Breakdown</h2>
              </div>
              {data.revenueByPurchaseType &&
              Object.keys(data.revenueByPurchaseType).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(data.revenueByPurchaseType).map(([type, amount]) => (
                    <div key={type}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-text-secondary">{type.replace(/_/g, " ")}</span>
                        <span className="font-medium text-text-primary">${Number(amount).toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surface-sunken">
                        <div className="h-1.5 rounded-full bg-accent-500 transition-all" style={{ width: `${data.totalRevenue > 0 ? (Number(amount) / data.totalRevenue) * 100 : 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-text-tertiary">No revenue data yet</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
