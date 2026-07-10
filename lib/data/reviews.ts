import { api, apiMutate } from "@/lib/api/client"

interface ReviewSummary {
  averageRating: number | null
  reviewCount: number
}

interface Review {
  id: string
  rating: number
  comment?: string | null
  userId: string
  courseId: string
  createdAt: string
  user: { id: string; fullName: string }
}

interface PaginatedReviews {
  reviews: Review[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export async function getReviewSummary(courseId: string): Promise<ReviewSummary> {
  return api<ReviewSummary>(`/courses/${courseId}/reviews/summary`)
}

export async function getReviews(
  courseId: string,
  page = 1,
  limit = 20,
): Promise<PaginatedReviews> {
  return api<PaginatedReviews>(`/courses/${courseId}/reviews`, {
    params: { page: String(page), limit: String(limit) },
  })
}

export async function submitReview(
  courseId: string,
  data: { rating: number; comment?: string },
): Promise<{ review: Review }> {
  return apiMutate<{ review: Review }>(
    `/courses/${courseId}/reviews`,
    { method: "POST", body: JSON.stringify(data) },
    "Review submitted",
  )
}

export async function deleteMyReview(courseId: string): Promise<void> {
  await apiMutate(
    `/courses/${courseId}/reviews/mine`,
    { method: "DELETE" },
    "Review deleted",
  )
}
