import { api, apiMutate } from "@/lib/api/client"
import type { Lesson } from "@/types/db"

export async function getLesson(id: string, courseId?: string): Promise<Lesson> {
  if (courseId) {
    const lessons = await getLessons(courseId)
    const lesson = lessons.find((l) => l.id === id)
    if (!lesson) throw new Error("Lesson not found")
    return lesson
  }
  const data = await api<{ lesson: Lesson }>(`/lessons/${id}`)
  return data.lesson
}

export async function getLessons(
  courseId: string,
): Promise<Lesson[]> {
  const data = await api<{ lessons: Lesson[] }>(`/courses/${courseId}/lessons`)
  return data.lessons
}

export async function createLesson(
  courseId: string,
  input: {
    title: string
    contentType: "TEXT" | "VIDEO" | "MIXED" | "CODE"
    contentBody?: string
    videoUrl?: string
    isRequired?: boolean
    orderIndex?: number
    language?: string
    starterCode?: string
  },
): Promise<Lesson> {
  const data = await apiMutate<{ lesson: Lesson }>(
    `/courses/${courseId}/lessons`,
    { method: "POST", body: JSON.stringify(input) },
    "Lesson created",
  )
  return data.lesson
}

export async function updateLesson(
  id: string,
  input: Partial<{
    title: string
    contentBody: string
    videoUrl: string
    isRequired: boolean
    language: string
    starterCode: string
  }>,
): Promise<Lesson> {
  const data = await apiMutate<{ lesson: Lesson }>(
    `/lessons/${id}`,
    { method: "PATCH", body: JSON.stringify(input) },
    "Lesson updated",
  )
  return data.lesson
}

export async function reorderLesson(
  id: string,
  orderIndex: number,
): Promise<Lesson> {
  const data = await apiMutate<{ lesson: Lesson }>(
    `/lessons/${id}/reorder`,
    { method: "PATCH", body: JSON.stringify({ orderIndex }) },
    "Lesson reordered",
  )
  return data.lesson
}

export async function deleteLesson(id: string): Promise<void> {
  await apiMutate(`/lessons/${id}`, { method: "DELETE" }, "Lesson deleted")
}

export async function completeLesson(id: string): Promise<void> {
  await apiMutate(`/lessons/${id}/complete`, { method: "POST" }, "Lesson completed")
}

export interface CourseProgress {
  enrolled: boolean
  completedLessonIds: string[]
  progressPercent: number
  certificateId: string | null
}

export async function getCourseProgress(courseId: string): Promise<CourseProgress> {
  const data = await api<CourseProgress>(`/courses/${courseId}/lessons/progress`)
  return data
}

export async function getResumeLesson(
  courseId: string,
): Promise<{ lessonId: string | null }> {
  try {
    const data = await api<{ lessonId: string }>(`/enrollments/${courseId}/resume`)
    return data
  } catch {
    return { lessonId: null }
  }
}

export interface CodeExecutionResult {
  output: string
  error?: string
  note?: string
  clientSide?: boolean
}

export async function executeCode(
  lessonId: string,
  code: string,
  language: string,
): Promise<CodeExecutionResult> {
  const data = await api<CodeExecutionResult>(`/lessons/${lessonId}/execute`, {
    method: "POST",
    body: JSON.stringify({ code, language }),
    silent: true,
  })
  return data
}

export async function saveStudentCode(
  lessonId: string,
  code: string,
  language: string,
): Promise<void> {
  await apiMutate(
    `/lessons/${lessonId}/save-code`,
    {
      method: "POST",
      body: JSON.stringify({ code, language }),
      silent: true,
    },
  )
}

export async function getStudentCode(
  lessonId: string,
): Promise<{ code: string | null; language: string | null }> {
  const data = await api<{ code: string | null; language: string | null }>(
    `/lessons/${lessonId}/student-code`,
    { silent: true },
  )
  return data
}

export async function regenerateQuiz(lessonId: string): Promise<void> {
  await apiMutate<{ quiz: unknown }>(
    `/lessons/${lessonId}/regenerate-quiz`,
    { method: "POST" },
    undefined,
  )
}
