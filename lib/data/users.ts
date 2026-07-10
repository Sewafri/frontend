import { api, apiMutate } from "@/lib/api/client"

export interface PublicProfile {
  id: string
  fullName: string
  bio: string | null
  photoUrl: string | null
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN"
  expertise?: string
}

export async function updateProfile(input: {
  fullName?: string
  bio?: string
  avatarUrl?: string
}): Promise<void> {
  await apiMutate("/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  }, "Profile updated")
}

export async function deleteAccount(): Promise<void> {
  await apiMutate("/users/me", { method: "DELETE" }, "Account deleted")
}

export async function getPublicProfile(userId: string): Promise<{ user: PublicProfile }> {
  return api<{ user: PublicProfile }>(`/users/${userId}`)
}
