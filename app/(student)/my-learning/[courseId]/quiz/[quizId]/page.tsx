"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Award } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";

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
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = submitted
    ? QUIZ_DATA.questions.reduce((acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0), 0)
    : 0;
  const total = QUIZ_DATA.questions.length;
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 70;

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/my-learning/${params.courseId}`} className="flex items-center gap-1 text-sm text-text-secondary hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Curriculum
        </Link>
      </div>

      {!submitted ? (
        <>
          <PageHeader
            title={QUIZ_DATA.title}
            description={`${total} questions · 70% to pass`}
          />

          <div className="space-y-4">
            {QUIZ_DATA.questions.map((q, idx) => (
              <GlassCard key={q.id}>
                <h3 className="mb-3 text-sm font-medium text-white">
                  {idx + 1}. {q.text}
                </h3>
                <div className="space-y-2">
                  {q.options.map((option, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full cursor-pointer rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${
                        answers[q.id] === optIdx
                          ? "border-brand-orange bg-brand-orange/10 text-white"
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
              disabled={Object.keys(answers).length < total}
              className="cursor-pointer rounded-lg bg-brand-orange px-8 py-3 font-medium text-white transition-colors hover:bg-brand-orange/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Quiz
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center py-10">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange/10">
            {passed ? (
              <Award className="h-10 w-10 text-brand-orange" />
            ) : (
              <XCircle className="h-10 w-10 text-red-400" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {passed ? "Congratulations!" : "Keep Learning!"}
          </h2>
          <p className="mt-1 text-text-secondary">
            You scored {score} out of {total} ({percentage}%)
          </p>
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => { setSubmitted(false); setAnswers({}); }}
              className="cursor-pointer rounded-lg border border-border-glass px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-surface-card"
            >
              Retry
            </button>
            <Link
              href={`/my-learning/${params.courseId}`}
              className="rounded-lg bg-brand-orange px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90"
            >
              Back to Course
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
