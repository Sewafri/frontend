"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Clock, Star, Users, ChevronDown, Play, User } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { COURSES } from "@/constants/landing";

const CURRICULUM = [
  {
    title: "Introduction & Setup",
    lessons: ["Welcome to the Course", "Prerequisites", "Setting Up Your Environment"],
    duration: "45 min",
  },
  {
    title: "Core Concepts",
    lessons: ["Understanding the Fundamentals", "Key Principles", "Best Practices"],
    duration: "1.5 hours",
  },
  {
    title: "Hands-On Projects",
    lessons: ["Project 1: Getting Started", "Project 2: Building Real Apps", "Project 3: Advanced Techniques"],
    duration: "3 hours",
  },
  {
    title: "Final Assessment",
    lessons: ["Review & Practice", "Final Exam", "Next Steps"],
    duration: "1 hour",
  },
];

export default function CourseDetailPage() {
  const params = useParams();
  const course = COURSES.find((c) => c.slug === params.slug);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BookOpen className="mb-3 h-12 w-12 text-text-secondary" />
        <h2 className="text-xl font-semibold text-text-primary">Course not found</h2>
        <p className="mt-1 text-sm text-text-secondary">
          This course may have been removed or doesn&apos;t exist.
        </p>
        <Link href="/courses" className="mt-4 text-sm text-brand-orange hover:underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="">
      {/* Hero section */}
      <PageHeader
        title={course.title}
        description={course.description}
      />

      <div className="mb-8 overflow-hidden rounded-xl border border-border-glass bg-gradient-to-br from-neutral-800 to-neutral-700">
        <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center">
          <div className="flex-1">
            <span className="mb-3 inline-block rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-medium text-brand-orange">
              {course.category}
            </span>
            <h1 className="mb-2 text-2xl font-bold text-text-primary lg:text-3xl">{course.title}</h1>
            <p className="mb-4 text-text-secondary">{course.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {course.instructor.name}
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-accent-amber text-accent-amber" />
                {course.rating}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {course.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {course.studentsCount} students
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 lg:items-end">
            <span className="text-3xl font-bold text-brand-orange">
              ${course.price}
            </span>
            <button className="cursor-pointer rounded-lg bg-brand-orange px-8 py-3 font-medium text-text-primary transition-colors hover:bg-brand-orange/90">
              Enroll Now
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Curriculum */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Course Curriculum</h2>
          <div className="space-y-3">
            {CURRICULUM.map((section, i) => (
              <details key={i} className="group rounded-xl border border-border-glass bg-surface-dark">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4">
                  <div>
                    <span className="text-sm font-medium text-text-primary">{section.title}</span>
                    <span className="ml-3 text-xs text-text-secondary">
                      {section.lessons.length} lessons &middot; {section.duration}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-text-secondary transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t border-border-glass px-5 py-3">
                  {section.lessons.map((lesson, j) => (
                    <div key={j} className="flex items-center gap-3 py-2 text-sm">
                      <Play className="h-3.5 w-3.5 text-brand-orange" />
                      <span className="text-text-secondary">{lesson}</span>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="rounded-xl border border-border-glass bg-surface-dark p-5">
            <h3 className="mb-3 text-sm font-semibold text-text-primary">This Course Includes</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <Play className="h-4 w-4 text-brand-orange" /> 20+ hours on-demand video
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brand-orange" /> 15 articles &amp; resources
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-orange" /> Full lifetime access
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-4 w-4 text-brand-orange" /> Certificate of completion
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
