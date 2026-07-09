"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { ArrowLeft, Plus, GripVertical, FileText, Play, FileQuestion, Trash2 } from "lucide-react";
import { getLessons, createLesson, deleteLesson, reorderLesson } from "@/lib/data/lessons";
import type { Lesson } from "@/types/db";

const typeIcons = { VIDEO: Play, TEXT: FileText, MIXED: FileText, CODE: FileQuestion } as const;

export default function CurriculumPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const fetchLessons = useCallback(async () => {
    try {
      const data = await getLessons(courseId);
      setLessons(data);
    } catch {
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  async function handleAddLesson() {
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      await createLesson(courseId, {
        title: newTitle.trim(),
        contentType: "TEXT",
        orderIndex: lessons.length,
      });
      setNewTitle("");
      await fetchLessons();
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(lessonId: string) {
    try {
      await deleteLesson(lessonId);
      await fetchLessons();
    } catch {}
  }

  async function handleReorder(lessonId: string, newIndex: number) {
    try {
      await reorderLesson(lessonId, newIndex);
      await fetchLessons();
    } catch {}
  }

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/instructor/courses/${courseId}/edit`} className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Course
        </Link>
      </div>

      <PageHeader
        title="Course Curriculum"
        description="Organize your course content into lessons"
      />

      <div className="mb-4 flex items-center gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New lesson title..."
          className="flex-1 rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50"
        />
        <button onClick={handleAddLesson} disabled={adding || !newTitle.trim()} className="cursor-pointer flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-accent-500/90 disabled:opacity-50">
          <Plus className="h-4 w-4" /> {adding ? "Adding..." : "Add Lesson"}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-text-secondary">Loading lessons...</p>
      ) : lessons.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-secondary">No lessons yet. Add your first lesson above.</p>
      ) : (
        <div className="space-y-1">
          {lessons.map((lesson, idx) => {
            const Icon = typeIcons[lesson.contentType as keyof typeof typeIcons] ?? FileText;
            return (
              <GlassCard key={lesson.id}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => idx > 0 && handleReorder(lesson.id, idx - 1)}
                    className="cursor-pointer text-text-secondary hover:text-text-primary"
                    aria-label="Move up"
                  >
                    <GripVertical className="h-3.5 w-3.5" />
                  </button>
                  <Icon className="h-4 w-4 text-accent-500" />
                  <Link
                    href={`/instructor/courses/${courseId}/curriculum/lessons/${lesson.id}`}
                    className="flex-1 text-sm text-text-primary hover:text-accent-500"
                  >
                    {lesson.title}
                  </Link>
                  <span className="rounded bg-surface-card px-2 py-0.5 text-[10px] uppercase text-text-secondary">
                    {lesson.contentType === "VIDEO" ? "Video" : lesson.contentType === "TEXT" ? "Text" : lesson.contentType === "CODE" ? "Code" : "Mixed"}
                  </span>
                  <Link
                    href={`/instructor/courses/${courseId}/curriculum/lessons/${lesson.id}`}
                    className="text-xs text-accent-500 hover:underline"
                  >
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(lesson.id)} className="cursor-pointer text-accent-red hover:text-accent-red/80" aria-label="Delete lesson">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
