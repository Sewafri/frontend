"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { addToWishlist, removeFromWishlist } from "@/lib/data/wishlist"

interface WishlistCardButtonProps {
  courseId: string
  initialWishlisted?: boolean
}

export function WishlistCardButton({
  courseId,
  initialWishlisted = false,
}: WishlistCardButtonProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted)
  const [loading, setLoading] = useState(false)

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return

    setLoading(true)
    try {
      if (wishlisted) {
        await removeFromWishlist(courseId)
        setWishlisted(false)
      } else {
        await addToWishlist(courseId)
        setWishlisted(true)
      }
    } catch {
      setWishlisted(!wishlisted)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "absolute right-3 top-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-surface-card transition-all hover:scale-110",
        wishlisted
          ? "border-accent-red/30 text-accent-red"
          : "border-border-default text-text-tertiary hover:border-border-strong hover:text-text-primary",
      )}
      aria-label={wishlisted ? "Remove from wishlist" : "Save for later"}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          wishlisted && "fill-accent-red",
        )}
      />
    </button>
  )
}
