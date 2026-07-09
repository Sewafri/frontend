import { api } from "@/lib/api/client"
import type { VerifyResult } from "@/types/db"

export async function verifyCertificate(
  certificateId: string,
): Promise<VerifyResult> {
  const data = await api<VerifyResult>(`/verify/${certificateId}`)
  return data
}
