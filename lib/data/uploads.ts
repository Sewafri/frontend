import { api } from "@/lib/api/client"

export type UploadPurpose = "profile-photo" | "course-cover" | "lesson-video"

interface PresignResult {
  uploadUrl: string
  token: string
  path: string
  publicUrl: string | null
}

export async function getPresignedUrl(data: {
  purpose: UploadPurpose
  contentType: string
  fileName: string
  courseId?: string
  lessonId?: string
}): Promise<PresignResult> {
  return api<PresignResult>("/uploads/presign", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function uploadFile(
  presign: PresignResult,
  file: File,
): Promise<void> {
  const res = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  })
  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`)
  }
}
