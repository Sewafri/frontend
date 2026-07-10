"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Loader2, AlertCircle, User } from "lucide-react"
import {
  getInstructorApplications,
  approveApplication,
  rejectApplication,
  type InstructorApplication,
} from "@/lib/data/instructor-applications"
import { ApiError } from "@/lib/api/client"

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
  APPROVED: "bg-accent-green/10 text-accent-green border-accent-green/20",
  REJECTED: "bg-accent-red/10 text-accent-red border-accent-red/20",
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<InstructorApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadApplications()
  }, [filter])

  async function loadApplications() {
    setLoading(true)
    setError(null)
    try {
      const result = await getInstructorApplications(filter || undefined)
      setApplications(result.applications)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(id: string) {
    setActionLoading(id)
    try {
      await approveApplication(id)
      await loadApplications()
    } catch {
      setError("Failed to approve application")
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReject(id: string) {
    setActionLoading(id)
    try {
      await rejectApplication(id)
      await loadApplications()
    } catch {
      setError("Failed to reject application")
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div>
      <PageHeader title="Applications" description="Review instructor applications" />

      <div className="mb-4 flex items-center gap-2">
        {["", "PENDING", "APPROVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === s
                ? "border-accent-500 bg-accent-500/10 text-accent-500"
                : "border-border-default text-text-secondary hover:border-border-strong"
            }`}
          >
            {s || "All"}
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
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-default bg-surface-dark py-16">
          <User className="mb-3 h-12 w-12 text-text-tertiary" />
          <h2 className="text-lg font-semibold text-text-primary">No Applications</h2>
          <p className="mt-1 text-sm text-text-secondary">
            {filter ? `No ${filter.toLowerCase()} applications` : "No instructor applications yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-xl border border-border-default bg-surface-dark p-4 transition-colors hover:border-border-strong"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-500/10 text-sm font-semibold text-accent-500">
                    {app.user?.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2) ?? "??"}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      {app.user?.fullName ?? "Unknown"}
                    </h3>
                    <p className="text-xs text-text-secondary">{app.user?.email}</p>
                    <p className="mt-1 text-xs text-text-tertiary">
                      <span className="font-medium">Expertise:</span> {app.expertise}
                    </p>
                    <p className="mt-0.5 text-xs text-text-tertiary">
                      {app.bio}
                    </p>
                    <p className="mt-1 text-xs text-text-tertiary">
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                      {app.reviewedAt && ` · Reviewed ${new Date(app.reviewedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[app.status] ?? ""}`}>
                  {app.status}
                </span>
              </div>

              {app.status === "PENDING" && (
                <div className="mt-3 flex justify-end gap-2 border-t border-border-default pt-3">
                  <button
                    onClick={() => handleReject(app.id)}
                    disabled={actionLoading === app.id}
                    className="cursor-pointer rounded-lg border border-accent-red/30 px-4 py-1.5 text-xs font-medium text-accent-red transition-colors hover:bg-accent-red/5 disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(app.id)}
                    disabled={actionLoading === app.id}
                    className="cursor-pointer rounded-lg bg-accent-green px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-green/90 disabled:opacity-50"
                  >
                    {actionLoading === app.id ? "..." : "Approve"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
