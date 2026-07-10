"use client"

import { useState, useEffect } from "react"
import { Star, MessageSquare, Trash2, ChevronDown } from "lucide-react"
import { RatingStars } from "@/components/ui/rating-stars"
import { RatingInput } from "@/components/courses/rating-input"
import { getReviewSummary, getReviews, submitReview, deleteMyReview } from "@/lib/data/reviews"
import { getRatingSummary, submitRating, deleteMyRating } from "@/lib/data/ratings"
import { ApiError } from "@/lib/api/client"
import { cn } from "@/lib/utils"

interface ReviewSectionProps {
  courseId: string
  isEnrolled: boolean
}

export function ReviewSection({ courseId, isEnrolled }: ReviewSectionProps) {
  const [summary, setSummary] = useState<{ averageRating: number | null; ratingCount: number } | null>(null)
  const [reviews, setReviews] = useState<Array<{ id: string; rating: number; comment?: string | null; createdAt: string; user: { id: string; fullName: string } }>>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formRating, setFormRating] = useState(0)
  const [formComment, setFormComment] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadData()
  }, [courseId, page])

  async function loadData() {
    setLoading(true)
    try {
      const [summ, revs] = await Promise.all([
        getRatingSummary(courseId),
        getReviews(courseId, page, 5),
      ])
      setSummary(summ)
      setReviews(revs.reviews)
      setTotalPages(revs.pagination.totalPages)
    } catch {
      // ratings/reviews may not exist yet, that's fine
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (formRating === 0) {
      setFormError("Please select a rating")
      return
    }
    setSubmitting(true)
    setFormError(null)
    try {
      await submitReview(courseId, {
        rating: formRating,
        comment: formComment.trim() || undefined,
      })
      setShowForm(false)
      setFormRating(0)
      setFormComment("")
      setPage(1)
      await loadData()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(reviewId: string) {
    try {
      await deleteMyReview(courseId)
      setPage(1)
      await loadData()
    } catch {
      // silently fail
    }
  }

  return (
    <div className="rounded-xl border border-border-default bg-surface-dark p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">
          Reviews
          {summary?.ratingCount ? (
            <span className="ml-2 text-xs font-normal text-text-secondary">
              ({summary.ratingCount})
            </span>
          ) : null}
        </h3>
        {isEnrolled && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="cursor-pointer rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-medium text-text-on-accent transition-colors hover:bg-accent-500/90"
          >
            Write Review
          </button>
        )}
      </div>

      {summary && (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-2xl font-bold text-text-primary">
            {summary.averageRating?.toFixed(1) ?? "—"}
          </span>
          <RatingStars
            rating={summary.averageRating ?? 0}
            reviewCount={summary.ratingCount}
            size="md"
          />
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 rounded-lg border border-border-default p-4">
          <div className="mb-3">
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">
              Your Rating
            </label>
            <RatingInput
              value={formRating}
              onChange={setFormRating}
              disabled={submitting}
            />
          </div>
          <div className="mb-3">
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">
              Comment (optional)
            </label>
            <textarea
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="Share your thoughts about this course..."
              className="w-full resize-none rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:border-accent-500 focus:outline-none"
              disabled={submitting}
            />
            <p className="mt-1 text-right text-xs text-text-tertiary">
              {formComment.length}/1000
            </p>
          </div>
          {formError && (
            <p className="mb-2 text-xs text-accent-red">{formError}</p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer rounded-lg bg-accent-500 px-4 py-1.5 text-xs font-medium text-text-on-accent transition-colors hover:bg-accent-500/90 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setFormError(null) }}
              disabled={submitting}
              className="cursor-pointer rounded-lg border border-border-default px-4 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-card-hover"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="py-4 text-center text-xs text-text-secondary">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="py-4 text-center text-xs text-text-secondary">
          No reviews yet. {isEnrolled ? "Be the first to review!" : ""}
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-border-default p-3"
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">
                    {review.user.fullName}
                  </span>
                  <RatingStars rating={review.rating} size="sm" />
                </div>
              </div>
              {review.comment && (
                <p className="text-xs leading-relaxed text-text-secondary">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="cursor-pointer rounded-lg border border-border-default px-3 py-1 text-xs text-text-secondary transition-colors hover:bg-surface-card-hover disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-xs text-text-tertiary">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="cursor-pointer rounded-lg border border-border-default px-3 py-1 text-xs text-text-secondary transition-colors hover:bg-surface-card-hover disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
