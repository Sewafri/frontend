"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart, BookOpen, Users } from "lucide-react";
import type { Course } from "@/types/db";

const CATEGORY_GRADIENTS: Record<string, string> = {
  Blockchain: "from-brand-green to-brand-green-dark",
  "Web Dev": "from-brand-green-mid to-brand-green-dark",
  "Web Development": "from-brand-green-mid to-brand-green-dark",
  "Data Science": "from-brand-green to-brand-green-dark",
  Design: "from-brand-amber to-brand-amber-dark",
  DeFI: "from-brand-green to-brand-green-dark",
  "AI / ML": "from-brand-green-mid to-brand-green-dark",
  "AI/ML": "from-brand-green-mid to-brand-green-dark",
  Mobile: "from-brand-amber to-brand-amber-dark",
};

const CATEGORY_BG: Record<string, string> = {
  Blockchain: "bg-brand-green-light text-brand-green",
  "Web Dev": "bg-brand-green-light text-brand-green",
  "Web Development": "bg-brand-green-light text-brand-green",
  "Data Science": "bg-brand-green-light text-brand-green",
  Design: "bg-brand-amber-light text-brand-amber-dark",
  DeFI: "bg-brand-green-light text-brand-green",
  "AI / ML": "bg-brand-green-light text-brand-green",
  "AI/ML": "bg-brand-green-light text-brand-green",
  Mobile: "bg-brand-amber-light text-brand-amber-dark",
};

interface CatalogCardProps {
  course: Course;
  index?: number;
}

function getCategoryStyle(category: string) {
  const bg = CATEGORY_BG[category] ?? "bg-brand-green-light text-brand-green";
  const grad = CATEGORY_GRADIENTS[category] ?? "from-brand-green to-brand-green-dark";
  return { bg, grad };
}

export function CatalogCard({ course, index = 0 }: CatalogCardProps) {
  const [liked, setLiked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked((prev) => !prev);
  }, []);

  const displayPrice =
    course.pricingModel === "FREE"
      ? "Free"
      : course.currency === "XAF"
        ? `${Number(course.price).toLocaleString()} FCFA`
        : `$${Number(course.price).toFixed(2)}`;

  const instructorName = course.instructor?.fullName ?? "Instructor";
  const { bg: catBg, grad } = getCategoryStyle(course.category);

  return (
    <div
      ref={cardRef}
      className={`group cursor-pointer rounded-xl bg-brand-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionProperty: "opacity, transform, box-shadow", transitionDuration: "0.45s", transitionDelay: `${Math.min(index * 0.05, 0.4)}s`, transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      <Link href={`/courses/${course.id}`} className="block">
        {/* Image container — 4:3 aspect ratio */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-brand-bg">
          {course.coverImageUrl ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-brand-border/30">
                  <BookOpen className="h-10 w-10 text-brand-text-light/30" />
                </div>
              )}
              <Image
                src={course.coverImageUrl}
                alt={course.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImgLoaded(true)}
              />
            </>
          ) : (
            <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${grad}`}>
              <BookOpen className="h-14 w-14 text-white/40" />
            </div>
          )}

          {/* Heart / favourite button */}
          <button
            onClick={handleLike}
            className={`absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full border-0 backdrop-blur-sm transition-all hover:scale-110 ${
              liked ? "bg-white shadow-md" : "bg-white/80 shadow-sm"
            }`}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={16}
              className={`transition-all duration-200 ${
                liked ? "fill-red-500 text-red-500" : "text-brand-text-light"
              }`}
            />
          </button>

          {/* Category badge */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] shadow-sm ${catBg}`}>
              {course.category}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4">
          {/* Title + rating */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-brand-text transition-colors group-hover:text-brand-green">
              {course.title}
            </h3>
          </div>

          {/* Instructor */}
          <p className="mt-1.5 text-xs font-medium text-brand-text-mid">
            {instructorName}
          </p>

          {/* Meta tags (skill tags as mini badges) */}
          {course.skillTags && course.skillTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {course.skillTags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-brand-bg px-2 py-0.5 text-[10px] font-medium text-brand-text-light"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom row */}
          <div className="mt-3 flex items-center justify-between border-t border-brand-border pt-3">
            <span className="text-sm font-bold text-brand-text">
              {displayPrice}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
