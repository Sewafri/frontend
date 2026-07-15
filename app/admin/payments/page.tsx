"use client"

import { useEffect, useState, useCallback } from "react"
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
    CONFIRMED: "text-brand-green",
    PENDING: "text-brand-amber",
    FAILED: "text-accent-red",
    EXPIRED: "text-brand-text-light",
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Payments & Revenue</h1>
        <p className="mt-1 text-sm text-brand-text-mid">Payment history and revenue analytics</p>
      </div>

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
                ? "border-brand-green bg-brand-green-light text-brand-green"
                : "border-brand-border text-brand-text-mid hover:border-border-strong"
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
          <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
        </div>
      ) : tab === "payments" ? (
        <div>
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-brand-border bg-brand-bg py-16">
              <DollarSign className="mb-3 h-12 w-12 text-brand-text-light" />
              <h2 className="text-lg font-semibold text-brand-text">No Payments</h2>
              <p className="mt-1 text-sm text-brand-text-mid">No payment records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-brand-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-bg">
                    <th className="px-4 py-3 text-left text-xs font-medium text-brand-text-light">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-brand-text-light">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-brand-text-light">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-brand-text-light">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-brand-text-light">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-brand-text-light">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-brand-border last:border-b-0 hover:bg-brand-card">
                      <td className="px-4 py-3 text-brand-text">{p.user.fullName}</td>
                      <td className="px-4 py-3 text-brand-text-mid">{p.course?.title ?? "—"}</td>
                      <td className="px-4 py-3 text-brand-text font-medium">
                        {p.currency === "XAF"
                          ? `${p.amount.toLocaleString()} FCFA`
                          : `$${p.amount}`}
                      </td>
                      <td className="px-4 py-3 text-brand-text-mid">{p.method}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${STATUS_COLORS[p.status] ?? ""}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-brand-text-light text-xs">
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
                className="cursor-pointer rounded-lg border border-brand-border px-3 py-1 text-xs text-brand-text-mid transition-colors hover:bg-brand-bg disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-xs text-brand-text-light">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="cursor-pointer rounded-lg border border-brand-border px-3 py-1 text-xs text-brand-text-mid transition-colors hover:bg-brand-bg disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : tab === "revenue" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-brand-border bg-brand-bg p-5">
            <h3 className="mb-3 text-sm font-semibold text-brand-text">Course Payments Revenue</h3>
            {revenueData.length === 0 ? (
              <p className="py-8 text-center text-xs text-brand-text-mid">No revenue data yet</p>
            ) : (
              <div className="space-y-2">
                {revenueData.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-brand-text-mid">{new Date(r.period).toLocaleDateString("en-US", { year: "numeric", month: "short" })}</span>
                    <div className="text-right">
                      <span className="font-medium text-brand-text">${r.revenue.toFixed(2)}</span>
                      {r.count != null && (
                        <span className="ml-2 text-xs text-brand-text-light">({r.count} txns)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-xl border border-brand-border bg-brand-bg p-5">
            <h3 className="mb-3 text-sm font-semibold text-brand-text">Subscription Revenue</h3>
            {subscriptionRevenue.length === 0 ? (
              <p className="py-8 text-center text-xs text-brand-text-mid">No subscription revenue data yet</p>
            ) : (
              <div className="space-y-2">
                {subscriptionRevenue.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-brand-text-mid">{new Date(r.period).toLocaleDateString("en-US", { year: "numeric", month: "short" })}</span>
                    <span className="font-medium text-brand-text">${r.revenue.toFixed(2)}</span>
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
              <div className="rounded-xl border border-brand-border bg-brand-bg p-5">
                <h3 className="mb-1 text-sm font-semibold text-brand-text">Total Revenue</h3>
                <p className="text-2xl font-bold text-brand-green">${attribution.totalRevenue.toFixed(2)}</p>
              </div>

              <div className="rounded-xl border border-brand-border bg-brand-bg p-5">
                <h3 className="mb-3 text-sm font-semibold text-brand-text">By Instructor</h3>
                {attribution.byInstructor.length === 0 ? (
                  <p className="py-4 text-center text-xs text-brand-text-mid">No data</p>
                ) : (
                  <div className="space-y-3">
                    {attribution.byInstructor.map((inst, i) => (
                      <div key={i} className="rounded-lg border border-brand-border p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-brand-text">{inst.instructorName}</span>
                          <span className="text-sm font-bold text-brand-green">${inst.totalRevenue.toFixed(2)}</span>
                        </div>
                        <div className="mt-1 flex gap-3 text-xs text-brand-text-light">
                          <span>{inst.courseCount} courses</span>
                          <span>{inst.transactionCount} transactions</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-brand-border bg-brand-bg p-5">
                <h3 className="mb-3 text-sm font-semibold text-brand-text">By Course</h3>
                {attribution.byCourse.length === 0 ? (
                  <p className="py-4 text-center text-xs text-brand-text-mid">No data</p>
                ) : (
                  <div className="space-y-2">
                    {attribution.byCourse.map((c, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-brand-border p-3">
                        <div>
                          <p className="text-sm font-medium text-brand-text">{c.courseTitle}</p>
                          <p className="text-xs text-brand-text-light">{c.instructorName} · {c.transactionCount} transactions</p>
                        </div>
                        <span className="text-sm font-bold text-brand-green">${c.totalRevenue.toFixed(2)}</span>
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
