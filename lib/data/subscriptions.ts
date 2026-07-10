import { api, apiMutate } from "@/lib/api/client"

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
