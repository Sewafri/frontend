import { api } from "@/lib/api/client"
import type { Course } from "@/types/db"

export interface CourseDashboardData {
  enrollmentCount: number
  averageProgress: number
  completionRate: number
  quizPassRate: number
}

export async function getMyCourses(): Promise<Course[]> {
  const data = await api<{ courses: Course[] }>("/courses/mine")
  return data.courses
}

export async function getCourseDashboard(courseId: string): Promise<CourseDashboardData> {
  return api<CourseDashboardData>(`/courses/${courseId}/dashboard`)
}

export interface InstructorDashboardData {
  courses: Course[]
  courseDashboards: Record<string, CourseDashboardData>
  totalStudents: number
  averageRating: number
}

export async function getInstructorDashboard(): Promise<InstructorDashboardData> {
  const courses = await getMyCourses()
  const dashPromises = courses.map(async (c) => {
    try {
      const dash = await getCourseDashboard(c.id)
      return [c.id, dash] as const
    } catch {
      return [c.id, null] as const
    }
  })
  const dashResults = await Promise.all(dashPromises)
  const courseDashboards: Record<string, CourseDashboardData> = {}
  for (const [id, dash] of dashResults) {
    if (dash) courseDashboards[id] = dash
  }
  const totalStudents = Object.values(courseDashboards).reduce(
    (sum, d) => sum + d.enrollmentCount, 0,
  )
  return { courses, courseDashboards, totalStudents, averageRating: 0 }
}
