import { api, apiMutate } from "@/lib/api/client"

interface RatingSummary {
  averageRating: number | null
  ratingCount: number
}

interface Rating {
  id: string
  rating: number
  comment?: string | null
  userId: string
  courseId: string
  createdAt: string
  user: { id: string; fullName: string }
}

interface PaginatedRatings {
  ratings: Rating[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export async function getRatingSummary(courseId: string): Promise<RatingSummary> {
  return api<RatingSummary>(`/courses/${courseId}/ratings/summary`)
}

export async function getRatings(
  courseId: string,
  page = 1,
  limit = 20,
): Promise<PaginatedRatings> {
  return api<PaginatedRatings>(`/courses/${courseId}/ratings`, {
    params: { page: String(page), limit: String(limit) },
  })
}

export async function submitRating(
  courseId: string,
  data: { rating: number; comment?: string },
): Promise<{ rating: Rating }> {
  return apiMutate<{ rating: Rating }>(
    `/courses/${courseId}/ratings`,
    { method: "POST", body: JSON.stringify(data) },
    "Rating submitted",
  )
}

export async function deleteMyRating(courseId: string): Promise<void> {
  await apiMutate(
    `/courses/${courseId}/ratings/mine`,
    { method: "DELETE" },
    "Rating deleted",
  )
}
