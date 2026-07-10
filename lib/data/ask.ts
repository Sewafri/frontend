import { api, apiMutate } from "@/lib/api/client"

interface AskResponse {
  answer: string
  citations: Array<{
    id: string
    type: "LESSON" | "FORUM_ANSWER"
    label: string
    similarity: number
  }>
}

export async function askCourseQuestion(
  courseId: string,
  question: string,
): Promise<AskResponse> {
  return apiMutate<AskResponse>(
    `/courses/${courseId}/ask`,
    { method: "POST", body: JSON.stringify({ question }) },
  )
}
