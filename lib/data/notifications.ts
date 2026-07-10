import { api, apiMutate } from "@/lib/api/client"
import type { Notification } from "@/types/db"

export async function getNotifications(): Promise<Notification[]> {
  const data = await api<Notification[]>("/notifications")
  return data
}

export async function markNotificationRead(id: string): Promise<Notification> {
  const data = await apiMutate<Notification>(
    `/notifications/${id}/read`,
    { method: "PATCH" },
  )
  return data
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiMutate("/notifications/read-all", { method: "PATCH" }, "All notifications marked as read")
}
