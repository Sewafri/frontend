"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { BackendCourseCard } from "@/components/courses/course-card";
import { PageHeader } from "@/components/ui/page-header";
import { getCourses } from "@/lib/data/courses";
import type { Course } from "@/types/db";

export default function CoursesCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getCourses()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    return [...new Set(courses.map((c) => c.category))];
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        !search ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !activeCategory || course.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, courses]);

  return (
    <div>
      <PageHeader
        title="Course Catalog"
        description="Browse our full catalog of courses"
      />

      {/* Search + Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search courses..."
            aria-label="Search courses"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border-default bg-surface-card py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              !activeCategory
                ? "bg-brand-500 text-text-primary shadow-sm"
                : "bg-surface-card text-text-secondary ring-1 ring-border-default hover:text-text-primary"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-brand-500 text-text-primary shadow-sm"
                  : "bg-surface-card text-text-secondary ring-1 ring-border-default hover:text-text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-text-secondary">Loading courses...</p>
        </div>
      )}

      {/* Course Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <BackendCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-default bg-surface-card py-20">
          <Search className="mb-3 h-10 w-10 text-text-tertiary" />
          <p className="text-lg font-medium text-text-primary">No courses found</p>
          <p className="mt-1 text-sm text-text-secondary">
            Try adjusting your search or filter
          </p>
        </div>
      )}
    </div>
  );
}
