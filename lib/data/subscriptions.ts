import { api } from "@/lib/api/client"

export async function createSubscription(planId: string): Promise<{ subscription: unknown }> {
  const data = await api<{ subscription: unknown }>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({ planId }),
  })
  return data
}

export async function cancelSubscription(id: string): Promise<void> {
  await api(`/subscriptions/${id}/cancel`, { method: "POST" })
}
