import { api } from "@/lib/api/client"
import type { User, Course, Certificate } from "@/types/db"

export async function getAdminDashboard(): Promise<{
  stats: Record<string, number>
  recentActivity: unknown[]
  totalUsers: number
  totalRevenue: number
  platformGrowth: number
  activeCourses: number
}> {
  const data = await api<Record<string, unknown>>("/admin/dashboard")
  return data as unknown as {
    stats: Record<string, number>
    recentActivity: unknown[]
    totalUsers: number
    totalRevenue: number
    platformGrowth: number
    activeCourses: number
  }
}

export async function getAdminUsers(params?: {
  search?: string
  role?: string
  status?: string
}): Promise<User[]> {
  const data = await api<{ users: User[] }>("/admin/users", {
    params: {
      search: params?.search || undefined,
      role: params?.role || undefined,
      status: params?.status || undefined,
    },
  })
  return data.users
}

export async function suspendUser(userId: string): Promise<void> {
  await api(`/admin/users/${userId}/suspend`, { method: "PATCH" })
}

export async function changeUserRole(userId: string, role: "STUDENT" | "INSTRUCTOR" | "ADMIN"): Promise<void> {
  await api(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  })
}

export async function getAdminCourses(): Promise<Course[]> {
  // MOCK: admin specific courses endpoint may not exist
  // Reuses the regular courses API
  const data = await api<{ courses: Course[] }>("/courses")
  return data.courses
}

export async function getAdminCertificates(): Promise<Certificate[]> {
  // MOCK: no GET /certificates endpoint — see MIGRATION.md
  return []
}
