import { api, apiMutate } from "@/lib/api/client"
import type { User, Course } from "@/types/db"

export interface AdminDashboardData {
  usersByRole: Record<string, number>
  totalEnrollments: number
  totalRevenue: number
  certificatesIssued: number
  openReports: number
  revenueByMethod: Record<string, number>
  revenueByPurchaseType: Record<string, number>
}

export interface AdminCertificate {
  id: string
  certificateNumber: string
  status: string
  issueDate: string
  course: { id: string; title: string } | null
  student: { id: string; fullName: string; email: string } | null
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  return api<AdminDashboardData>("/admin/dashboard")
}

export async function getAdminUsers(params?: {
  search?: string
  role?: string
  status?: string
}): Promise<{ users: User[]; total: number }> {
  return api<{ users: User[]; total: number }>("/admin/users", {
    params: {
      search: params?.search || undefined,
      role: params?.role || undefined,
      status: params?.status || undefined,
    },
  })
}

export async function suspendUser(userId: string): Promise<void> {
  await apiMutate(`/admin/users/${userId}/suspend`, { method: "PATCH" }, "User suspended")
}

export async function reactivateUser(userId: string): Promise<void> {
  await apiMutate(`/admin/users/${userId}/reactivate`, { method: "PATCH" }, "User reactivated")
}

export async function changeUserRole(userId: string, role: "STUDENT" | "INSTRUCTOR" | "ADMIN"): Promise<void> {
  await apiMutate(
    `/admin/users/${userId}/role`,
    { method: "PATCH", body: JSON.stringify({ role }) },
    "Role changed",
  )
}

export async function getAdminCourses(): Promise<{ courses: Course[]; total: number }> {
  return api<{ courses: Course[]; total: number }>("/admin/courses")
}

export async function getAdminCertificates(): Promise<{ certificates: AdminCertificate[]; total: number }> {
  return api<{ certificates: AdminCertificate[]; total: number }>("/admin/certificates")
}

export async function revokeCertificate(certId: string): Promise<void> {
  await apiMutate(`/certificates/${certId}/revoke`, { method: "PATCH" }, "Certificate revoked")
}
