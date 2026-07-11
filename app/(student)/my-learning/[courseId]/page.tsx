"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Check, Lock, Play, ArrowLeft, FileQuestion, Sparkles, Loader2, Award } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import ProgressBar from "@/components/ui/progress-bar";
import { getCourseById } from "@/lib/data/courses";
import { getLessons, completeLesson, getCourseProgress } from "@/lib/data/lessons";
import { getCourseQuizzes } from "@/lib/data/quiz";
import { confirmStripeSession } from "@/lib/data/payments";
import type { Course } from "@/types/db";
import type { Lesson } from "@/types/db";
import type { QuizSummary } from "@/lib/data/quiz";
import { ApiError } from "@/lib/api/client";
import { AskTutor } from "@/components/courses/ask-tutor";

export default function CurriculumPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [progressPercent, setProgressPercent] = useState(0);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    async function init() {
      setLoading(true);

      // If returning from Stripe, confirm the session first
      if (sessionId) {
        setConfirming(true);
        setConfirmError(null);
        try {
          await confirmStripeSession(sessionId);
        } catch (err) {
          setConfirmError(
            err instanceof ApiError ? err.message : "Failed to confirm payment",
          );
        } finally {
          setConfirming(false);
        }
      }

      // Load course data
      const [c, l, q, progress] = await Promise.all([
        getCourseById(courseId).catch(() => null),
        getLessons(courseId).catch(() => [] as Lesson[]),
        getCourseQuizzes(courseId).catch(() => [] as QuizSummary[]),
        getCourseProgress(courseId).catch(() => ({
          enrolled: false,
          completedLessonIds: [] as string[],
          progressPercent: 0,
          certificateId: null,
        })),
      ]);

      setCourse(c);
      setLessons(l);
      setQuizzes(q);
      setCompletedIds(new Set(progress.completedLessonIds));
      setProgressPercent(progress.progressPercent);
      setCertificateId(progress.certificateId ?? null);
      setShowWelcome(progress.progressPercent === 0 && l.length > 0);
      setLoading(false);
    }

    init();
  }, [courseId, searchParams]);

  async function handleComplete(lessonId: string) {
    setCompletingId(lessonId);
    try {
      await completeLesson(lessonId);
      setCompletedIds((prev) => new Set(prev).add(lessonId));
      // Refresh progress from server
      const progress = await getCourseProgress(courseId).catch(() => null);
      if (progress) {
        setProgressPercent(progress.progressPercent);
        setCompletedIds(new Set(progress.completedLessonIds));
        setCertificateId(progress.certificateId ?? null);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        console.error("Failed to complete lesson:", err.message);
      }
    } finally {
      setCompletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BookOpen className="mb-3 h-12 w-12 text-text-secondary" />
        <h2 className="text-xl font-semibold text-text-primary">Course not found</h2>
        <p className="mt-1 text-sm text-text-secondary">This course may have been removed.</p>
        <Link href="/my-learning" className="mt-4 text-sm text-accent-500 hover:underline">Back to My Learning</Link>
      </div>
    );
  }

  const displayLessons = lessons.map((l) => ({
    id: l.id,
    title: l.title,
    completed: completedIds.has(l.id),
    type: l.contentType === "VIDEO" ? ("video" as const) : l.contentType === "TEXT" ? ("article" as const) : ("exercise" as const),
  }));

  const completedCount = displayLessons.filter((l) => l.completed).length;
  const displayProgress = progressPercent > 0 ? progressPercent : displayLessons.length > 0
    ? Math.round((completedCount / displayLessons.length) * 100)
    : 0;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/my-learning" className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> My Learning
        </Link>
      </div>

      {/* Confirming payment after Stripe redirect */}
      {confirming && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-accent-500/20 bg-accent-500/5 p-4">
          <Loader2 className="h-5 w-5 animate-spin text-accent-500" />
          <p className="text-sm text-text-primary">Confirming your payment...</p>
        </div>
      )}
      {confirmError && (
        <div className="mb-6 rounded-xl border border-accent-red/20 bg-accent-red/5 p-4">
          <p className="text-sm text-accent-red">{confirmError}</p>
        </div>
      )}

      {showWelcome && (
        <div className="mb-6 overflow-hidden rounded-xl border border-accent-500/20 bg-gradient-to-r from-accent-500/5 to-transparent p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-500/10">
              <Sparkles className="h-6 w-6 text-accent-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Welcome to {course.title}!
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                You&apos;re enrolled and ready to go. Start with the first lesson below, and work your way through the curriculum at your own pace.
              </p>
            </div>
          </div>
        </div>
      )}

      <PageHeader
        title={course.title}
        description="Course curriculum and progress"
      />

      {displayLessons.length === 0 ? (
        <GlassCard>
          <p className="py-6 text-center text-sm text-text-secondary">No lessons available yet.</p>
        </GlassCard>
      ) : (
        <>
          <GlassCard className="mb-8">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/10">
                <BookOpen className="h-7 w-7 text-accent-500" />
              </div>
              <div className="flex-1">
                <ProgressBar value={displayProgress} label="Course Progress" className="max-w-md" />
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-text-primary">{completedCount}</span>
                <span className="text-xs text-text-secondary"> / {displayLessons.length} lessons</span>
              </div>
            </div>
          </GlassCard>

          {/* Certificate banner — shown when course is 100% complete */}
          {displayProgress === 100 && certificateId && (
            <div className="mb-6 overflow-hidden rounded-xl border border-accent-green/20 bg-accent-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-green/10">
                  <Award className="h-6 w-6 text-accent-green" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-text-primary">
                    Course Complete!
                  </h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    You&apos;ve completed all the lessons. Claim your on-chain certificate.
                  </p>
                </div>
                <Link
                  href={`/certificates/${certificateId}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-medium text-text-on-accent transition-colors hover:bg-accent-500/90"
                >
                  <Award className="h-4 w-4" />
                  View Certificate
                </Link>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {displayLessons.map((lesson, i) => (
              <Link
                key={lesson.id}
                href={`/my-learning/${courseId}/lessons/${lesson.id}`}
                className={`flex items-center gap-4 rounded-xl border px-5 py-4 transition-colors ${
                  lesson.completed
                    ? "border-accent-green/20 bg-accent-green/5"
                    : i === completedCount
                      ? "border-accent-500/30 bg-accent-500/5"
                      : "border-border-default bg-surface-dark"
                }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  lesson.completed
                    ? "bg-accent-green/10"
                    : i === completedCount
                      ? "bg-accent-500/10"
                      : "bg-surface-card"
                }`}>
                  {lesson.completed ? (
                    <Check className="h-4 w-4 text-accent-green" />
                  ) : i === completedCount ? (
                    <Play className="h-4 w-4 text-accent-500" />
                  ) : (
                    <Lock className="h-4 w-4 text-text-secondary" />
                  )}
                </div>

                <div className="flex-1">
                  <span className={`text-sm font-medium ${
                    lesson.completed ? "text-accent-green" : "text-text-primary"
                  }`}>
                    {lesson.title}
                  </span>
                </div>

                <span className="rounded-full bg-surface-card px-2.5 py-0.5 text-[10px] font-medium uppercase text-text-secondary">
                  {lesson.type}
                </span>

                {i === completedCount && !lesson.completed && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleComplete(lesson.id);
                    }}
                    disabled={completingId === lesson.id}
                    className="cursor-pointer rounded-lg bg-accent-500 px-4 py-1.5 text-xs font-medium text-text-on-accent transition-colors hover:bg-accent-500/90 disabled:opacity-50"
                  >
                    {completingId === lesson.id ? "..." : "Complete"}
                  </button>
                )}
              </Link>
            ))}
          </div>

          {quizzes.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-text-primary">Quizzes</h2>
              <div className="space-y-2">
                {quizzes.map((quiz) => (
                  <Link
                    key={quiz.id}
                    href={`/my-learning/${courseId}/quiz/${quiz.id}`}
                    className="flex items-center gap-4 rounded-xl border border-border-default bg-surface-dark px-5 py-4 transition-colors hover:border-accent-500/30"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/10">
                      <FileQuestion className="h-4 w-4 text-accent-500" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-text-primary">{quiz.title}</span>
                      <p className="text-xs text-text-tertiary">
                        {quiz._count.questions} questions · {quiz.passingScore}% to pass
                        {quiz.isFinalAssessment && " · Final Assessment"}
                      </p>
                    </div>
                    <span className="text-xs text-text-tertiary">
                      {quiz.maxAttempts > 0 ? `Up to ${quiz.maxAttempts} attempts` : "Unlimited"}
                    </span>
                    <span className="rounded-full bg-surface-card px-2.5 py-0.5 text-[10px] font-medium uppercase text-text-secondary">
                      Quiz
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {course && <AskTutor courseId={courseId} courseTitle={course.title} />}
    </div>
  );
}
