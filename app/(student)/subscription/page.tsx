"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Crown, RefreshCw, AlertCircle, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { getMySubscription, cancelSubscription, renewSubscription } from "@/lib/data/subscriptions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { ApiError } from "@/lib/api/client"
import type { Subscription } from "@/types/db"

type SubState = "loading" | "no-sub" | "active" | "error"

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "text-accent-green" },
  CANCELED: { label: "Canceled", color: "text-accent-red" },
  EXPIRED: { label: "Expired", color: "text-text-tertiary" },
  PAST_DUE: { label: "Past Due", color: "text-accent-amber" },
}

export default function SubscriptionPage() {
  const router = useRouter()
  const [state, setState] = useState<SubState>("loading")
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [renewing, setRenewing] = useState(false)

  useEffect(() => {
    loadSubscription()
  }, [])

  async function loadSubscription() {
    setState("loading")
    try {
      const result = await getMySubscription()
      setSubscription(result.subscription)
      setState(result.subscription.status === "ACTIVE" || result.subscription.status === "PAST_DUE" ? "active" : "active")
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 404) {
        setState("no-sub")
      } else {
        setState("error")
      }
    }
  }

  async function handleCancel() {
    if (!subscription) return
    setCancelling(true)
    try {
      await cancelSubscription(subscription.id)
      await loadSubscription()
    } catch {
      // silently fail
    } finally {
      setCancelling(false)
      setCancelOpen(false)
    }
  }

  async function handleRenew() {
    setRenewing(true)
    try {
      await renewSubscription()
      await loadSubscription()
    } catch {
      // silently fail
    } finally {
      setRenewing(false)
    }
  }

  if (state === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-accent-500" />
      </div>
    )
  }

  const statusInfo = subscription ? STATUS_LABELS[subscription.status] : null

  return (
    <div>
      <PageHeader
        title="My Subscription"
        description="Manage your subscription plan"
      />

      {state === "no-sub" && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-default bg-surface-dark py-16">
          <Crown className="mb-3 h-12 w-12 text-text-tertiary" />
          <h2 className="text-lg font-semibold text-text-primary">No Active Subscription</h2>
          <p className="mt-1 text-sm text-text-secondary">
            You don&apos;t have a subscription yet.
          </p>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-default bg-surface-dark py-16">
          <AlertCircle className="mb-3 h-12 w-12 text-accent-red" />
          <h2 className="text-lg font-semibold text-text-primary">Something went wrong</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Could not load subscription data. Please try again.
          </p>
          <button
            onClick={loadSubscription}
            className="mt-4 cursor-pointer rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-500/90"
          >
            Retry
          </button>
        </div>
      )}

      {subscription && statusInfo && (
        <div className="rounded-xl border border-border-default bg-surface-dark p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {subscription.plan?.name ?? "Subscription"}
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                {subscription.plan?.currency === "XAF"
                  ? `${Number(subscription.plan.price).toLocaleString()} FCFA`
                  : `$${Number(subscription.plan?.price ?? 0)}`
                }
                {subscription.plan?.interval === "MONTHLY" ? "/month" : "/year"}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.color} bg-current/10`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="mb-6 space-y-3 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Auto-renew</span>
              <span className={subscription.autoRenew ? "text-accent-green" : "text-text-tertiary"}>
                {subscription.autoRenew ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Current period ends</span>
              <span className="text-text-primary">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Started</span>
              <span className="text-text-primary">
                {new Date(subscription.startedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {subscription.plan?.features && subscription.plan.features.length > 0 && (
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-semibold text-text-primary">Features</h4>
              <ul className="space-y-1">
                {subscription.plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            {subscription.status === "CANCELED" && !subscription.autoRenew && (
              <button
                onClick={handleRenew}
                disabled={renewing}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-500/90 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${renewing ? "animate-spin" : ""}`} />
                {renewing ? "Enabling..." : "Enable Auto-Renew"}
              </button>
            )}
            {subscription.autoRenew && (
              <button
                onClick={() => setCancelOpen(true)}
                disabled={cancelling}
                className="cursor-pointer rounded-lg border border-accent-red/30 px-4 py-2 text-sm font-medium text-accent-red transition-colors hover:bg-accent-red/5 disabled:opacity-50"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel Subscription"
        description="Your subscription will continue until the end of the current billing period. Are you sure?"
        confirmLabel="Cancel Subscription"
        variant="destructive"
        loading={cancelling}
        onConfirm={handleCancel}
      />
    </div>
  )
}
