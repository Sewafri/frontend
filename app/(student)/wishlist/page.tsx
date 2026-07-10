"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, BookOpen, Star, Trash2, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { getWishlist, removeFromWishlist, type WishlistItem } from "@/lib/data/wishlist"
import { RatingStars } from "@/components/ui/rating-stars"
import { cn } from "@/lib/utils"

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    loadWishlist()
  }, [])

  async function loadWishlist() {
    setLoading(true)
    try {
      const result = await getWishlist()
      setItems(result.wishlist)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove(courseId: string) {
    setRemoving(courseId)
    try {
      await removeFromWishlist(courseId)
      setItems((prev) => prev.filter((item) => item.course.id !== courseId))
    } catch {
      // silently fail
    } finally {
      setRemoving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-accent-500" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Wishlist" description="Courses you've saved for later" />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-default bg-surface-dark py-20">
          <Heart className="mb-3 h-12 w-12 text-text-tertiary" />
          <h2 className="text-lg font-semibold text-text-primary">Your wishlist is empty</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Save courses you&apos;re interested in for later.
          </p>
          <Link
            href="/courses"
            className="mt-4 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-500/90"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const course = item.course
            const instructorName = course.instructor?.fullName ?? "Instructor"
            const displayPrice =
              course.pricingModel === "FREE"
                ? "Free"
                : course.currency === "XAF"
                  ? `${Number(course.price).toLocaleString()} FCFA`
                  : `$${Number(course.price)}`

            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl border border-border-default bg-surface-card transition-colors hover:border-border-strong"
              >
                <Link href={`/courses/${course.id}`}>
                  <div className="relative flex h-40 items-center justify-center bg-surface-sunken">
                    {course.coverImageUrl ? (
                      <Image
                        src={course.coverImageUrl}
                        alt={course.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain p-6 transition-transform duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <BookOpen className="h-12 w-12 text-accent-500" />
                    )}
                    <span className="absolute right-3 top-3 rounded-full bg-accent-500 px-2.5 py-0.5 text-xs font-semibold text-text-on-accent">
                      {course.category}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => handleRemove(course.id)}
                  disabled={removing === course.id}
                  className="absolute right-2 top-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface-card/80 text-accent-red backdrop-blur-sm transition-colors hover:bg-surface-card disabled:opacity-50"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <Link href={`/courses/${course.id}`}>
                  <div className="space-y-2 p-4">
                    <h3 className="text-sm font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent-500">
                      {course.title}
                    </h3>
                    <p className="line-clamp-2 text-xs leading-relaxed text-text-secondary">
                      {course.description}
                    </p>
                    {course.averageRating != null && (
                      <RatingStars
                        rating={course.averageRating}
                        reviewCount={course.ratingCount}
                        size="sm"
                      />
                    )}
                    <div className="flex items-center justify-between border-t border-border-default pt-2">
                      <span className="text-xs text-text-tertiary">{instructorName}</span>
                      <span className="text-sm font-bold text-accent-500">
                        {displayPrice}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
