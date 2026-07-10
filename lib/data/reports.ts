import { api, apiMutate } from "@/lib/api/client"

export interface ContentReport {
  id: string
  targetType: "FORUM_POST"
  reason: string
  status: "OPEN" | "RESOLVED" | "DISMISSED"
  reportedAt: string
  updatedAt: string
  reporterId: string
  targetPostId: string | null
}

export async function fileReport(targetType: string, targetId: string, reason: string): Promise<{ report: ContentReport }> {
  return apiMutate<{ report: ContentReport }>(
    "/reports",
    { method: "POST", body: JSON.stringify({ targetType, targetId, reason }) },
    "Report filed",
  )
}

export async function listReports(): Promise<{ reports: ContentReport[] }> {
  return api<{ reports: ContentReport[] }>("/reports")
}

export async function resolveReport(reportId: string, action?: "hide"): Promise<{ report: ContentReport }> {
  return apiMutate<{ report: ContentReport }>(
    `/reports/${reportId}/resolve`,
    { method: "PATCH", body: JSON.stringify(action ? { action } : {}) },
    "Report resolved",
  )
}
