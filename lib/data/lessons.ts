import { api } from "@/lib/api/client"
import type { Lesson } from "@/types/db"

export async function getLesson(id: string): Promise<Lesson> {
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
  },
): Promise<Lesson> {
  const data = await api<{ lesson: Lesson }>(`/courses/${courseId}/lessons`, {
    method: "POST",
    body: JSON.stringify(input),
  })
  return data.lesson
}

export async function updateLesson(
  id: string,
  input: Partial<{
    title: string
    contentBody: string
    videoUrl: string
    isRequired: boolean
  }>,
): Promise<Lesson> {
  const data = await api<{ lesson: Lesson }>(`/lessons/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  })
  return data.lesson
}

export async function reorderLesson(
  id: string,
  orderIndex: number,
): Promise<Lesson> {
  const data = await api<{ lesson: Lesson }>(`/lessons/${id}/reorder`, {
    method: "PATCH",
    body: JSON.stringify({ orderIndex }),
  })
  return data.lesson
}

export async function deleteLesson(id: string): Promise<void> {
  await api(`/lessons/${id}`, { method: "DELETE" })
}

export async function completeLesson(id: string): Promise<void> {
  await api<{ lessonProgress: unknown }>(`/lessons/${id}/complete`, {
    method: "POST",
  })
}
