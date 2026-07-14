"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, GripVertical, FileText, Play, FileQuestion, Trash2, Code, Globe, EyeOff } from "lucide-react";
import { getLessons, createLesson, deleteLesson, reorderLesson } from "@/lib/data/lessons";
import { getCourseById, publishCourse, unpublishCourse } from "@/lib/data/courses";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { CourseStatus, Lesson, CodeLanguage } from "@/types/db";

const typeIcons = { VIDEO: Play, TEXT: FileText, MIXED: FileText, CODE: Code } as const;

const CONTENT_TYPE_OPTIONS = [
  { value: "TEXT", label: "Text" },
  { value: "VIDEO", label: "Video" },
  { value: "MIXED", label: "Mixed" },
  { value: "CODE", label: "Code" },
] as const;

export default function CurriculumPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<string>("TEXT");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [courseStatus, setCourseStatus] = useState<CourseStatus | null>(null);
  const [publishing, setPublishing] = useState(false);

  const fetchLessons = useCallback(async () => {
    try {
      const [data, course] = await Promise.all([
        getLessons(courseId),
        getCourseById(courseId),
      ]);
      setLessons(data);
      setCourseStatus(course.status);
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
        contentType: newType as "TEXT" | "VIDEO" | "MIXED" | "CODE",
        orderIndex: lessons.length,
      });
      setNewTitle("");
      await fetchLessons();
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteLesson(deleteTarget);
      setDeleteTarget(null);
      await fetchLessons();
    } catch { setDeleteTarget(null) }
    finally { setDeleting(false) }
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      const updated = await publishCourse(courseId);
      setCourseStatus(updated.status);
    } finally {
      setPublishing(false);
    }
  }

  async function handleUnpublish() {
    setPublishing(true);
    try {
      const updated = await unpublishCourse(courseId);
      setCourseStatus(updated.status);
    } finally {
      setPublishing(false);
    }
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
        <Link href={`/instructor/courses/${courseId}/edit`} className="flex items-center gap-1 text-sm text-brand-text-mid hover:text-brand-text">
          <ArrowLeft className="h-4 w-4" /> Back to Course
        </Link>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Course Curriculum</h1>
          <p className="mt-1 text-sm text-brand-text-mid">Organize your course content into lessons</p>
        </div>

        {courseStatus && (
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${courseStatus === "PUBLISHED" ? "text-brand-green" : "text-brand-amber"}`}>
              {courseStatus === "PUBLISHED" ? "Published" : courseStatus === "DRAFT" ? "Draft" : "Unpublished"}
            </span>
            {courseStatus === "PUBLISHED" ? (
              <button
                onClick={handleUnpublish}
                disabled={publishing}
                className="cursor-pointer flex items-center gap-2 rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-brand-text-mid transition-colors hover:text-brand-text disabled:opacity-50"
              >
                <EyeOff className="h-4 w-4" />
                {publishing ? "..." : "Unpublish"}
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="cursor-pointer flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark disabled:opacity-50"
              >
                <Globe className="h-4 w-4" />
                {publishing ? "Publishing..." : "Publish"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New lesson title..."
          className="min-w-0 flex-1 rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text placeholder-text-brand-text-mid outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]"
        />
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]"
        >
          {CONTENT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button onClick={handleAddLesson} disabled={adding || !newTitle.trim()} className="cursor-pointer flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark disabled:opacity-50">
          <Plus className="h-4 w-4" /> {adding ? "Adding..." : "Add Lesson"}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-brand-text-mid">Loading lessons...</p>
      ) : lessons.length === 0 ? (
        <p className="py-8 text-center text-sm text-brand-text-mid">No lessons yet. Add your first lesson above.</p>
      ) : (
        <div className="space-y-1">
          {lessons.map((lesson, idx) => {
            const Icon = typeIcons[lesson.contentType as keyof typeof typeIcons] ?? FileText;
            return (
              <div key={lesson.id} className="rounded-xl border border-brand-border bg-brand-card p-5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => idx > 0 && handleReorder(lesson.id, idx - 1)}
                    className="cursor-pointer text-brand-text-mid hover:text-brand-text"
                    aria-label="Move up"
                  >
                    <GripVertical className="h-3.5 w-3.5" />
                  </button>
                  <Icon className="h-4 w-4 text-brand-green" />
                  <Link
                    href={`/instructor/courses/${courseId}/curriculum/lessons/${lesson.id}`}
                    className="flex-1 text-sm text-brand-text hover:text-brand-green"
                  >
                    {lesson.title}
                  </Link>
                  <span className="rounded bg-brand-card px-2 py-0.5 text-[10px] uppercase text-brand-text-mid">
                    {lesson.contentType === "VIDEO" ? "Video" : lesson.contentType === "TEXT" ? "Text" : lesson.contentType === "CODE" ? "Code" : "Mixed"}
                  </span>
                  {lesson.contentType === "CODE" && lesson.language && (
                    <span className="rounded bg-brand-green-light px-2 py-0.5 text-[10px] font-mono uppercase text-brand-green">
                      {lesson.language}
                    </span>
                  )}
                  <Link
                    href={`/instructor/courses/${courseId}/curriculum/lessons/${lesson.id}`}
                    className="text-xs text-brand-green hover:underline"
                  >
                    Edit
                  </Link>
                  <button onClick={() => setDeleteTarget(lesson.id)} className="cursor-pointer text-accent-red hover:text-accent-red/80" aria-label="Delete lesson">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}
        title="Delete Lesson"
        description="Are you sure you want to delete this lesson? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
