import { api } from "@/lib/api/client"

export async function getMyWallet(): Promise<{
  wallet: unknown
  certificates: unknown[]
  badges: unknown[]
}> {
  const data = await api<{
    wallet: unknown
    certificates: unknown[]
    badges: unknown[]
  }>("/wallet/me")
  return data
}

export async function getPublicWallet(
  publicUrl: string,
): Promise<{
  wallet: { isPublic: boolean }
  certificates: unknown[]
  badges: unknown[]
}> {
  const data = await api<{
    wallet: { isPublic: boolean }
    certificates: unknown[]
    badges: unknown[]
  }>(`/wallet/${publicUrl}`)
  return data
}
