import { api } from "@/lib/api/client"

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  return api<{ message: string }>("/auth/password-reset/request", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function confirmPasswordReset(token: string, newPassword: string): Promise<{ message: string }> {
  return api<{ message: string }>("/auth/password-reset/confirm", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  })
}
