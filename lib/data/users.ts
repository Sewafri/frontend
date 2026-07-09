import { api } from "@/lib/api/client"

export async function updateProfile(input: {
  fullName?: string
  bio?: string
  avatarUrl?: string
}): Promise<void> {
  await api("/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  })
}
