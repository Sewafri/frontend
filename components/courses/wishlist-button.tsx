"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { addToWishlist, removeFromWishlist } from "@/lib/data/wishlist"
import { ApiError } from "@/lib/api/client"

interface WishlistButtonProps {
  courseId: string
  isWishlisted?: boolean
  onToggle?: (nowWishlisted: boolean) => void
  variant?: "icon" | "button"
  size?: "sm" | "md"
}

export function WishlistButton({
  courseId,
  isWishlisted: initialWishlisted = false,
  onToggle,
  variant = "icon",
  size = "md",
}: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setWishlisted(initialWishlisted)
  }, [initialWishlisted])

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return

    setLoading(true)
    try {
      if (wishlisted) {
        await removeFromWishlist(courseId)
        setWishlisted(false)
        onToggle?.(false)
      } else {
        await addToWishlist(courseId)
        setWishlisted(true)
        onToggle?.(true)
      }
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 409) {
        setWishlisted(true)
        onToggle?.(true)
      }
    } finally {
      setLoading(false)
    }
  }

  if (variant === "button") {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
          wishlisted
            ? "border-accent-red/30 bg-accent-red/5 text-accent-red"
            : "border-border-default text-text-secondary hover:border-border-strong",
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            wishlisted && "fill-accent-red text-accent-red",
          )}
        />
        {wishlisted ? "Saved" : "Save for Later"}
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-lg p-2 transition-colors",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        wishlisted
          ? "text-accent-red hover:bg-accent-red/5"
          : "text-text-tertiary hover:bg-surface-card-hover hover:text-text-primary",
      )}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
          "transition-all",
          wishlisted && "fill-accent-red",
        )}
      />
    </button>
  )
}
