"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, XCircle, Award } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { submitQuiz } from "@/lib/data/quiz";
import { ApiError } from "@/lib/api/client";

// MOCK: quiz questions — no GET /quizzes/:id endpoint exists (see MIGRATION.md)
// Questions are hardcoded here. Only the submit action is wired to the real API.
const QUIZ_DATA = {
  title: "Module Assessment",
  questions: [
    { id: "q1", text: "What is the primary benefit of using TypeScript over JavaScript?", options: ["Faster runtime performance", "Static type checking", "Smaller bundle sizes", "Better browser compatibility"], correct: 1 },
    { id: "q2", text: "Which hook is used for side effects in React?", options: ["useState", "useEffect", "useContext", "useReducer"], correct: 1 },
    { id: "q3", text: "What does CSS stand for?", options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"], correct: 2 },
    { id: "q4", text: "Which HTTP method is used to update a resource?", options: ["GET", "DELETE", "POST", "PUT"], correct: 3 },
    { id: "q5", text: "What is the virtual DOM?", options: ["A direct copy of the browser DOM", "A lightweight representation of the DOM in memory", "A database for storing DOM elements", "A CSS framework for styling"], correct: 1 },
  ],
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: String(optionIndex) }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const attempt = await submitQuiz(quizId, answers);
      setResult({ score: attempt.score, passed: attempt.passed });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to submit quiz");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Fallback local scoring if the API call fails
  const handleSubmitLocal = () => {
    const score = QUIZ_DATA.questions.reduce((acc, q) => {
      return acc + (Number(answers[q.id]) === q.correct ? 1 : 0);
    }, 0);
    const total = QUIZ_DATA.questions.length;
    const percentage = Math.round((score / total) * 100);
    setResult({ score: percentage, passed: percentage >= 70 });
    setSubmitted(true);
  };

  const score = result?.score ?? 0;
  const passed = result?.passed ?? false;
  const total = QUIZ_DATA.questions.length;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/my-learning/${params.courseId}`} className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Curriculum
        </Link>
      </div>

      {!submitted ? (
        <>
          <PageHeader
            title={QUIZ_DATA.title}
            description={`${total} questions · 70% to pass`}
          />

          {error && (
            <div className="mb-4 rounded-lg bg-accent-red/10 p-3 text-sm text-accent-red">
              {error}
              <button onClick={handleSubmitLocal} className="ml-2 underline">
                Score locally instead
              </button>
            </div>
          )}

          <div className="space-y-4">
            {QUIZ_DATA.questions.map((q, idx) => (
              <GlassCard key={q.id}>
                <h3 className="mb-3 text-sm font-medium text-text-primary">
                  {idx + 1}. {q.text}
                </h3>
                <div className="space-y-2">
                  {q.options.map((option, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full cursor-pointer rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${
                        answers[q.id] === String(optIdx)
                          ? "border-accent-500 bg-accent-500/10 text-text-primary"
                          : "border-border-glass bg-surface-card text-text-secondary hover:border-white/20"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < total || submitting}
              className="cursor-pointer rounded-lg bg-accent-500 px-8 py-3 font-medium text-text-on-accent transition-colors hover:bg-accent-500/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center py-10">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent-500/10">
            {passed ? (
              <Award className="h-10 w-10 text-accent-500" />
            ) : (
              <XCircle className="h-10 w-10 text-accent-red" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-text-primary">
            {passed ? "Congratulations!" : "Keep Learning!"}
          </h2>
          <p className="mt-1 text-text-secondary">
            You scored {score} out of 100 ({score}%)
          </p>
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => { setSubmitted(false); setAnswers({}); setResult(null); }}
              className="cursor-pointer rounded-lg border border-border-glass px-6 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-card"
            >
              Retry
            </button>
            <Link
              href={`/my-learning/${params.courseId}`}
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
