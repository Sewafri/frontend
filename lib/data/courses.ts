import { api, apiMutate } from "@/lib/api/client"
import type { Course } from "@/types/db"

export async function getCourses(params?: {
  category?: string
  search?: string
}): Promise<Course[]> {
  const data = await api<{ courses: Course[] }>("/courses", {
    params: {
      category: params?.category || undefined,
      search: params?.search || undefined,
    },
  })
  return data.courses
}

export async function getCourseById(id: string): Promise<Course> {
  const data = await api<{ course: Course }>(`/courses/${id}`)
  return data.course
}

export async function getMyCourses(): Promise<Course[]> {
  const data = await api<{ courses: Course[] }>("/courses/mine")
  return data.courses
}

export async function createCourse(input: {
  title: string
  description: string
  category: string
  skillTags?: string[]
  coverImageUrl?: string
  pricingModel?: "FREE" | "ONE_TIME_PURCHASE" | "SUBSCRIPTION_ONLY"
  price?: number
  currency?: string
}): Promise<Course> {
  const data = await apiMutate<{ course: Course }>(
    "/courses",
    { method: "POST", body: JSON.stringify(input) },
    "Course created",
  )
  return data.course
}

export async function updateCourse(
  id: string,
  input: Partial<{
    title: string
    description: string
    category: string
    skillTags: string[]
    coverImageUrl: string
    pricingModel: "FREE" | "ONE_TIME_PURCHASE" | "SUBSCRIPTION_ONLY"
    price: number
    currency: string
  }>,
): Promise<Course> {
  const data = await apiMutate<{ course: Course }>(
    `/courses/${id}`,
    { method: "PATCH", body: JSON.stringify(input) },
    "Course updated",
  )
  return data.course
}

export async function publishCourse(id: string): Promise<Course> {
  const data = await apiMutate<{ course: Course }>(
    `/courses/${id}/publish`,
    { method: "PATCH" },
    "Course published",
  )
  return data.course
}

export async function unpublishCourse(id: string): Promise<Course> {
  const data = await apiMutate<{ course: Course }>(
    `/courses/${id}/unpublish`,
    { method: "PATCH" },
    "Course unpublished",
  )
  return data.course
}

export async function deleteCourse(id: string): Promise<void> {
  await apiMutate(`/courses/${id}`, { method: "DELETE" }, "Course deleted")
}

export async function enrollInCourse(courseId: string): Promise<void> {
  await apiMutate(`/courses/${courseId}/enroll`, { method: "POST" }, "Enrolled successfully")
}
