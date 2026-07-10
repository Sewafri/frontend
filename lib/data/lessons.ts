import { api, apiMutate } from "@/lib/api/client"
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
