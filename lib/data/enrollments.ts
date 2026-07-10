import { api, apiMutate } from "@/lib/api/client"
import type { Enrollment } from "@/types/db"

export async function getCourseEnrollments(
  courseId: string,
): Promise<Enrollment[]> {
  const data = await api<{ enrollments: Enrollment[] }>(
    `/courses/${courseId}/enrollments`,
    { silent: true },
  )
  return data.enrollments
}

export async function getMyEnrollments(): Promise<Enrollment[]> {
  const data = await api<{ enrollments: Enrollment[] }>("/enrollments/me")
  return data.enrollments
}
