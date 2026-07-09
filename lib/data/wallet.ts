import { api } from "@/lib/api/client"
import type { Certificate } from "@/types/db"

export interface BadgeDTO {
  id: string
  name: string
  iconUrl: string
  skills: string[]
  awardedAt: string
  courseId: string | null
}

interface WalletDTO {
  id: string
  publicUrl: string
  isPublic: boolean
  certificates: Certificate[]
  badges: BadgeDTO[]
}

export async function getMyWallet(): Promise<WalletDTO> {
  const data = await api<WalletDTO>("/wallet/me")
  return data
}

export async function getPublicWallet(
  publicUrl: string,
): Promise<WalletDTO> {
  const data = await api<WalletDTO>(`/wallet/${publicUrl}`)
  return data
}
