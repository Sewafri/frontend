"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { ArrowLeft, Plus, FileQuestion, Edit3, Trash2 } from "lucide-react";

const QUIZZES = [
  { id: "qz1", title: "Module 1 Assessment", questions: 10, timeLimit: "30 min", passingScore: 70 },
  { id: "qz2", title: "Module 2 Assessment", questions: 8, timeLimit: "20 min", passingScore: 70 },
  { id: "qz3", title: "Final Exam", questions: 25, timeLimit: "60 min", passingScore: 80 },
];

export default function QuizListPage() {
  const params = useParams();

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/instructor/courses/${params.id}/edit`} className="flex items-center gap-1 text-sm text-text-secondary hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Course
        </Link>
      </div>

      <PageHeader
        title="Quizzes"
        description="Manage course assessments"
        actions={
          <button className="cursor-pointer flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90">
            <Plus className="h-4 w-4" /> New Quiz
          </button>
        }
      />

      <div className="space-y-3">
        {QUIZZES.map((quiz) => (
          <GlassCard key={quiz.id}>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10">
                <FileQuestion className="h-5 w-5 text-brand-orange" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">{quiz.title}</h3>
                <p className="text-xs text-text-secondary">{quiz.questions} questions &middot; {quiz.timeLimit} &middot; {quiz.passingScore}% to pass</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/instructor/courses/${params.id}/quiz/${quiz.id}`} className="rounded-lg border border-border-glass px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-white"><Edit3 className="h-3.5 w-3.5 inline mr-1" />Edit</Link>
                <button className="cursor-pointer rounded-lg border border-border-glass px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5 inline mr-1" />Delete</button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
