"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import {
  addQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  type QuizManageQuestion,
} from "@/lib/data/quiz";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

let tempIdCounter = 0;
function nextTempId() {
  return `__new_${++tempIdCounter}`;
}

export default function QuizEditorPage() {
  const params = useParams();
  const courseId = params.id as string;
  const quizId = params.quizId as string;
  const [questions, setQuestions] = useState<QuizManageQuestion[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!quizId) return;
    import("@/lib/data/quiz").then(({ getQuizManage }) =>
      getQuizManage(quizId)
        .then((data) => setQuestions(data.questions ?? []))
        .catch(() => setQuestions([])),
    );
  }, [quizId]);

  function handleAddQuestion() {
    setQuestions((prev) => [
      ...prev,
      {
        id: nextTempId(),
        text: "",
        type: "MULTIPLE_CHOICE",
        points: 1,
        orderIndex: prev.length,
        answerOptions: [
          { id: nextTempId(), text: "", isCorrect: false },
          { id: nextTempId(), text: "", isCorrect: false },
        ],
      },
    ]);
  }

  async function handleSaveQuestion(q: QuizManageQuestion) {
    if (!q.text.trim()) return;
    setSaving(q.id);
    try {
      if (q.id.startsWith("__new_")) {
        const created = await addQuizQuestion(quizId, {
          text: q.text,
          options: q.answerOptions.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
          orderIndex: q.orderIndex,
        });
        setQuestions((prev) => prev.map((item) => (item.id === q.id ? created : item)));
      } else {
        const updated = await updateQuizQuestion(quizId, q.id, {
          text: q.text,
          options: q.answerOptions.map((o) => ({
            id: o.id.startsWith("__new_") ? undefined : o.id,
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        });
        setQuestions((prev) => prev.map((item) => (item.id === q.id ? updated : item)));
      }
    } finally {
      setSaving(null);
    }
  }

  async function handleDeleteQuestion() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (!deleteTarget.startsWith("__new_")) {
        await deleteQuizQuestion(quizId, deleteTarget);
      }
      setQuestions((prev) => prev.filter((q) => q.id !== deleteTarget));
      setDeleteTarget(null);
    } catch {
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  function updateField(qId: string, field: string, value: string) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, [field]: value } : q)),
    );
  }

  function updateOption(qId: string, optIdx: number, field: string, value: string | boolean) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              answerOptions: q.answerOptions.map((o, i) =>
                i === optIdx ? { ...o, [field]: value } : o,
              ),
            }
          : q,
      ),
    );
  }

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/instructor/courses/${courseId}/quiz`} className="flex items-center gap-1 text-sm text-brand-text-mid hover:text-brand-text">
          <ArrowLeft className="h-4 w-4" /> Back to Quizzes
        </Link>
      </div>

      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Edit Quiz</h1>
          <p className="mt-1 text-sm text-brand-text-mid">Quiz: {quizId}</p>
        </div>
        <button onClick={handleAddQuestion} className="cursor-pointer flex items-center gap-2 rounded-lg bg-brand-card px-4 py-2 text-sm font-medium text-brand-text transition-colors hover:bg-brand-bg">
          <Plus className="h-4 w-4" /> Add Question
        </button>
      </div>

      {questions.length === 0 ? (
        <p className="py-8 text-center text-sm text-brand-text-mid">No questions yet. Add your first question.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="rounded-xl border border-brand-border bg-brand-card p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-brand-text">Question {idx + 1}</span>
                <button onClick={() => setDeleteTarget(q.id)} aria-label="Remove question" className="cursor-pointer text-accent-red hover:text-accent-red/80"><Trash2 className="h-4 w-4" /></button>
              </div>
              <input
                type="text"
                value={q.text}
                onChange={(e) => updateField(q.id, "text", e.target.value)}
                placeholder="Enter question..."
                aria-label="Question text"
                className="mb-3 w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text placeholder-text-brand-text-mid outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]"
              />
              <div className="space-y-2">
                {q.answerOptions.map((opt, optIdx) => (
                  <div key={opt.id ?? optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={opt.isCorrect}
                      onChange={() => {
                        setQuestions((prev) =>
                          prev.map((pq) =>
                            pq.id === q.id
                              ? {
                                  ...pq,
                                  answerOptions: pq.answerOptions.map((o, i) =>
                                    i === optIdx
                                      ? { ...o, isCorrect: true }
                                      : { ...o, isCorrect: false },
                                  ),
                                }
                              : pq,
                          ),
                        );
                      }}
                      aria-label={`Mark option ${optIdx + 1} as correct`}
                      className="accent-brand-green"
                    />
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => updateOption(q.id, optIdx, "text", e.target.value)}
                      placeholder={`Option ${optIdx + 1}`}
                      aria-label={`Option ${optIdx + 1}`}
                      className="flex-1 rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text placeholder-text-brand-text-mid outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleSaveQuestion(q)}
                  disabled={saving === q.id}
                  className="cursor-pointer rounded-lg bg-brand-green px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-green-dark disabled:opacity-50"
                >
                  {saving === q.id ? "Saving..." : "Save Question"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDeleteQuestion}
      />
    </div>
  );
}
