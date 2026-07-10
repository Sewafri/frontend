import { api } from "@/lib/api/client"

export interface AdminPayment {
  id: string
  amount: number
  currency: string
  method: string
  status: string
  gatewayReference?: string | null
  usdEquivalent?: number | null
  createdAt: string
  confirmedAt?: string | null
  user: { id: string; fullName: string; email: string }
  course?: { id: string; title: string; instructorId: string; instructor: { id: string; fullName: string; email: string } } | null
  cryptoDetail?: Record<string, unknown> | null
}

export interface RevenueEntry {
  period: string
  revenue: number
  count?: number
}

export interface InstructorAttribution {
  instructorId: string
  instructorName: string
  instructorEmail: string
  totalRevenue: number
  courseCount: number
  transactionCount: number
  courses: Array<{ courseId: string; courseTitle: string; revenue: number; transactions: number }>
}

export async function getAdminPayments(params?: {
  page?: number
  limit?: number
  status?: string
  method?: string
  userId?: string
}): Promise<{ payments: AdminPayment[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  const queryParams: Record<string, string | undefined> = {}
  if (params?.page) queryParams.page = String(params.page)
  if (params?.limit) queryParams.limit = String(params.limit)
  if (params?.status) queryParams.status = params.status
  if (params?.method) queryParams.method = params.method
  if (params?.userId) queryParams.userId = params.userId
  return api(`/admin/payments`, { params: queryParams })
}

export async function getAdminRevenue(
  groupBy?: "day" | "week" | "month",
): Promise<{ groupBy: string; payments: RevenueEntry[]; subscriptionRevenue: RevenueEntry[] }> {
  return api(`/admin/revenue`, {
    params: groupBy ? { groupBy } : undefined,
  })
}

export async function getInstructorAttribution(): Promise<{
  totalRevenue: number
  byCourse: Array<{ courseId: string; courseTitle: string; instructorId: string; instructorName: string; totalRevenue: number; transactionCount: number }>
  byInstructor: InstructorAttribution[]
}> {
  return api("/admin/revenue/instructor-attribution")
}
