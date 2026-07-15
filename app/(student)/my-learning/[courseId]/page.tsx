"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Check, Lock, Play, ArrowLeft, FileQuestion, Sparkles, Loader2, Award, MessageSquare } from "lucide-react";
import ProgressBar from "@/components/ui/progress-bar";
import { getCourseById } from "@/lib/data/courses";
import { getLessons, completeLesson, getCourseProgress, getResumeLesson } from "@/lib/data/lessons";
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
  const [resumeLessonId, setResumeLessonId] = useState<string | null>(null);

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
      const [c, l, q, progress, resume] = await Promise.all([
        getCourseById(courseId).catch(() => null),
        getLessons(courseId).catch(() => [] as Lesson[]),
        getCourseQuizzes(courseId).catch(() => [] as QuizSummary[]),
        getCourseProgress(courseId).catch(() => ({
          enrolled: false,
          completedLessonIds: [] as string[],
          progressPercent: 0,
          certificateId: null,
        })),
        getResumeLesson(courseId).catch(() => ({ lessonId: null })),
      ]);

      setCourse(c);
      setLessons(l);
      setQuizzes(q);
      setCompletedIds(new Set(progress.completedLessonIds));
      setProgressPercent(progress.progressPercent);
      setCertificateId(progress.certificateId ?? null);
      setShowWelcome(progress.progressPercent === 0 && l.length > 0);
      setResumeLessonId(resume.lessonId ?? null);
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
        <p className="text-sm text-brand-text-mid">Loading...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BookOpen className="mb-3 h-12 w-12 text-brand-text-mid" />
        <h2 className="text-xl font-semibold text-brand-text">Course not found</h2>
        <p className="mt-1 text-sm text-brand-text-mid">This course may have been removed.</p>
        <Link href="/my-learning" className="mt-4 text-sm text-brand-green hover:underline">Back to My Learning</Link>
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
        <Link href="/my-learning" className="flex items-center gap-1 text-sm text-brand-text-mid hover:text-brand-text">
          <ArrowLeft className="h-4 w-4" /> My Learning
        </Link>
      </div>

      {/* Confirming payment after Stripe redirect */}
      {confirming && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-brand-green/20 bg-brand-green-light/40 p-4">
          <Loader2 className="h-5 w-5 animate-spin text-brand-text-light" />
          <p className="text-sm text-brand-text">Confirming your payment...</p>
        </div>
      )}
      {confirmError && (
        <div className="mb-6 rounded-xl border border-accent-red/20 bg-accent-red/5 p-4">
          <p className="text-sm text-accent-red">{confirmError}</p>
        </div>
      )}

      {showWelcome && (
        <div className="mb-6 overflow-hidden rounded-xl border border-brand-green/20 bg-gradient-to-r from-brand-green-light/40 to-transparent p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green-light">
              <Sparkles className="h-6 w-6 text-brand-green" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-brand-text">
                Welcome to {course.title}!
              </h2>
              <p className="mt-1 text-sm text-brand-text-mid">
                You&apos;re enrolled and ready to go. Start with the first lesson below, and work your way through the curriculum at your own pace.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">{course.title}</h1>
        <p className="mt-1 text-sm text-brand-text-mid">Course curriculum and progress</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {resumeLessonId && displayProgress > 0 && displayProgress < 100 && (
            <Link
              href={`/my-learning/${courseId}/lessons/${resumeLessonId}`}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark"
            >
              <Play className="h-4 w-4" />
              Continue Learning
            </Link>
          )}
          <Link
            href={`/forum/c/${courseId}`}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-border bg-brand-card px-4 py-2 text-sm font-medium text-brand-text transition-colors hover:border-brand-green/30 hover:text-brand-green"
          >
            <MessageSquare className="h-4 w-4" />
            Course Forum
          </Link>
        </div>
      </div>

      {displayLessons.length === 0 ? (
        <div className="rounded-xl border border-brand-border bg-brand-card p-5">
          <p className="py-6 text-center text-sm text-brand-text-mid">No lessons available yet.</p>
        </div>
      ) : (
        <>
          <div className="mb-8 rounded-xl border border-brand-border bg-brand-card p-5">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-light">
                <BookOpen className="h-7 w-7 text-brand-green" />
              </div>
              <div className="flex-1">
                <ProgressBar value={displayProgress} label="Course Progress" className="max-w-md" />
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-brand-text">{completedCount}</span>
                <span className="text-xs text-brand-text-mid"> / {displayLessons.length} lessons</span>
              </div>
            </div>
          </div>

          {/* Certificate banner — shown when course is 100% complete */}
          {displayProgress === 100 && certificateId && (
            <div className="mb-6 overflow-hidden rounded-xl border border-brand-green/20 bg-brand-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/10">
                  <Award className="h-6 w-6 text-brand-green" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-brand-text">
                    Course Complete!
                  </h2>
                  <p className="mt-1 text-sm text-brand-text-mid">
                    You&apos;ve completed all the lessons. Claim your on-chain certificate.
                  </p>
                </div>
                <Link
                  href={`/certificates/${certificateId}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark"
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
                    ? "border-brand-green/20 bg-brand-green/5"
                    : i === completedCount
                      ? "border-brand-green/30 bg-brand-green-light/40"
                      : "border-brand-border bg-brand-bg"
                }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  lesson.completed
                    ? "bg-brand-green/10"
                    : i === completedCount
                      ? "bg-brand-green-light"
                      : "bg-brand-card"
                }`}>
                  {lesson.completed ? (
                    <Check className="h-4 w-4 text-brand-green" />
                  ) : i === completedCount ? (
                    <Play className="h-4 w-4 text-brand-green" />
                  ) : (
                    <Lock className="h-4 w-4 text-brand-text-mid" />
                  )}
                </div>

                <div className="flex-1">
                  <span className={`text-sm font-medium ${
                    lesson.completed ? "text-brand-green" : "text-brand-text"
                  }`}>
                    {lesson.title}
                  </span>
                </div>

                <span className="rounded-full bg-brand-card px-2.5 py-0.5 text-[10px] font-medium uppercase text-brand-text-mid">
                  {lesson.type}
                </span>

                {i === completedCount && !lesson.completed && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleComplete(lesson.id);
                    }}
                    disabled={completingId === lesson.id}
                    className="cursor-pointer rounded-lg bg-brand-green px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-green-dark disabled:opacity-50"
                  >
                    {completingId === lesson.id ? "..." : "Complete"}
                  </button>
                )}
              </Link>
            ))}
          </div>

          {quizzes.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-brand-text">Quizzes</h2>
              <div className="space-y-2">
                {quizzes.map((quiz) => (
                  <Link
                    key={quiz.id}
                    href={`/my-learning/${courseId}/quiz/${quiz.id}`}
                    className="flex items-center gap-4 rounded-xl border border-brand-border bg-brand-bg px-5 py-4 transition-colors hover:border-brand-green/30"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green-light">
                      <FileQuestion className="h-4 w-4 text-brand-green" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-brand-text">{quiz.title}</span>
                      <p className="text-xs text-brand-text-light">
                        {quiz._count.questions} questions · {quiz.passingScore}% to pass
                        {quiz.isFinalAssessment && " · Final Assessment"}
                      </p>
                    </div>
                    <span className="text-xs text-brand-text-light">
                      {quiz.maxAttempts > 0 ? `Up to ${quiz.maxAttempts} attempts` : "Unlimited"}
                    </span>
                    <span className="rounded-full bg-brand-card px-2.5 py-0.5 text-[10px] font-medium uppercase text-brand-text-mid">
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
