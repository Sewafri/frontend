import { api } from "@/lib/api/client"
import type { QuizAttempt } from "@/types/db"

export async function submitQuiz(
  quizId: string,
  answers: Record<string, string>,
): Promise<QuizAttempt> {
  const data = await api<QuizAttempt>(`/quizzes/${quizId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  })
  return data
}

export async function getQuizQuestions(_quizId: string) {
  // MOCK: no GET /quizzes/:id endpoint — see MIGRATION.md
  // Quiz questions must come from mock data until the backend adds this endpoint
  return null
}
