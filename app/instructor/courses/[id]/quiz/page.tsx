"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, FileQuestion, Edit3, Trash2 } from "lucide-react";
import { getCourseQuizzes, createCourseQuiz, deleteQuiz, type QuizSummary } from "@/lib/data/quiz";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function QuizListPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteQuiz(deleteTarget);
      setDeleteTarget(null);
      await fetchQuizzes();
    } catch { setDeleteTarget(null) }
    finally { setDeleting(false) }
  }

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/instructor/courses/${courseId}/edit`} className="flex items-center gap-1 text-sm text-brand-text-mid hover:text-brand-text">
          <ArrowLeft className="h-4 w-4" /> Back to Course
        </Link>
      </div>

      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Quizzes</h1>
          <p className="mt-1 text-sm text-brand-text-mid">Manage course assessments</p>
        </div>
        <button onClick={handleCreate} className="cursor-pointer flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark">
          <Plus className="h-4 w-4" /> New Quiz
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-brand-text-mid">Loading quizzes...</p>
      ) : quizzes.length === 0 ? (
        <p className="py-8 text-center text-sm text-brand-text-mid">No quizzes yet. Create your first quiz.</p>
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="rounded-xl border border-brand-border bg-brand-card p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green-light">
                  <FileQuestion className="h-5 w-5 text-brand-green" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-brand-text">{quiz.title}</h3>
                  <p className="text-xs text-brand-text-mid">{quiz._count.questions} questions &middot; {quiz.passingScore ?? 70}% to pass</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/instructor/courses/${courseId}/quiz/${quiz.id}`} className="rounded-lg border border-brand-border px-3 py-1.5 text-xs font-medium text-brand-text-mid transition-colors hover:text-brand-text"><Edit3 className="h-3.5 w-3.5 inline mr-1" />Edit</Link>
                  <button onClick={() => setDeleteTarget(quiz.id)} className="cursor-pointer rounded-lg border border-brand-border px-3 py-1.5 text-xs font-medium text-accent-red transition-colors hover:bg-accent-red/10"><Trash2 className="h-3.5 w-3.5 inline mr-1" />Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}
        title="Delete Quiz"
        description="Are you sure you want to delete this quiz? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
