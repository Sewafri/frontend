"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { ArrowLeft, BookOpen, Plus, GripVertical, FileText, Play, FileQuestion } from "lucide-react";

const SECTIONS = [
  {
    title: "Introduction & Setup",
    lessons: [
      { title: "Welcome to the Course", type: "video", duration: "12 min" },
      { title: "Prerequisites & Resources", type: "article", duration: "10 min" },
      { title: "Setting Up Your Environment", type: "video", duration: "15 min" },
    ],
  },
  {
    title: "Core Concepts",
    lessons: [
      { title: "Understanding the Fundamentals", type: "video", duration: "20 min" },
      { title: "Key Principles Explained", type: "article", duration: "15 min" },
      { title: "Practice Exercise", type: "quiz", duration: "30 min" },
    ],
  },
];

const typeIcons = { video: Play, article: FileText, quiz: FileQuestion } as const;

export default function CurriculumPage() {
  const params = useParams();

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/instructor/courses/${params.id}/edit`} className="flex items-center gap-1 text-sm text-text-secondary hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Course
        </Link>
      </div>

      <PageHeader
        title="Course Curriculum"
        description="Organize your course content into sections and lessons"
        actions={
          <button className="cursor-pointer flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90">
            <Plus className="h-4 w-4" /> Add Section
          </button>
        }
      />

      <div className="space-y-4">
        {SECTIONS.map((section, idx) => (
          <GlassCard key={idx}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-text-secondary cursor-grab" />
                <h3 className="text-sm font-semibold text-white">{section.title}</h3>
                <span className="text-xs text-text-secondary">{section.lessons.length} lessons</span>
              </div>
              <button className="cursor-pointer flex items-center gap-1 text-xs text-brand-orange hover:underline">
                <Plus className="h-3.5 w-3.5" /> Add Lesson
              </button>
            </div>

            <div className="space-y-1">
              {section.lessons.map((lesson, lIdx) => {
                const Icon = typeIcons[lesson.type as keyof typeof typeIcons] ?? FileText;
                return (
                  <div key={lIdx} className="flex items-center gap-3 rounded-lg bg-surface-card px-3 py-2.5">
                    <GripVertical className="h-3.5 w-3.5 text-text-secondary cursor-grab" />
                    <Icon className="h-4 w-4 text-brand-orange" />
                    <span className="flex-1 text-sm text-white">{lesson.title}</span>
                    <span className="text-xs text-text-secondary">{lesson.duration}</span>
                    <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] uppercase text-text-secondary">{lesson.type}</span>
                    <Link href={`/instructor/courses/${params.id}/curriculum/lessons/${lIdx + 1}`} className="text-xs text-brand-orange hover:underline">Edit</Link>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
