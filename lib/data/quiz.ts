import { api, apiMutate } from "@/lib/api/client"
import type { QuizAttempt, QuizSession, StartAttemptResult } from "@/types/db"

export interface QuizManageSession {
  id: string
  title: string
  passingScore: number
  maxAttempts: number
  durationMinutes: number | null
  requireFullscreen: boolean
  isFinalAssessment: boolean
  questions: QuizManageQuestion[]
}

export interface QuizManageQuestion {
  id: string
  text: string
  type: string
  points: number
  orderIndex: number
  answerOptions: { id: string; text: string; isCorrect: boolean }[]
}

export async function getQuizManage(quizId: string): Promise<QuizManageSession> {
  const data = await api<QuizManageSession>(`/quizzes/${quizId}`)
  return data
}

export async function getQuizQuestions(quizId: string): Promise<QuizSession> {
  const data = await api<QuizSession>(`/quizzes/${quizId}`)
  return data
}

export async function startQuizAttempt(quizId: string): Promise<StartAttemptResult> {
  const data = await apiMutate<StartAttemptResult>(
    `/quizzes/${quizId}/start`,
    { method: "POST" },
  )
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
  const data = await apiMutate<QuizAttempt>(
    `/quizzes/${quizId}/submit`,
    {
      method: "POST",
      body: JSON.stringify({
        answers,
        integrityReport: options?.integrityReport,
        attemptId: options?.attemptId,
      }),
    },
    "Quiz submitted",
  )
  return data
}

export async function getCourseQuizzes(courseId: string): Promise<QuizSummary[]> {
  const data = await api<{ quizzes: QuizSummary[] }>(`/courses/${courseId}/quizzes`)
  return data.quizzes
}

export async function createCourseQuiz(
  courseId: string,
  input: {
    title: string
    passingScore?: number
    maxAttempts?: number
    durationMinutes?: number
    requireFullscreen?: boolean
    isFinalAssessment?: boolean
  },
): Promise<QuizSummary> {
  const data = await apiMutate<{ quiz: QuizSummary }>(
    `/courses/${courseId}/quizzes`,
    { method: "POST", body: JSON.stringify(input) },
    "Quiz created",
  )
  return data.quiz
}

export async function updateQuiz(
  quizId: string,
  input: Partial<{
    title: string
    passingScore: number
    maxAttempts: number
    durationMinutes: number
    requireFullscreen: boolean
    isFinalAssessment: boolean
  }>,
): Promise<QuizSummary> {
  const data = await apiMutate<{ quiz: QuizSummary }>(
    `/quizzes/${quizId}`,
    { method: "PATCH", body: JSON.stringify(input) },
    "Quiz updated",
  )
  return data.quiz
}

export async function deleteQuiz(quizId: string): Promise<void> {
  await apiMutate(`/quizzes/${quizId}`, { method: "DELETE" }, "Quiz deleted")
}

export async function addQuizQuestion(
  quizId: string,
  input: {
    text: string
    type?: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER"
    points?: number
    orderIndex?: number
    options: { text: string; isCorrect: boolean }[]
  },
): Promise<QuizQuestion> {
  const data = await apiMutate<{ question: QuizQuestion }>(
    `/quizzes/${quizId}/questions`,
    { method: "POST", body: JSON.stringify(input) },
    "Question added",
  )
  return data.question
}

export async function updateQuizQuestion(
  quizId: string,
  questionId: string,
  input: Partial<{
    text: string
    points: number
    orderIndex: number
    options: { id?: string; text: string; isCorrect: boolean }[]
  }>,
): Promise<QuizQuestion> {
  const data = await apiMutate<{ question: QuizQuestion }>(
    `/quizzes/${quizId}/questions/${questionId}`,
    { method: "PATCH", body: JSON.stringify(input) },
    "Question updated",
  )
  return data.question
}

export async function deleteQuizQuestion(
  quizId: string,
  questionId: string,
): Promise<void> {
  await apiMutate(
    `/quizzes/${quizId}/questions/${questionId}`,
    { method: "DELETE" },
    "Question deleted",
  )
}

export interface QuizSummary {
  id: string
  title: string
  passingScore: number
  maxAttempts: number
  durationMinutes: number
  requireFullscreen: boolean
  isFinalAssessment: boolean
  courseId: string
  _count: { questions: number }
  createdAt: string
}

export interface QuizQuestion {
  id: string
  text: string
  type: string
  points: number
  orderIndex: number
  quizId: string
  answerOptions: { id: string; text: string; isCorrect: boolean }[]
}

interface AttemptWithUser extends QuizAttempt {
  user: { id: string; fullName: string; email: string }
}

export async function getQuizAttempts(quizId: string): Promise<AttemptWithUser[]> {
  const data = await api<AttemptWithUser[]>(`/quizzes/${quizId}/attempts`)
  return data
}
