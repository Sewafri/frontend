import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: 12, md: 14, lg: 18 };

export function RatingStars({ rating, reviewCount, size = "sm" }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7;
  const starSize = sizeMap[size];

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Rating: ${rating.toFixed(1)} out of 5`}>
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={starSize}
            className={cn(
              "transition-colors",
              i < fullStars
                ? "fill-accent-amber text-accent-amber"
                : i === fullStars && hasHalfStar
                  ? "fill-accent-amber/50 text-accent-amber/50"
                  : "fill-text-tertiary/30 text-text-tertiary/30"
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-text-tertiary">
        {rating.toFixed(1)}
        {reviewCount !== undefined && (
          <span className="ml-1 font-normal">({reviewCount.toLocaleString()})</span>
        )}
      </span>
    </div>
  );
}
