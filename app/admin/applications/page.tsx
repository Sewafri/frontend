"use client"

import { useEffect, useState } from "react"
import { Loader2, AlertCircle, User } from "lucide-react"
import {
  getInstructorApplications,
  approveApplication,
  rejectApplication,
  type InstructorApplication,
} from "@/lib/data/instructor-applications"
import { ApiError } from "@/lib/api/client"

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-brand-amber/10 text-brand-amber border-brand-amber/20",
  APPROVED: "bg-brand-green/10 text-brand-green border-brand-green/20",
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
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Applications</h1>
        <p className="mt-1 text-sm text-brand-text-mid">Review instructor applications</p>
      </div>

      <div className="mb-4 flex items-center gap-2">
        {["", "PENDING", "APPROVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === s
                ? "border-brand-green bg-brand-green-light text-brand-green"
                : "border-brand-border text-brand-text-mid hover:border-brand-border-strong"
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
          <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-brand-border bg-brand-bg py-16">
          <User className="mb-3 h-12 w-12 text-brand-text-light" />
          <h2 className="text-lg font-semibold text-brand-text">No Applications</h2>
          <p className="mt-1 text-sm text-brand-text-mid">
            {filter ? `No ${filter.toLowerCase()} applications` : "No instructor applications yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-xl border border-brand-border bg-brand-bg p-4 transition-colors hover:border-brand-border-strong"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green-light text-sm font-semibold text-brand-green">
                    {app.user?.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2) ?? "??"}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-brand-text">
                      {app.user?.fullName ?? "Unknown"}
                    </h3>
                    <p className="text-xs text-brand-text-mid">{app.user?.email}</p>
                    <p className="mt-1 text-xs text-brand-text-light">
                      <span className="font-medium">Expertise:</span> {app.expertise}
                    </p>
                    <p className="mt-0.5 text-xs text-brand-text-light">
                      {app.bio}
                    </p>
                    <p className="mt-1 text-xs text-brand-text-light">
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
                <div className="mt-3 flex justify-end gap-2 border-t border-brand-border pt-3">
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
                    className="cursor-pointer rounded-lg bg-brand-green px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-green/90 disabled:opacity-50"
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
