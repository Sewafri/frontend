"use client"

import { useEffect, useState, useCallback } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Loader2, DollarSign, AlertCircle } from "lucide-react"
import {
  getAdminPayments,
  getAdminRevenue,
  getInstructorAttribution,
  type AdminPayment,
} from "@/lib/data/admin-payments"
import { ApiError } from "@/lib/api/client"

type Tab = "payments" | "revenue" | "attribution"

export default function AdminPaymentsPage() {
  const [tab, setTab] = useState<Tab>("payments")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [revenueData, setRevenueData] = useState<{ period: string; revenue: number; count?: number }[]>([])
  const [subscriptionRevenue, setSubscriptionRevenue] = useState<{ period: string; revenue: number }[]>([])

  const [attribution, setAttribution] = useState<{
    totalRevenue: number
    byCourse: Array<{ courseTitle: string; instructorName: string; totalRevenue: number; transactionCount: number }>
    byInstructor: Array<{ instructorName: string; totalRevenue: number; courseCount: number; transactionCount: number }>
  } | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (tab === "payments") {
        const result = await getAdminPayments({ page, limit: 20 })
        setPayments(result.payments)
        setTotalPages(result.pagination.totalPages)
      } else if (tab === "revenue") {
        const result = await getAdminRevenue("month")
        setRevenueData(result.payments)
        setSubscriptionRevenue(result.subscriptionRevenue)
      } else {
        const result = await getInstructorAttribution()
        setAttribution(result)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }, [tab, page])

  useEffect(() => {
    loadData()
  }, [loadData])

  const STATUS_COLORS: Record<string, string> = {
    CONFIRMED: "text-accent-green",
    PENDING: "text-accent-amber",
    FAILED: "text-accent-red",
    EXPIRED: "text-text-tertiary",
  }

  return (
    <div>
      <PageHeader title="Payments & Revenue" description="Payment history and revenue analytics" />

      <div className="mb-4 flex items-center gap-2">
        {[
          { key: "payments" as const, label: "Payments" },
          { key: "revenue" as const, label: "Revenue" },
          { key: "attribution" as const, label: "Instructor Attribution" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setPage(1) }}
            className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === t.key
                ? "border-accent-500 bg-accent-500/10 text-accent-500"
                : "border-border-default text-text-secondary hover:border-border-strong"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-accent-red/20 bg-accent-red/5 px-4 py-3 text-xs text-accent-red">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-accent-500" />
        </div>
      ) : tab === "payments" ? (
        <div>
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border-default bg-surface-dark py-16">
              <DollarSign className="mb-3 h-12 w-12 text-text-tertiary" />
              <h2 className="text-lg font-semibold text-text-primary">No Payments</h2>
              <p className="mt-1 text-sm text-text-secondary">No payment records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border-default">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-default bg-surface-dark">
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-border-default last:border-b-0 hover:bg-surface-card">
                      <td className="px-4 py-3 text-text-primary">{p.user.fullName}</td>
                      <td className="px-4 py-3 text-text-secondary">{p.course?.title ?? "—"}</td>
                      <td className="px-4 py-3 text-text-primary font-medium">
                        {p.currency === "XAF"
                          ? `${p.amount.toLocaleString()} FCFA`
                          : `$${p.amount}`}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{p.method}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${STATUS_COLORS[p.status] ?? ""}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-tertiary text-xs">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="cursor-pointer rounded-lg border border-border-default px-3 py-1 text-xs text-text-secondary transition-colors hover:bg-surface-card-hover disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-xs text-text-tertiary">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="cursor-pointer rounded-lg border border-border-default px-3 py-1 text-xs text-text-secondary transition-colors hover:bg-surface-card-hover disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : tab === "revenue" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border-default bg-surface-dark p-5">
            <h3 className="mb-3 text-sm font-semibold text-text-primary">Course Payments Revenue</h3>
            {revenueData.length === 0 ? (
              <p className="py-8 text-center text-xs text-text-secondary">No revenue data yet</p>
            ) : (
              <div className="space-y-2">
                {revenueData.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">{new Date(r.period).toLocaleDateString("en-US", { year: "numeric", month: "short" })}</span>
                    <div className="text-right">
                      <span className="font-medium text-text-primary">${r.revenue.toFixed(2)}</span>
                      {r.count != null && (
                        <span className="ml-2 text-xs text-text-tertiary">({r.count} txns)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-xl border border-border-default bg-surface-dark p-5">
            <h3 className="mb-3 text-sm font-semibold text-text-primary">Subscription Revenue</h3>
            {subscriptionRevenue.length === 0 ? (
              <p className="py-8 text-center text-xs text-text-secondary">No subscription revenue data yet</p>
            ) : (
              <div className="space-y-2">
                {subscriptionRevenue.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">{new Date(r.period).toLocaleDateString("en-US", { year: "numeric", month: "short" })}</span>
                    <span className="font-medium text-text-primary">${r.revenue.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {attribution && (
            <>
              <div className="rounded-xl border border-border-default bg-surface-dark p-5">
                <h3 className="mb-1 text-sm font-semibold text-text-primary">Total Revenue</h3>
                <p className="text-2xl font-bold text-accent-500">${attribution.totalRevenue.toFixed(2)}</p>
              </div>

              <div className="rounded-xl border border-border-default bg-surface-dark p-5">
                <h3 className="mb-3 text-sm font-semibold text-text-primary">By Instructor</h3>
                {attribution.byInstructor.length === 0 ? (
                  <p className="py-4 text-center text-xs text-text-secondary">No data</p>
                ) : (
                  <div className="space-y-3">
                    {attribution.byInstructor.map((inst, i) => (
                      <div key={i} className="rounded-lg border border-border-default p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-text-primary">{inst.instructorName}</span>
                          <span className="text-sm font-bold text-accent-500">${inst.totalRevenue.toFixed(2)}</span>
                        </div>
                        <div className="mt-1 flex gap-3 text-xs text-text-tertiary">
                          <span>{inst.courseCount} courses</span>
                          <span>{inst.transactionCount} transactions</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-border-default bg-surface-dark p-5">
                <h3 className="mb-3 text-sm font-semibold text-text-primary">By Course</h3>
                {attribution.byCourse.length === 0 ? (
                  <p className="py-4 text-center text-xs text-text-secondary">No data</p>
                ) : (
                  <div className="space-y-2">
                    {attribution.byCourse.map((c, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-border-default p-3">
                        <div>
                          <p className="text-sm font-medium text-text-primary">{c.courseTitle}</p>
                          <p className="text-xs text-text-tertiary">{c.instructorName} · {c.transactionCount} transactions</p>
                        </div>
                        <span className="text-sm font-bold text-accent-500">${c.totalRevenue.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
