"use client"

import { useState, useEffect, useCallback } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { listReports, resolveReport, type ContentReport } from "@/lib/data/reports"
import { Flag, Check, X, EyeOff } from "lucide-react"

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ContentReport[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReports = useCallback(async () => {
    try {
      const data = await listReports()
      setReports(data.reports)
    } catch { setReports([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchReports() }, [fetchReports])

  async function handleResolve(id: string, action?: "hide") {
    try {
      await resolveReport(id, action)
      await fetchReports()
    } catch { /* noop */ }
  }

  const openReports = reports.filter((r) => r.status === "OPEN")
  const resolvedReports = reports.filter((r) => r.status !== "OPEN")

  return (
    <div>
      <PageHeader
        title="Reports"
        description={`${openReports.length} open report${openReports.length !== 1 ? "s" : ""}`}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-text-tertiary">
          <Flag className="mb-3 h-10 w-10" />
          <p className="text-sm">No reports yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {openReports.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-text-primary">Open ({openReports.length})</h2>
              <div className="space-y-2">
                {openReports.map((r) => (
                  <div key={r.id} className="rounded-lg border border-accent-red/20 bg-accent-red/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-text-primary">{r.reason}</p>
                        <p className="mt-1 text-xs text-text-tertiary">
                          Target: {r.targetPostId} &middot; Reported: {new Date(r.reportedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button onClick={() => handleResolve(r.id, "hide")} className="flex cursor-pointer items-center gap-1 rounded-lg border border-accent-amber/30 px-3 py-1.5 text-xs text-accent-amber hover:bg-accent-amber/10">
                          <EyeOff className="h-3 w-3" /> Hide & Resolve
                        </button>
                        <button onClick={() => handleResolve(r.id)} className="flex cursor-pointer items-center gap-1 rounded-lg border border-accent-green/30 px-3 py-1.5 text-xs text-accent-green hover:bg-accent-green/10">
                          <Check className="h-3 w-3" /> Resolve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resolvedReports.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-text-tertiary">Resolved ({resolvedReports.length})</h2>
              <div className="space-y-1">
                {resolvedReports.map((r) => (
                  <div key={r.id} className="rounded-lg border border-border-default bg-surface-card px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-text-secondary line-through">{r.reason}</p>
                        <p className="mt-0.5 text-xs text-text-quaternary">
                          {r.status} &middot; {new Date(r.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <X className="h-3.5 w-3.5 shrink-0 text-text-quaternary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
