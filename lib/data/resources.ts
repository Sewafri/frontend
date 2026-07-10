import { api, apiMutate } from "@/lib/api/client"

export interface LessonResource {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  lessonId: string
  createdAt: string
  signedDownloadUrl?: string
}

export async function getLessonResources(
  lessonId: string,
): Promise<{ resources: LessonResource[] }> {
  return api<{ resources: LessonResource[] }>(`/lessons/${lessonId}/resources`)
}

export async function addLessonResource(
  lessonId: string,
  data: { fileName: string; fileUrl: string; fileType: string; fileSize: number },
): Promise<{ resource: LessonResource }> {
  return apiMutate<{ resource: LessonResource }>(
    `/lessons/${lessonId}/resources`,
    { method: "POST", body: JSON.stringify(data) },
    "Resource added",
  )
}

export async function deleteLessonResource(resourceId: string): Promise<void> {
  await apiMutate(
    `/lessons/resources/${resourceId}`,
    { method: "DELETE" },
    "Resource deleted",
  )
}
