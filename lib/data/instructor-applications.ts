import { api, apiMutate } from "@/lib/api/client"

export interface InstructorApplication {
  id: string
  userId: string
  bio: string
  expertise: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  appliedAt: string
  reviewedAt?: string | null
  reviewedBy?: string | null
  user?: { id: string; fullName: string; email: string; photoUrl?: string | null; createdAt: string }
}

export async function applyAsInstructor(data: {
  bio: string
  expertise: string
}): Promise<{ application: InstructorApplication }> {
  return apiMutate<{ application: InstructorApplication }>(
    "/instructor-applications",
    { method: "POST", body: JSON.stringify(data) },
    "Application submitted",
  )
}

export async function getInstructorApplications(
  status?: string,
): Promise<{ applications: InstructorApplication[] }> {
  return api<{ applications: InstructorApplication[] }>("/admin/instructor-applications", {
    params: status ? { status } : undefined,
  })
}

export async function approveApplication(
  id: string,
): Promise<{ application: InstructorApplication }> {
  return apiMutate<{ application: InstructorApplication }>(
    `/admin/instructor-applications/${id}/approve`,
    { method: "PATCH" },
    "Application approved",
  )
}

export async function rejectApplication(
  id: string,
): Promise<{ application: InstructorApplication }> {
  return apiMutate<{ application: InstructorApplication }>(
    `/admin/instructor-applications/${id}/reject`,
    { method: "PATCH" },
    "Application rejected",
  )
}
