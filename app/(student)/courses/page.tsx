"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { PageHeader } from "@/components/ui/page-header";
import { COURSES } from "@/constants/landing";

const ALL_CATEGORIES = [...new Set(COURSES.map((c) => c.category))];

export default function CoursesCatalogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesSearch =
        !search ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !activeCategory || course.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="">
      <PageHeader
        title="Course Catalog"
        description="Browse our full catalog of courses"
      />

      {/* Search + Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full cursor-pointer rounded-lg border border-border-glass bg-surface-dark py-2.5 pl-10 pr-4 text-sm text-white placeholder-text-secondary outline-none focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              !activeCategory
                ? "bg-brand-orange text-white"
                : "bg-surface-card text-text-secondary hover:text-white"
            }`}
          >
            All
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-brand-orange text-white"
                  : "bg-surface-card text-text-secondary hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-glass bg-surface-dark py-20">
          <Search className="mb-3 h-10 w-10 text-text-secondary" />
          <p className="text-lg font-medium text-white">No courses found</p>
          <p className="mt-1 text-sm text-text-secondary">
            Try adjusting your search or filter
          </p>
        </div>
      )}
    </div>
  );
}
