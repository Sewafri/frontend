"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { ArrowLeft, Plus, FileQuestion, Edit3, Trash2 } from "lucide-react";
import { getCourseQuizzes, createCourseQuiz, deleteQuiz, type QuizSummary } from "@/lib/data/quiz";

export default function QuizListPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = useCallback(async () => {
    try {
      const data = await getCourseQuizzes(courseId);
      setQuizzes(data);
    } catch {
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  async function handleCreate() {
    try {
      const q = await createCourseQuiz(courseId, { title: "New Quiz" });
      router.push(`/instructor/courses/${courseId}/quiz/${q.id}`);
    } catch {}
  }

  async function handleDelete(quizId: string) {
    try {
      await deleteQuiz(quizId);
      await fetchQuizzes();
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
        title="Quizzes"
        description="Manage course assessments"
        actions={
          <button onClick={handleCreate} className="cursor-pointer flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-accent-500/90">
            <Plus className="h-4 w-4" /> New Quiz
          </button>
        }
      />

      {loading ? (
        <p className="text-sm text-text-secondary">Loading quizzes...</p>
      ) : quizzes.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-secondary">No quizzes yet. Create your first quiz.</p>
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <GlassCard key={quiz.id}>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/10">
                  <FileQuestion className="h-5 w-5 text-accent-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-text-primary">{quiz.title}</h3>
                  <p className="text-xs text-text-secondary">{quiz._count.questions} questions &middot; {quiz.passingScore ?? 70}% to pass</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/instructor/courses/${courseId}/quiz/${quiz.id}`} className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary"><Edit3 className="h-3.5 w-3.5 inline mr-1" />Edit</Link>
                  <button onClick={() => handleDelete(quiz.id)} className="cursor-pointer rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-accent-red transition-colors hover:bg-accent-red/10"><Trash2 className="h-3.5 w-3.5 inline mr-1" />Delete</button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
