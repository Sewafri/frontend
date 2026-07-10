import { api, apiMutate } from "@/lib/api/client"
import type { Course } from "@/types/db"

export interface WishlistItem {
  id: string
  addedAt: string
  course: Course & {
    _count: { lessons: number }
    averageRating: number | null
    ratingCount: number
    reviewCount: number
  }
}

export async function getWishlist(): Promise<{ wishlist: WishlistItem[] }> {
  return api<{ wishlist: WishlistItem[] }>("/wishlist/me")
}

export async function addToWishlist(
  courseId: string,
): Promise<{ item: WishlistItem; created: boolean }> {
  return apiMutate<{ item: WishlistItem; created: boolean }>(
    `/wishlist/${courseId}`,
    { method: "POST" },
    "Saved to wishlist",
  )
}

export async function removeFromWishlist(courseId: string): Promise<void> {
  await apiMutate(
    `/wishlist/${courseId}`,
    { method: "DELETE" },
    "Removed from wishlist",
  )
}
