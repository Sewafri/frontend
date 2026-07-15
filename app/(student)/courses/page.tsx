"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CatalogCard } from "@/components/courses/catalog-card";
import { getCourses } from "@/lib/data/courses";
import type { Course } from "@/types/db";

const CATEGORIES = [
  "All",
  "Blockchain",
  "Web Development",
  "Data Science",
  "Design",
  "DeFI",
  "AI / ML",
  "Mobile",
];

export default function CoursesCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    getCourses()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  // Derive available categories from actual data (intersect with our defined list)
  const availableCategories = useMemo(() => {
    const dataCats = new Set(courses.map((c) => c.category));
    return CATEGORIES.filter((c) => c === "All" || dataCats.has(c));
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        !search ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.category.toLowerCase().includes(search.toLowerCase()) ||
        (course.instructor?.fullName?.toLowerCase() ?? "").includes(
          search.toLowerCase(),
        ) ||
        course.skillTags?.some((t) =>
          t.toLowerCase().includes(search.toLowerCase()),
        );
      const matchesCategory =
        activeCategory === "All" || course.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, courses]);

  const handleReset = useCallback(() => {
    setSearch("");
    setActiveCategory("All");
  }, []);

  const hasActiveFilters = search || activeCategory !== "All";

  return (
    <div>
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold -tracking-[0.03em] text-brand-text sm:text-3xl">
          Course Catalog
        </h1>
        <p className="mt-1 text-sm text-brand-text-light">
          Browse our full catalog of courses
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-7 space-y-4">
        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-brand-border bg-brand-card px-4 py-2.5 text-sm transition-all focus-within:border-brand-green focus-within:shadow-[0_0_0_3px_rgba(10,124,66,0.08)] sm:max-w-sm">
            <Search size={17} className="shrink-0 text-brand-text-light" />
            <input
              type="text"
              placeholder="Search courses, topics, instructors..."
              aria-label="Search courses"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-0 bg-transparent text-brand-text outline-none placeholder:text-brand-text-light/60"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="flex shrink-0 items-center justify-center rounded-md p-0.5 text-brand-text-light transition-colors hover:text-brand-text"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Mobile filter button (shows on small screens) */}
          <button
            className="flex shrink-0 items-center justify-center rounded-xl border border-brand-border bg-brand-card p-2.5 text-brand-text-light transition-all hover:border-brand-green hover:text-brand-green sm:hidden"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal size={17} />
          </button>
        </div>

        {/* Category filter pills + count */}
        <div className="flex items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? "border-brand-green bg-brand-green text-white shadow-sm"
                    : "border-brand-border bg-brand-card text-brand-text-mid hover:border-brand-green/40 hover:text-brand-green"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="ml-auto hidden shrink-0 items-center gap-1 text-xs text-brand-text-light sm:flex">
            <strong className="text-sm font-bold text-brand-text">
              {filtered.length}
            </strong>
            {filtered.length === 1 ? "course" : "courses"}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-28">
          <div className="flex items-center gap-3">
            <div className="size-1.5 animate-bounce rounded-full bg-brand-green [animation-delay:0ms]" />
            <div className="size-1.5 animate-bounce rounded-full bg-brand-amber [animation-delay:150ms]" />
            <div className="size-1.5 animate-bounce rounded-full bg-brand-green [animation-delay:300ms]" />
          </div>
          <p className="mt-4 text-sm text-brand-text-light">Loading courses...</p>
        </div>
      )}

      {/* Course Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {filtered.map((course, i) => (
            <CatalogCard key={course.id} course={course} index={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-border bg-brand-card py-28">
          <div className="flex size-14 items-center justify-center rounded-xl bg-brand-green-light">
            <Search size={24} className="text-brand-green" />
          </div>
          <h3 className="mt-5 text-base font-bold text-brand-text">
            {hasActiveFilters ? "No courses found" : "No courses available"}
          </h3>
          <p className="mt-1.5 text-sm text-brand-text-light">
            {hasActiveFilters
              ? "Try adjusting your search or filter to find what you're looking for."
              : "Courses will appear here once they're published."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="mt-5 cursor-pointer rounded-lg bg-brand-green px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-brand-green-dark active:scale-[0.97]"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Mobile course count footer */}
      {!loading && filtered.length > 0 && (
        <div className="mt-5 flex items-center justify-center text-xs text-brand-text-light sm:hidden">
          <strong className="text-sm font-bold text-brand-text">
            {filtered.length}
          </strong>
          &nbsp;{filtered.length === 1 ? "course" : "courses"}
        </div>
      )}
    </div>
  );
}
