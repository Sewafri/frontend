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

export interface WalletDTO {
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

export async function updateWalletVisibility(
  isPublic: boolean,
): Promise<void> {
  await api<void>("/wallet/me/visibility", {
    method: "PATCH",
    body: JSON.stringify({ isPublic }),
  })
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"

export async function downloadCertificate(certificateId: string) {
  const raw = localStorage.getItem("auth_tokens")
  if (!raw) throw new Error("No auth tokens found")

  const { accessToken } = JSON.parse(raw)
  if (!accessToken) throw new Error("No access token found")

  const res = await fetch(
    `${BASE_URL}/certificates/${certificateId}/download`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )

  if (!res.ok) throw new Error(`Failed to download certificate: ${res.status}`)

  const blob = await res.blob()
  const disposition = res.headers.get("Content-Disposition")
  const filename = disposition
    ? disposition.split("filename=")[1]?.replace(/["']/g, "").trim()
    : `certificate-${certificateId}.pdf`

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename ?? `certificate-${certificateId}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
