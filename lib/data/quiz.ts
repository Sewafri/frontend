import { api } from "@/lib/api/client"
import type { QuizAttempt, QuizSession, StartAttemptResult } from "@/types/db"

export async function getQuizQuestions(quizId: string): Promise<QuizSession> {
  const data = await api<QuizSession>(`/quizzes/${quizId}`)
  return data
}

export async function startQuizAttempt(quizId: string): Promise<StartAttemptResult> {
  const data = await api<StartAttemptResult>(`/quizzes/${quizId}/start`, {
    method: "POST",
  })
  return data
}

export async function submitQuiz(
  quizId: string,
  answers: Record<string, string>,
  options?: {
    integrityReport?: Record<string, unknown>
    attemptId?: string
  },
): Promise<QuizAttempt> {
  const data = await api<QuizAttempt>(`/quizzes/${quizId}/submit`, {
    method: "POST",
    body: JSON.stringify({
      answers,
      integrityReport: options?.integrityReport,
      attemptId: options?.attemptId,
    }),
  })
  return data
}

interface AttemptWithUser extends QuizAttempt {
  user: { id: string; fullName: string; email: string }
}

export async function getQuizAttempts(quizId: string): Promise<AttemptWithUser[]> {
  const data = await api<AttemptWithUser[]>(`/quizzes/${quizId}/attempts`)
  return data
}
