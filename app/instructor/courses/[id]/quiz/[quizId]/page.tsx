"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import {
  getQuizManage,
  addQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  type QuizManageQuestion,
} from "@/lib/data/quiz";

export default function QuizEditorPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const quizId = params.quizId as string;
  const [questions, setQuestions] = useState<QuizManageQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;
    getQuizManage(quizId)
      .then((data) => setQuestions(data.questions ?? []))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [quizId]);

  const handleAddQuestion = useCallback(async () => {
    try {
      const q = await addQuizQuestion(quizId, {
        text: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        orderIndex: questions.length,
      });
      setQuestions((prev) => [...prev, q]);
    } catch {}
  }, [quizId, questions.length]);

  const handleSaveQuestion = useCallback(
    async (q: QuizManageQuestion) => {
      setSaving(q.id);
      try {
        const updated = await updateQuizQuestion(quizId, q.id, {
          text: q.text,
          options: q.answerOptions.map((o) => ({
            id: o.id,
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        });
        setQuestions((prev) =>
          prev.map((item) => (item.id === q.id ? updated : item)),
        );
      } finally {
        setSaving(null);
      }
    },
    [quizId],
  );

  const handleDeleteQuestion = useCallback(
    async (questionId: string) => {
      try {
        await deleteQuizQuestion(quizId, questionId);
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      } catch {}
    },
    [quizId],
  );

  const updateField = useCallback(
    (qId: string, field: string, value: unknown) => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === qId ? { ...q, [field]: value } : q)),
      );
    },
    [],
  );

  const updateOption = useCallback(
    (qId: string, optIdx: number, field: string, value: unknown) => {
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
    },
    [],
  );

  if (loading) {
    return <div className="flex flex-col items-center justify-center py-20"><p className="text-sm text-text-secondary">Loading quiz...</p></div>;
  }

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/instructor/courses/${courseId}/quiz`} className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Quizzes
        </Link>
      </div>

      <PageHeader
        title="Edit Quiz"
        description={`Quiz: ${quizId}`}
        actions={
          <button onClick={handleAddQuestion} className="cursor-pointer flex items-center gap-2 rounded-lg bg-surface-card px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-card-hover">
            <Plus className="h-4 w-4" /> Add Question
          </button>
        }
      />

      {questions.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-secondary">No questions yet. Add your first question.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <GlassCard key={q.id}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-text-primary">Question {idx + 1}</span>
                <button onClick={() => handleDeleteQuestion(q.id)} aria-label="Remove question" className="cursor-pointer text-accent-red hover:text-accent-red/80"><Trash2 className="h-4 w-4" /></button>
              </div>
              <input
                type="text"
                value={q.text}
                onChange={(e) => updateField(q.id, "text", e.target.value)}
                placeholder="Enter question..."
                aria-label="Question text"
                className="mb-3 w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50"
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
                      className="accent-accent-500"
                    />
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => updateOption(q.id, optIdx, "text", e.target.value)}
                      placeholder={`Option ${optIdx + 1}`}
                      aria-label={`Option ${optIdx + 1}`}
                      className="flex-1 rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleSaveQuestion(q)}
                  disabled={saving === q.id}
                  className="cursor-pointer rounded-lg bg-accent-500 px-4 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-accent-500/90 disabled:opacity-50"
                >
                  {saving === q.id ? "Saving..." : "Save Question"}
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
