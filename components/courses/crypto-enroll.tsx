"use client"

import { useState, useEffect } from "react"
import { Coins, Wallet, Loader2, Check, AlertCircle, ArrowRight } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import {
  getCoursePricing,
  getTokenBalance,
  getTokenAllowance,
  buildApproveTransaction,
  buildEnrollTransaction,
  buildUnlockTransaction,
} from "@/lib/data/smart-contracts"
import { sendTransaction } from "@/lib/web3/provider"
import { ethers } from "ethers"

interface Props {
  courseId: string
  onEnrolled: () => void
}

export function CryptoEnroll({ courseId, onEnrolled }: Props) {
  const { address: walletAddress, isInstalled, connect } = useWallet()
  const [pricing, setPricing] = useState<{
    stablecoinPrice: string
    tokenPrice: string
    exists: boolean
  } | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [allowance, setAllowance] = useState<string | null>(null)
  const [method, setMethod] = useState<"stablecoin" | "token">("stablecoin")
  const [expanded, setExpanded] = useState(false)
  const [active, setActive] = useState(false)
  const [status, setStatus] = useState<"idle" | "connecting" | "approving" | "sending" | "done" | "error">("idle")
  const [statusLabel, setStatusLabel] = useState("")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!expanded) return
    getCoursePricing(Number(courseId))
      .then((p) => {
        setPricing(p)
        if (!p.exists) setErrorMsg("Crypto payment not available for this course.")
      })
      .catch(() => setPricing(null))
  }, [courseId, expanded])

  useEffect(() => {
    if (!pricing?.exists || !walletAddress) return
    getTokenBalance(walletAddress).then((b) => b && setBalance(b.balance)).catch(() => {})
    getTokenAllowance(walletAddress).then((a) => a && setAllowance(a.allowance)).catch(() => {})
  }, [pricing, walletAddress])

  if (!pricing?.exists) return null

  const price = method === "stablecoin" ? pricing.stablecoinPrice : pricing.tokenPrice
  const priceFormatted = ethers.formatUnits(price, 18)
  const balanceFormatted = balance ? ethers.formatUnits(balance, 18) : "0"
  const allowanceFormatted = allowance ? ethers.formatUnits(allowance, 18) : "0"
  const needsApproval = allowance !== null && allowance !== "0" && BigInt(allowance) < BigInt(price)
  const hasBalance = balance !== null && BigInt(balance) >= BigInt(price)
  const tokenSymbol = method === "stablecoin" ? "USDC" : "LRN"

  async function handlePay() {
    setErrorMsg(null)
    setTxHash(null)
    setStatus("connecting")
    setStatusLabel("Connecting wallet...")

    let addr = walletAddress
    if (!addr) {
      addr = await connect()
      if (!addr) {
        setStatus("error")
        setErrorMsg(!isInstalled ? "No wallet found. Install MetaMask." : "Wallet connection failed.")
        return
      }
    }

    if (!hasBalance) {
      setStatus("error")
      setErrorMsg(`Insufficient ${tokenSymbol} balance. You have ${balanceFormatted}, need ${priceFormatted}.`)
      return
    }

    try {
      const enrollTx = method === "stablecoin"
        ? await buildEnrollTransaction(Number(courseId))
        : await buildUnlockTransaction(Number(courseId))

      const spenderAddress = enrollTx.to

      // Approve if needed
      if (needsApproval || allowance === "0") {
        setStatus("approving")
        setStatusLabel(`Approving ${tokenSymbol} spending...`)
        const approveTx = await buildApproveTransaction(spenderAddress, price)
        const approveHash = await sendTransaction(approveTx.to, approveTx.data)
        if (!approveHash) {
          setStatus("error")
          setErrorMsg("Approval rejected.")
          return
        }
      }

      setStatus("sending")
      setStatusLabel(`Enrolling with ${tokenSymbol}...`)
      const hash = await sendTransaction(enrollTx.to, enrollTx.data)
      if (!hash) {
        setStatus("error")
        setErrorMsg("Transaction rejected.")
        return
      }
      setTxHash(hash)
      setStatus("done")
      onEnrolled()
    } catch (err: unknown) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Enrollment failed.")
    }
  }

  const toggleExpand = () => {
    setExpanded(!expanded)
    if (expanded) {
      setActive(false)
      setStatus("idle")
      setErrorMsg(null)
      setTxHash(null)
    }
  }

  return (
    <div className="mt-3 border-t border-border-default pt-3">
      <button
        onClick={toggleExpand}
        className="flex cursor-pointer items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary"
      >
        <Coins className="h-3.5 w-3.5 text-accent-500" />
        <span>Pay with Crypto</span>
        {expanded ? null : <span className="text-accent-500">+</span>}
      </button>

      {expanded && (
        <div className="mt-2 space-y-3 rounded-lg border border-border-default bg-surface-card p-3">
          <div className="flex items-center gap-2">
            <select
              value={method}
              onChange={(e) => {
                setMethod(e.target.value as "stablecoin" | "token")
                setErrorMsg(null)
                setTxHash(null)
                setStatus("idle")
              }}
              disabled={status === "approving" || status === "sending"}
              className="rounded-md border border-border-default bg-surface-card px-2 py-1.5 text-xs text-text-secondary outline-none focus:border-accent-500/50"
            >
              <option value="stablecoin">USDC ({priceFormatted})</option>
              <option value="token">LRN ({priceFormatted})</option>
            </select>
            <span className={`text-[10px] ${hasBalance ? "text-text-tertiary" : "text-accent-red"}`}>
              Balance: {balanceFormatted} {tokenSymbol}
            </span>
          </div>

          {!walletAddress && (
            <button
              onClick={() => connect()}
              disabled={status === "connecting"}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent-500/20 bg-accent-500/5 px-3 py-2 text-xs text-accent-500 transition-colors hover:bg-accent-500/10 disabled:opacity-50"
            >
              {status === "connecting" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Wallet className="h-3.5 w-3.5" />
              )}
              Connect Wallet
            </button>
          )}

          {walletAddress && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePay}
                disabled={status === "approving" || status === "sending" || status === "done" || !hasBalance}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-accent-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-500/90 disabled:opacity-50"
              >
                {status === "approving" || status === "sending" || status === "connecting" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : status === "done" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <ArrowRight className="h-3 w-3" />
                )}
                {status === "connecting" ? "Connecting..." :
                 status === "approving" ? "Approve in Wallet..." :
                 status === "sending" ? "Confirm in Wallet..." :
                 status === "done" ? "Enrolled!" :
                 "Pay with Crypto"}
              </button>
              {txHash && (
                <span className="truncate text-[10px] text-text-tertiary" title={txHash}>
                  Tx: {txHash.slice(0, 10)}...
                </span>
              )}
            </div>
          )}

          {needsApproval && (
            <p className="text-[10px] text-accent-amber">
              Allowance: {allowanceFormatted} {tokenSymbol}. Approval step needed.
            </p>
          )}

          {errorMsg && (
            <div className="flex items-start gap-1.5 rounded-md bg-accent-red/10 px-3 py-2 text-xs text-accent-red">
              <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
