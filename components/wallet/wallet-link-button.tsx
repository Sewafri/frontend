"use client"

import { useState } from "react"
import { Wallet, Loader2, Check, AlertCircle, Unlink } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { getWalletSigningMessage, linkWallet } from "@/lib/data/smart-contracts"
import { ethers } from "ethers"

interface Props {
  linkedAddress: string | null
  onLinked: (address: string) => void
  onUnlinked: () => void
}

export function WalletLinkButton({ linkedAddress, onLinked, onUnlinked }: Props) {
  const { address: browserAddress, isConnecting, isInstalled, connect, sign } = useWallet()
  const [linking, setLinking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLink() {
    setError(null)
    let addr = browserAddress
    if (!addr) {
      addr = await connect()
      if (!addr) {
        setError(
          !isInstalled
            ? "No wallet found. Install MetaMask to continue."
            : "Could not connect to wallet. Please try again.",
        )
        return
      }
    }

    setLinking(true)
    try {
      const msgData = await getWalletSigningMessage(addr)
      const signature = await sign(msgData.message)
      if (!signature) {
        setError("Signature rejected. Please sign the message to prove wallet ownership.")
        return
      }

      await linkWallet(addr, signature)
      onLinked(addr)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to link wallet"
      setError(msg)
    } finally {
      setLinking(false)
    }
  }

  if (linkedAddress) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-accent-green/20 bg-accent-green/5 px-4 py-3">
        <Check className="h-4 w-4 shrink-0 text-accent-green" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-text-primary">Wallet Linked</p>
          <p className="truncate text-[11px] text-text-tertiary">{linkedAddress}</p>
        </div>
        <button
          onClick={onUnlinked}
          className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-border-default px-2.5 py-1.5 text-[11px] text-text-secondary transition-colors hover:bg-surface-hover hover:text-accent-red"
        >
          <Unlink className="h-3 w-3" />
          Unlink
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={handleLink}
        disabled={linking}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-accent-500/30 bg-accent-500/5 px-4 py-2.5 text-sm font-medium text-accent-500 transition-colors hover:bg-accent-500/10 disabled:opacity-50"
      >
        {linking ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        {linking ? "Linking..." : isConnecting ? "Connecting..." : "Link Crypto Wallet"}
      </button>
      <p className="mt-1.5 text-[11px] text-text-tertiary">
        Sign a message to prove wallet ownership. No gas fee.
      </p>
      {error && (
        <div className="mt-2 flex items-start gap-1.5 rounded-md bg-accent-red/10 px-3 py-2 text-xs text-accent-red">
          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
