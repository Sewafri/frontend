"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

interface Question {
  id: string;
  text: string;
  options: string[];
  correct: number;
}

const INITIAL_QUESTIONS: Question[] = [
  { id: "q1", text: "What is the primary benefit of using TypeScript?", options: ["Faster runtime", "Static type checking", "Smaller bundles", "Better compat"], correct: 1 },
  { id: "q2", text: "Which React hook handles side effects?", options: ["useState", "useEffect", "useContext", "useReducer"], correct: 1 },
];

export default function QuizEditorPage() {
  const params = useParams();
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);

  const addQuestion = () => {
    const newId = `q${questions.length + 1}`;
    setQuestions([...questions, { id: newId, text: "", options: ["", "", "", ""], correct: 0 }]);
  };

  const updateQuestion = (id: string, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)));
  };

  const updateOption = (qId: string, optIdx: number, value: string) => {
    setQuestions(questions.map((q) => q.id === qId ? { ...q, options: q.options.map((o, i) => i === optIdx ? value : o) } : q));
  };

  const setCorrect = (qId: string, optIdx: number) => {
    setQuestions(questions.map((q) => q.id === qId ? { ...q, correct: optIdx } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/instructor/courses/${params.id}/quiz`} className="flex items-center gap-1 text-sm text-text-secondary hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Quizzes
        </Link>
      </div>

      <PageHeader
        title="Edit Quiz"
        description={`Quiz: ${params.quizId}`}
        actions={
          <button onClick={addQuestion} className="cursor-pointer flex items-center gap-2 rounded-lg bg-surface-card px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10">
            <Plus className="h-4 w-4" /> Add Question
          </button>
        }
      />

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <GlassCard key={q.id}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-medium text-white">Question {idx + 1}</span>
              <button onClick={() => removeQuestion(q.id)} className="cursor-pointer text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
            </div>
            <input type="text" value={q.text} onChange={(e) => updateQuestion(q.id, e.target.value)} placeholder="Enter question..." className="mb-3 w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2 text-sm text-white placeholder-text-secondary outline-none focus:border-brand-orange/50" />
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-2">
                  <input type="radio" name={`correct-${q.id}`} checked={q.correct === optIdx} onChange={() => setCorrect(q.id, optIdx)} className="accent-brand-orange" />
                  <input type="text" value={opt} onChange={(e) => updateOption(q.id, optIdx, e.target.value)} placeholder={`Option ${optIdx + 1}`} className="flex-1 rounded-lg border border-border-glass bg-surface-card px-3 py-2 text-sm text-white placeholder-text-secondary outline-none focus:border-brand-orange/50" />
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button className="cursor-pointer flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90">
          <Save className="h-4 w-4" /> Save Quiz
        </button>
      </div>
    </div>
  );
}
