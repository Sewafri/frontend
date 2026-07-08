import { api } from "@/lib/api/client"
import type { Enrollment } from "@/types/db"

export async function getMyEnrollments(): Promise<Enrollment[]> {
  // MOCK: backend GET /enrollments is a stub — see MIGRATION.md
  // Falls back to mock data if NEXT_PUBLIC_USE_MOCK_DATA=true
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"
  if (useMock) return []

  try {
    const data = await api<{ enrollments: Enrollment[] }>("/enrollments")
    return data.enrollments
  } catch {
    // endpoint likely stub — return empty array
    return []
  }
}
