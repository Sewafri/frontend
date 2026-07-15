"use client";

import Link from "next/link";
import { ArrowRight, Star, User } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const COURSES = [
  {
    title: "Web Development Bootcamp",
    category: "Web Development",
    instructor: "Dr. Sarah Chen",
    price: "$49",
    rating: 4.9,
    students: "12.4k",
    hours: "24h",
    img: "https://picsum.photos/seed/webdev-bootcamp/640/340.jpg",
  },
  {
    title: "Data Science Fundamentals",
    category: "Data & AI",
    instructor: "Prof. James Wilson",
    price: "$39",
    rating: 4.8,
    students: "8.9k",
    hours: "18h",
    img: "https://picsum.photos/seed/data-sci-fun/640/340.jpg",
  },
  {
    title: "UI/UX Design Masterclass",
    category: "Design",
    instructor: "Lisa Chen",
    price: "$29",
    rating: 4.9,
    students: "15.6k",
    hours: "12h",
    img: "https://picsum.photos/seed/uiux-master2/640/340.jpg",
  },
  {
    title: "Solidity Smart Contract Development",
    category: "Blockchain",
    instructor: "Dr. Sarah Mitchell",
    price: "$59",
    rating: 4.9,
    students: "6.2k",
    hours: "30h",
    img: "https://picsum.photos/seed/blockchain-sol/640/340.jpg",
  },
];

export function CoursesSection() {
  return (
    <section className="bg-landing-card px-4 py-20 sm:px-6 lg:px-10" id="courses">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <ScrollReveal>
            <div className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] text-landing-green">
              <span className="inline-block h-px w-6 bg-landing-green/40" />
              Featured Courses
            </div>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.625rem)] font-extrabold -tracking-[0.03em] text-landing-text">
              Start with our most popular
            </h2>
          </ScrollReveal>
          <Link
            href="/courses"
            className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-landing-green transition-colors hover:text-landing-green-dark"
          >
            View all courses
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Horizontal scroll */}
        <div
          className="no-scrollbar flex gap-5 overflow-x-auto pb-4"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {COURSES.map((course, i) => (
            <ScrollReveal key={course.title} delay={i * 0.08}>
              <div
                className="min-w-[280px] max-w-[320px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-landing-border bg-landing-bg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ scrollSnapAlign: "start" }}
              >
                {/* Image */}
                <div className="relative h-[160px] overflow-hidden sm:h-[170px]">
                  <img
                    src={course.img}
                    alt={course.title}
                    className="size-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-white/92 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.03em] text-landing-text backdrop-blur-sm">
                    {course.category}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5">
                  <h3 className="text-sm font-bold leading-snug text-landing-text sm:text-base">
                    {course.title}
                  </h3>
                  <div className="mb-3 mt-2 flex items-center gap-1.5 text-xs text-landing-text-light">
                    <User size={12} className="text-landing-green" />
                    {course.instructor}
                  </div>

                  <div className="flex items-center justify-between border-t border-landing-border pt-3.5">
                    <span className="text-xl font-extrabold text-landing-text">{course.price}</span>
                    <div className="flex items-center gap-3 text-xs text-landing-text-light">
                      <span className="flex items-center gap-1 font-bold text-landing-amber">
                        <Star size={13} className="fill-landing-amber text-landing-amber" />
                        {course.rating}
                      </span>
                      <span>{course.students}</span>
                      <span>{course.hours}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
