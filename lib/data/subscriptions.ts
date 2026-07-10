import { api, apiMutate } from "@/lib/api/client"
import type { Subscription } from "@/types/db"

export async function createSubscription(planId: string): Promise<{ subscription: unknown }> {
  return apiMutate<{ subscription: unknown }>(
    "/subscriptions",
    { method: "POST", body: JSON.stringify({ planId }) },
    "Subscription created",
  )
}

export async function cancelSubscription(id: string): Promise<void> {
  await apiMutate(`/subscriptions/${id}/cancel`, { method: "POST" }, "Subscription cancelled")
}

export async function getMySubscription(): Promise<{ subscription: Subscription }> {
  return api<{ subscription: Subscription }>("/subscriptions/me")
}

export async function renewSubscription(): Promise<{ subscription: Subscription }> {
  return apiMutate<{ subscription: Subscription }>(
    "/subscriptions/me/renew",
    { method: "PATCH" },
    "Auto-renew enabled",
  )
}
