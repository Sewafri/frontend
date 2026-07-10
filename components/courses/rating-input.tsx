"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingInputProps {
  value: number
  onChange: (rating: number) => void
  disabled?: boolean
  size?: "sm" | "md" | "lg"
}

const sizeMap = { sm: 16, md: 20, lg: 28 }

export function RatingInput({
  value,
  onChange,
  disabled,
  size = "md",
}: RatingInputProps) {
  const [hovered, setHovered] = useState(0)
  const starSize = sizeMap[size]

  return (
    <div className="flex items-center gap-0.5" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value)
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={cn(
              "cursor-pointer rounded-sm p-0.5 transition-colors",
              disabled && "cursor-not-allowed opacity-50",
              "hover:scale-110 active:scale-95",
            )}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              size={starSize}
              className={cn(
                "transition-all",
                filled
                  ? "fill-accent-amber text-accent-amber"
                  : "fill-text-tertiary/20 text-text-tertiary/30",
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
