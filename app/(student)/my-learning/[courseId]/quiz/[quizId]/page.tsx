"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, XCircle, Award, AlertTriangle, Clock, ShieldAlert,
  FileQuestion, Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import {
  submitQuiz, getQuizQuestions, startQuizAttempt,
} from "@/lib/data/quiz";
import { useQuizIntegrity } from "@/hooks/use-quiz-integrity";
import { SessionIndicator } from "@/components/quiz/session-indicator";
import { ApiError } from "@/lib/api/client";
import type { QuizSession } from "@/types/db";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;
  const courseId = params.courseId as string;

  const [session, setSession] = useState<QuizSession | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    certificate?: { id: string; courseTitle: string };
    attemptsRemaining?: number;
    alreadyIssued?: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [maxedOut, setMaxedOut] = useState(false);

  const integrity = useQuizIntegrity({
    quizId,
    studentName: "Student",
    requireFullscreen: session?.requireFullscreen ?? true,
    enabled: !submitted,
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getQuizQuestions(quizId);
        setSession(data);

        if (data.attemptsUsed >= data.maxAttempts) {
          setMaxedOut(true);
          setPageLoading(false);
          return;
        }

        if (data.requireFullscreen) {
          await integrity.enterFullscreen();
        }

        const started = await startQuizAttempt(quizId);
        setAttemptId(started.attemptId);
      } catch (err) {
        if (err instanceof ApiError) {
          if (
            err.message.includes("Maximum attempts") ||
            err.message.includes("exhausted")
          ) {
            setMaxedOut(true);
          } else {
            setError(err.message);
          }
        } else {
          setError("Failed to load quiz");
        }
      } finally {
        setPageLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const handleSelect = useCallback(
    (questionId: string, optionId: string) => {
      if (submitted) return;
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    },
    [submitted],
  );

  const handleSubmit = useCallback(async () => {
    if (!session) return;
    setSubmitting(true);
    setError(null);
    try {
      const attempt = await submitQuiz(quizId, answers, {
        integrityReport: integrity.report as unknown as Record<string, unknown>,
        attemptId: attemptId ?? undefined,
      });
      setResult({
        score: attempt.score,
        passed: attempt.passed,
        certificate: (attempt as any).certificate
          ? {
              id: (attempt as any).certificate.id,
              courseTitle: (attempt as any).certificate.courseTitle ?? session.title,
            }
          : undefined,
        attemptsRemaining: (attempt as any).attemptsRemaining,
        alreadyIssued: (attempt as any).alreadyIssued,
      });
      setSubmitted(true);
      integrity.cleanup();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to submit quiz");
      }
    } finally {
      setSubmitting(false);
    }
  }, [session, quizId, answers, attemptId, integrity]);

  const allAnswered = session
    ? Object.keys(answers).length >= session.questions.length
    : false;

  if (pageLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
      </div>
    );
  }

  if (maxedOut) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-3">
          <Link href={`/my-learning/${courseId}`} className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Curriculum
          </Link>
        </div>
        <div className="flex flex-col items-center py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-red/10">
            <XCircle className="h-8 w-8 text-accent-red" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Maximum Attempts Reached</h2>
          <p className="mt-1 text-sm text-text-secondary">
            You have used all {session?.maxAttempts} allowed attempts for this quiz.
          </p>
          <Link
            href={`/my-learning/${courseId}`}
            className="mt-6 rounded-lg bg-accent-500 px-6 py-2 text-sm font-medium text-text-on-accent"
          >
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-3">
          <Link href={`/my-learning/${courseId}`} className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Curriculum
          </Link>
        </div>
        <PageHeader title="Quiz Unavailable" description={error} />
      </div>
    );
  }

  if (integrity.tabConflict) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-3">
          <Link href={`/my-learning/${courseId}`} className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Curriculum
          </Link>
        </div>
        <PageHeader
          title="Quiz Already Open"
          description="This quiz is already open in another tab. Close the other tab and reload."
        />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div ref={integrity.containerRef}>
      <SessionIndicator studentName={session.title} compact />

      {integrity.isFullscreenRequired && !integrity.isFullscreen && !submitted && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-accent-yellow/30 bg-accent-yellow/5 px-4 py-2.5 text-sm text-accent-yellow">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>Fullscreen mode required. Please enter fullscreen to continue.</span>
          <button
            onClick={integrity.enterFullscreen}
            className="ml-auto cursor-pointer rounded-md bg-accent-yellow/10 px-3 py-1 text-xs font-medium underline-offset-2 hover:underline"
          >
            Enter Fullscreen
          </button>
        </div>
      )}

      {integrity.warning?.visible && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-accent-red/30 bg-accent-red/5 px-4 py-2.5 text-sm text-accent-red">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1">
            {integrity.warning.type === "tab-switch"
              ? `Tab switch detected (${integrity.warning.count}). This is being recorded.`
              : "Fullscreen exit detected. This is being recorded."}
          </div>
          <button
            onClick={integrity.dismissWarning}
            className="cursor-pointer text-xs underline-offset-2 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/my-learning/${courseId}`}
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
          onClick={(e) => {
            if (!submitted) {
              e.preventDefault();
              if (confirm("Leave the quiz? Your progress will not be saved.")) {
                integrity.cleanup();
                router.push(`/my-learning/${courseId}`);
              }
            }
          }}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Curriculum
        </Link>
        {session.durationMinutes && (
          <div className="ml-auto flex items-center gap-1.5 text-xs text-text-tertiary">
            <Clock className="h-3.5 w-3.5" />
            <span>{session.durationMinutes} min</span>
          </div>
        )}
        <span className="ml-2 text-xs text-text-tertiary">
          Attempt {session.attemptsUsed + 1} of {session.maxAttempts}
        </span>
      </div>

      {!submitted ? (
        <>
          <PageHeader
            title={session.title}
            description={`${session.questions.length} questions · ${session.passingScore}% to pass`}
          />

          {error && (
            <div className="mb-4 rounded-lg bg-accent-red/10 p-3 text-sm text-accent-red">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {session.questions.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-lg border border-border-default bg-surface-card p-5"
              >
                <h3 className="mb-3 text-sm font-medium text-text-primary">
                  {idx + 1}. {q.text}
                  {q.points > 1 && (
                    <span className="ml-1.5 text-xs text-text-tertiary">
                      ({q.points} pts)
                    </span>
                  )}
                </h3>
                <div className="space-y-2">
                  {q.answerOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(q.id, option.id)}
                      className={`w-full cursor-pointer rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${
                        answers[q.id] === option.id
                          ? "border-accent-500 bg-accent-500/10 text-text-primary"
                          : "border-border-default text-text-secondary hover:bg-surface-hover"
                      }`}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <span className="text-xs text-text-tertiary">
              {Object.keys(answers).length} of {session.questions.length} answered
            </span>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="cursor-pointer rounded-lg bg-accent-500 px-8 py-3 font-medium text-text-on-accent transition-colors hover:bg-accent-500/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center py-10">
          <div
            className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
              result?.passed
                ? "bg-accent-500/10"
                : "bg-accent-red/10"
            }`}
          >
            {result?.passed ? (
              <Award className="h-10 w-10 text-accent-500" />
            ) : (
              <XCircle className="h-10 w-10 text-accent-red" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-text-primary">
            {result?.passed ? "Quiz Passed!" : "Keep Learning!"}
          </h2>
          <p className="mt-1 text-text-secondary">
            You scored {result?.score} out of 100
            {session.passingScore > 0 &&
              ` · ${result?.passed ? "Above" : "Below"} ${session.passingScore}% passing threshold`}
          </p>

          {/* Certificate issued */}
          {result?.passed && result.certificate && (
            <div className="mt-6 w-full max-w-sm rounded-lg border border-accent-500/20 bg-accent-500/5 p-4 text-center">
              <Award className="mx-auto mb-2 h-8 w-8 text-accent-500" />
              <p className="text-sm font-semibold text-text-primary">
                {result.alreadyIssued
                  ? "Certificate Already Issued"
                  : "Certificate Generated!"}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {result.certificate.courseTitle}
              </p>
              <Link
                href={`/certificates/${result.certificate.id}`}
                className="mt-3 inline-block rounded-lg bg-accent-500 px-5 py-2 text-sm font-medium text-text-on-accent hover:bg-accent-500/90"
              >
                View Certificate
              </Link>
            </div>
          )}

          <div className="mt-6 flex gap-4">
            {!result?.passed && (result?.attemptsRemaining ?? 0) > 0 && (
              <button
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                  setResult(null);
                  setError(null);
                }}
                className="cursor-pointer rounded-lg border border-border-default px-6 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover"
              >
                Retry ({result?.attemptsRemaining} left)
              </button>
            )}
            <Link
              href={`/my-learning/${courseId}`}
              className="rounded-lg bg-accent-500 px-6 py-2 text-sm font-medium text-text-on-accent transition-colors hover:bg-accent-500/90"
            >
              Back to Course
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
