"use client"

import { useState, useEffect } from "react"
import { Banknote, Loader2, AlertCircle, ArrowRight, Send } from "lucide-react"
import GlassCard from "@/components/ui/glass-card"
import { getVaultRate, getVaultReserve, quoteRedemption, buildRedeemTransaction } from "@/lib/data/smart-contracts"
import { sendTransaction } from "@/lib/web3/provider"
import { ApiError } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-context"
import { ethers } from "ethers"

export function VaultSection() {
  const { user } = useAuth()
  const [rate, setRate] = useState<string | null>(null)
  const [reserve, setReserve] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [tokenAmount, setTokenAmount] = useState("")
  const [quote, setQuote] = useState<string | null>(null)
  const [quoting, setQuoting] = useState(false)
  const [redeeming, setRedeeming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      getVaultRate().catch(() => null),
      getVaultReserve().catch(() => null),
    ]).then(([r, res]) => {
      if (r) setRate(r.ratePerToken)
      if (res) setReserve(res.reserveBalance)
    }).finally(() => setLoading(false))
  }, [])

  async function handleQuote(amount: string) {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setQuote(null)
      return
    }
    setQuoting(true)
    try {
      const result = await quoteRedemption(amount)
      setQuote(result.stablecoinPayout)
    } catch {
      setQuote(null)
    } finally {
      setQuoting(false)
    }
  }

  const handleAmountChange = (val: string) => {
    setTokenAmount(val)
    setTxHash(null)
    setError(null)
    if (val && !isNaN(Number(val)) && Number(val) > 0) {
      handleQuote(val)
    } else {
      setQuote(null)
    }
  }

  async function handleRedeem() {
    if (!tokenAmount || !user?.walletAddress) return
    setRedeeming(true)
    setError(null)
    setTxHash(null)
    try {
      const tx = await buildRedeemTransaction(tokenAmount)
      const hash = await sendTransaction(tx.to, tx.data, tx.value)
      if (!hash) {
        setError("Transaction rejected. Please confirm in your wallet.")
        return
      }
      setTxHash(hash)
      setTokenAmount("")
      setQuote(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Redemption failed")
    } finally {
      setRedeeming(false)
    }
  }

  if (loading) {
    return (
      <GlassCard>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-text-tertiary" />
        </div>
      </GlassCard>
    )
  }

  if (!rate && !reserve) return null

  const rateNum = rate ? ethers.formatUnits(rate, 18) : "—"
  const reserveNum = reserve ? ethers.formatUnits(reserve, 18) : "—"

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-3">
        <Banknote className="h-4 w-4 text-accent-500" />
        <h3 className="text-sm font-semibold text-text-primary">Token Vault</h3>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-surface-sunken px-3 py-2">
          <p className="text-[11px] text-text-tertiary">Exchange Rate</p>
          <p className="text-sm font-medium text-text-primary">1 LRN = {rateNum} USDC</p>
        </div>
        <div className="rounded-lg bg-surface-sunken px-3 py-2">
          <p className="text-[11px] text-text-tertiary">Vault Reserve</p>
          <p className="text-sm font-medium text-text-primary">{reserveNum} USDC</p>
        </div>
      </div>

      {user?.walletAddress ? (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-secondary">
              Redeem LEARNING Tokens
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tokenAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Token amount (wei)"
                className="flex-1 rounded-lg border border-border-default bg-surface-card px-3 py-2 text-xs text-text-primary placeholder-text-tertiary outline-none focus:border-accent-500/50"
              />
            </div>
          </div>

          {quoting && (
            <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
              <Loader2 className="h-3 w-3 animate-spin" /> Calculating...
            </div>
          )}

          {quote && (
            <div className="flex items-center gap-2 rounded-lg bg-accent-green/5 px-3 py-2 text-xs">
              <ArrowRight className="h-3 w-3 text-accent-green" />
              <span className="text-text-secondary">
                Receive ~{ethers.formatUnits(quote, 18)} USDC
              </span>
            </div>
          )}

          {txHash && (
            <div className="flex items-center gap-1.5 rounded-lg bg-accent-green/10 px-3 py-2 text-xs text-accent-green">
              <Send className="h-3 w-3 shrink-0" />
              <span className="truncate">Tx: {txHash}</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-1.5 rounded-md bg-accent-red/10 px-3 py-2 text-xs text-accent-red">
              <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleRedeem}
            disabled={!tokenAmount || redeeming}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-accent-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-500/90 disabled:opacity-50"
          >
            {redeeming ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Send className="h-3 w-3" />
            )}
            {redeeming ? "Confirm in Wallet..." : "Redeem"}
          </button>
        </div>
      ) : (
        <p className="text-xs text-text-tertiary">
          Link a crypto wallet above to redeem tokens.
        </p>
      )}
    </GlassCard>
  )
}
