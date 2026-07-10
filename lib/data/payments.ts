import { api, apiMutate } from "@/lib/api/client"
import type { Payment } from "@/types/db"

export interface PaymentWithDetails extends Payment {
  course?: { id: string; title: string } | null
  cryptoDetail?: {
    id: string
    network: string
    tokenSymbol: string
    paymentAddress: string
    expectedAmount: string
    receivedAmount: string | null
    txHash: string | null
    confirmations: number
    fiatQuoteRate: number
    quoteExpiresAt: string
    paymentId: string
  } | null
}

export interface CryptoCheckResult {
  status: "CONFIRMED" | "UNDERPAID" | "EXPIRED" | "AWAITING_CONFIRMATIONS" | "PENDING"
  confirmations?: number
  requiredConfirmations?: number
}

export interface CryptoRetryResult {
  payment: {
    id: string
    amount: number
    currency: string
    status: string
    method: string
  }
  cryptoDetail: {
    paymentAddress: string
    expectedAmount: string
    tokenSymbol: string
    network: string
    quoteExpiresAt: string
  }
}

export async function getMyPayments(): Promise<{ payments: PaymentWithDetails[] }> {
  return api<{ payments: PaymentWithDetails[] }>("/payments/me")
}

export async function checkCryptoPayment(paymentId: string): Promise<CryptoCheckResult> {
  return apiMutate<CryptoCheckResult>(`/payments/crypto/${paymentId}/check`, {
    method: "POST",
  })
}

export async function retryCryptoPayment(paymentId: string): Promise<CryptoRetryResult> {
  return apiMutate<CryptoRetryResult>(
    `/payments/crypto/${paymentId}/retry`,
    { method: "POST" },
    "Payment retry initiated",
  )
}
