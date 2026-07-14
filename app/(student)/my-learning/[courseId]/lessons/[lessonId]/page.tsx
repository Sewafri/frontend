"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import LessonContent from "@/components/lessons/lesson-content";
import { getLesson, completeLesson } from "@/lib/data/lessons";
import { LessonResources } from "@/components/lessons/lesson-resources";
import { ApiError } from "@/lib/api/client";
import type { Lesson } from "@/types/db";

export default function LessonViewerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getLesson(lessonId, courseId)
      .then(setLesson)
      .catch((err) => {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load lesson");
        }
      })
      .finally(() => setLoading(false));
  }, [lessonId]);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await completeLesson(lessonId);
      router.push(`/my-learning/${courseId}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-3">
          <Link
            href={`/my-learning/${courseId}`}
            className="flex items-center gap-1 text-sm text-brand-text-mid hover:text-brand-text"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Curriculum
          </Link>
        </div>
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Lesson Unavailable</h1>
          <p className="mt-1 text-sm text-brand-text-mid">{
            error.includes("not found")
              ? "This lesson content endpoint is not yet available. Please check back later."
              : error
          }</p>
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/my-learning/${courseId}`}
          className="flex items-center gap-1 text-sm text-brand-text-mid hover:text-brand-text"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Curriculum
        </Link>
      </div>

      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">{lesson.title}</h1>
        <p className="mt-1 text-sm text-brand-text-mid">{
          lesson.contentType === "VIDEO"
            ? "Video Lesson"
            : lesson.contentType === "CODE"
              ? "Coding Exercise"
              : lesson.contentType === "MIXED"
                ? "Mixed Content"
                : "Lesson"
        }</p>
      </div>

      <LessonContent
        lesson={lesson}
        onComplete={handleComplete}
        completing={completing}
      />

      {error && (
        <div className="mt-4 rounded-lg bg-accent-red/10 p-3 text-sm text-accent-red">
          {error}
        </div>
      )}

      <div className="mt-8">
        <LessonResources lessonId={lessonId} />
      </div>
    </div>
  );
}
