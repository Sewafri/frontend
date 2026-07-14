"use client"

import { useEffect, useState } from "react"
import { CreditCard, Wallet, AlertCircle, Clock, Check, RefreshCw, Loader2, ExternalLink } from "lucide-react"
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
  PENDING: "bg-brand-bg text-brand-text-mid border border-brand-border",
  AWAITING_CONFIRMATIONS: "bg-brand-amber-light text-brand-amber border border-brand-amber/30",
  CONFIRMED: "bg-brand-green-light text-brand-green border border-brand-green/30",
  FAILED: "bg-accent-red/5 text-accent-red border border-accent-red/20",
  EXPIRED: "bg-brand-bg text-brand-text-light border border-brand-border",
  UNDERPAID: "bg-brand-amber-light text-brand-amber border border-brand-amber/30",
  REFUNDED: "bg-brand-bg text-brand-text-mid border border-brand-border",
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
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">
          Payments
        </h1>
        <p className="mt-1 text-sm text-brand-text-mid">
          View your payment history and manage crypto payments.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-5 w-5 animate-spin text-brand-text-light" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-accent-red/20 bg-accent-red/5 px-4 py-3 text-sm text-accent-red">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {!loading && !error && payments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <CreditCard className="mb-4 h-12 w-12 text-brand-text-light" />
          <p className="text-sm text-brand-text-mid">No payments yet.</p>
        </div>
      )}

      {!loading && payments.length > 0 && (
        <div className="space-y-3">
          {payments.map((p) => {
            const color = STATUS_PILLS[p.status] ?? "bg-brand-bg text-brand-text-mid border border-brand-border"
            const label = STATUS_LABELS[p.status] ?? p.status
            const isCrypto = p.method === "CRYPTO"
            const needsAction = isCrypto && (p.status === "AWAITING_CONFIRMATIONS" || p.status === "UNDERPAID" || p.status === "EXPIRED")

            return (
              <div
                key={p.id}
                className="rounded-xl border border-brand-border bg-brand-card p-4 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {isCrypto ? (
                        <Wallet className="h-4 w-4 text-brand-green" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-brand-green" />
                      )}
                      <span className="text-sm font-medium text-brand-text">
                        {p.course?.title ?? "Payment"}
                      </span>
                    </div>
                    <p className="text-xs text-brand-text-mid">
                      {p.amount} {p.currency} &middot; {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                    {isCrypto && p.cryptoDetail && (
                      <div className="space-y-0.5 text-[10px] text-brand-text-light">
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
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>{label}</span>
                    {needsAction && (
                      <div className="flex gap-1.5">
                        {p.status !== "EXPIRED" && (
                          <button
                            onClick={() => handleCheck(p.id)}
                            disabled={checkingId === p.id}
                            className="flex cursor-pointer items-center gap-1 rounded-md border border-brand-border px-2 py-1 text-[10px] text-brand-text-mid transition-colors hover:bg-brand-card disabled:opacity-50"
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
                            className="flex cursor-pointer items-center gap-1 rounded-md border border-brand-green/20 bg-brand-green-light/40 px-2 py-1 text-[10px] text-brand-green transition-colors hover:bg-brand-green-light disabled:opacity-50"
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
