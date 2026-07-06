export interface User {
  id: string
  email: string
  name: string | null
  role: "student" | "instructor" | "admin"
  createdAt: Date
  updatedAt: Date
}

export interface Course {
  id: string
  title: string
  description: string | null
  instructorId: string
  createdAt: Date
  updatedAt: Date
}

export type LessonType = "video" | "article" | "quiz" | "exercise" | "code"

export interface Lesson {
  id: string
  courseId: string
  title: string
  videoUrl: string | null
  order: number
  type?: LessonType
  codeContent?: string
  codeLanguage?: string
}
