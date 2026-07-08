import { api } from "@/lib/api/client"
import type { Certificate } from "@/types/db"

export async function verifyCertificate(
  certificateId: string,
): Promise<{
  certificate: Certificate
  isValid: boolean
}> {
  const data = await api<{
    certificate: Certificate
    isValid: boolean
  }>(`/verify/${certificateId}`)
  return data
}
