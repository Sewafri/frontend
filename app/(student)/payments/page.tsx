"use client"

import { useEffect, useState } from "react"
import { CreditCard, Wallet, AlertCircle, Clock, Check, RefreshCw, Loader2, ExternalLink } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { getMyPayments, checkCryptoPayment, retryCryptoPayment } from "@/lib/data/payments"
import type { PaymentWithDetails } from "@/lib/data/payments"

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  AWAITING_CONFIRMATIONS: "Confirming",
  CONFIRMED: "Confirmed",
  FAILED: "Failed",
  EXPIRED: "Expired",
  UNDERPAID: "Underpaid",
  REFUNDED: "Refunded",
}

const STATUS_PILLS: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  AWAITING_CONFIRMATIONS: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  CONFIRMED: "bg-gray-900 text-white dark:bg-white dark:text-gray-900",
  FAILED: "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  EXPIRED: "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500",
  UNDERPAID: "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  REFUNDED: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkingId, setCheckingId] = useState<string | null>(null)
  const [retryingId, setRetryingId] = useState<string | null>(null)

  function load() {
    setLoading(true)
    setError(null)
    getMyPayments()
      .then((res) => setPayments(res.payments))
      .catch((err) => setError(err.message ?? "Failed to load payments"))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleCheck(paymentId: string) {
    setCheckingId(paymentId)
    try {
      const result = await checkCryptoPayment(paymentId)
      if (result.status === "CONFIRMED") load()
    } catch {
      //
    }
    setCheckingId(null)
  }

  async function handleRetry(paymentId: string) {
    setRetryingId(paymentId)
    try {
      await retryCryptoPayment(paymentId)
      load()
    } catch {
      //
    }
    setRetryingId(null)
  }

  return (
    <div>
      <PageHeader
        title="Payments"
        description="View your payment history and manage crypto payments."
      />

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-5 w-5 animate-spin text-text-tertiary" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-accent-red/10 px-4 py-3 text-sm text-accent-red">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {!loading && !error && payments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <CreditCard className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-text-secondary">No payments yet.</p>
        </div>
      )}

      {!loading && payments.length > 0 && (
        <div className="space-y-3">
          {payments.map((p) => {
            const color = STATUS_PILLS[p.status] ?? "bg-gray-100 text-gray-500 dark:bg-gray-500/10 dark:text-gray-400"
            const label = STATUS_LABELS[p.status] ?? p.status
            const isCrypto = p.method === "CRYPTO"
            const needsAction = isCrypto && (p.status === "AWAITING_CONFIRMATIONS" || p.status === "UNDERPAID" || p.status === "EXPIRED")

            return (
              <div
                key={p.id}
                className="rounded-xl border border-border-default bg-surface-dark p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {isCrypto ? (
                        <Wallet className="h-4 w-4 text-accent-500" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-accent-500" />
                      )}
                      <span className="text-sm font-medium text-text-primary">
                        {p.course?.title ?? "Payment"}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary">
                      {p.amount} {p.currency} &middot; {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                    {isCrypto && p.cryptoDetail && (
                      <div className="space-y-0.5 text-[10px] text-text-tertiary">
                        <p>Network: {p.cryptoDetail.network} &middot; Token: {p.cryptoDetail.tokenSymbol}</p>
                        <p className="font-mono">Address: {p.cryptoDetail.paymentAddress.slice(0, 14)}...</p>
                        <p>Expected: {p.cryptoDetail.expectedAmount} {p.cryptoDetail.tokenSymbol}</p>
                        {p.cryptoDetail.receivedAmount && (
                          <p>Received: {p.cryptoDetail.receivedAmount} {p.cryptoDetail.tokenSymbol}</p>
                        )}
                        {p.cryptoDetail.txHash && (
                          <p className="font-mono">Tx: {p.cryptoDetail.txHash.slice(0, 14)}...</p>
                        )}
                        {p.cryptoDetail.confirmations > 0 && (
                          <p>Confirmations: {p.cryptoDetail.confirmations}</p>
                        )}
                        {p.cryptoDetail.quoteExpiresAt && (
                          <p>Quote expires: {new Date(p.cryptoDetail.quoteExpiresAt).toLocaleString()}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
                    {needsAction && (
                      <div className="flex gap-1.5">
                        {p.status !== "EXPIRED" && (
                          <button
                            onClick={() => handleCheck(p.id)}
                            disabled={checkingId === p.id}
                            className="flex cursor-pointer items-center gap-1 rounded-md border border-border-default px-2 py-1 text-[10px] text-text-secondary transition-colors hover:bg-surface-card disabled:opacity-50"
                          >
                            {checkingId === p.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <RefreshCw className="h-3 w-3" />
                            )}
                            Check
                          </button>
                        )}
                        {p.status !== "CONFIRMED" && (
                          <button
                            onClick={() => handleRetry(p.id)}
                            disabled={retryingId === p.id}
                            className="flex cursor-pointer items-center gap-1 rounded-md border border-accent-500/20 bg-accent-500/5 px-2 py-1 text-[10px] text-accent-500 transition-colors hover:bg-accent-500/10 disabled:opacity-50"
                          >
                            {retryingId === p.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <ExternalLink className="h-3 w-3" />
                            )}
                            Retry
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
