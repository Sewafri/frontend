// Centralised cache key registry
export const CACHE_KEYS = {
  user: (id: string) => `user:${id}`,
  courses: "courses",
  lessons: (courseId: string) => `lessons:${courseId}`,
}
