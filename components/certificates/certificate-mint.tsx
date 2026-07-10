"use client"

import { useState } from "react"
import { Diamond, Wallet, Loader2, Check, AlertCircle } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { getCertificateClaimSignature, mintCertificateDirect } from "@/lib/data/smart-contracts"
import { getSigner, sendTransaction } from "@/lib/web3/provider"
import { ethers } from "ethers"

interface Props {
  certificateId: string
  alreadyMinted: boolean
  txHash: string | null
  network: string | null
  onMinted: (txHash: string, network: string) => void
}

export function CertificateMint({ certificateId, alreadyMinted, txHash, network, onMinted }: Props) {
  const { address: walletAddress, isInstalled, connect } = useWallet()
  const [method, setMethod] = useState<"lazy" | "direct">("direct")
  const [status, setStatus] = useState<"idle" | "connecting" | "signing" | "sending" | "done" | "error">("idle")
  const [statusLabel, setStatusLabel] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [resultTxHash, setResultTxHash] = useState<string | null>(null)
  const [resultNetwork, setResultNetwork] = useState<string | null>(null)

  if (alreadyMinted) {
    return (
      <div className="rounded-lg border border-accent-green/20 bg-accent-green/5 p-4">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-accent-green" />
          <span className="text-sm font-medium text-text-primary">Already minted on-chain</span>
        </div>
        {txHash && (
          <p className="mt-1 truncate text-[10px] text-text-tertiary">
            Tx: {txHash} ({network})
          </p>
        )}
      </div>
    )
  }

  async function handleMint() {
    setErrorMsg(null)
    setResultTxHash(null)
    setStatus("idle")

    if (method === "direct") {
      setStatus("sending")
      setStatusLabel("Minting certificate...")
      try {
        const result = await mintCertificateDirect(certificateId)
        setResultTxHash(result.transactionHash)
        setResultNetwork(result.network)
        setStatus("done")
        onMinted(result.transactionHash, result.network)
      } catch (err: unknown) {
        setStatus("error")
        setErrorMsg(err instanceof Error ? err.message : "Minting failed.")
      }
      return
    }

    // Lazy mint: student approves via EIP-712 typed data
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

    try {
      setStatus("signing")
      setStatusLabel("Preparing certificate claim...")
      const claim = await getCertificateClaimSignature(certificateId)
      if (!claim.typedData) {
        setStatus("error")
        setErrorMsg("No claim data available for this certificate.")
        return
      }

      setStatusLabel("Sign claim in wallet...")
      const s = await getSigner()
      if (!s) {
        setStatus("error")
        setErrorMsg("Could not get wallet signer.")
        return
      }
      const studentSig = await s.signTypedData(
        claim.typedData.domain as any,
        claim.typedData.types as any,
        claim.typedData.message as any,
      )
      if (!studentSig) {
        setStatus("error")
        setErrorMsg("Signing rejected.")
        return
      }

      setStatus("sending")
      setStatusLabel("Sending claim transaction...")
      const iface = new ethers.Interface([
        "function claimCertificate(address student,uint256 courseId,uint256 completedAt,uint256 nonce,uint256 expiry,string tokenUri,bytes signature)",
      ])
      const data = iface.encodeFunctionData("claimCertificate", [
        claim.student,
        claim.courseId,
        claim.completedAt,
        claim.nonce,
        claim.expiry,
        claim.tokenUri,
        claim.signature,
      ])
      const hash = await sendTransaction(claim.typedData.domain.verifyingContract, data)
      if (!hash) {
        setStatus("error")
        setErrorMsg("Transaction rejected.")
        return
      }
      setResultTxHash(hash)
      setResultNetwork(claim.typedData.domain.chainId.toString())
      setStatus("done")
      onMinted(hash, claim.typedData.domain.chainId.toString())
    } catch (err: unknown) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Lazy minting failed.")
    }
  }

  return (
    <div className="rounded-lg border border-border-default bg-surface-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Diamond className="h-4 w-4 text-accent-500" />
        <span className="text-sm font-medium text-text-primary">Mint as NFT</span>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <label className="flex items-center gap-1.5 text-xs text-text-secondary">
          <input
            type="radio"
            name="mint-method"
            checked={method === "direct"}
            onChange={() => setMethod("direct")}
            className="accent-accent-500"
          />
          Direct mint (platform pays gas)
        </label>
        <label className="flex items-center gap-1.5 text-xs text-text-secondary">
          <input
            type="radio"
            name="mint-method"
            checked={method === "lazy"}
            onChange={() => setMethod("lazy")}
            className="accent-accent-500"
          />
          Lazy mint (I pay gas)
        </label>
      </div>

      <button
        onClick={handleMint}
        disabled={status === "sending" || status === "signing" || status === "connecting" || status === "done"}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-accent-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-500/90 disabled:opacity-50"
      >
        {status === "sending" || status === "signing" || status === "connecting" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : status === "done" ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          method === "lazy" ? <Wallet className="h-3.5 w-3.5" /> : <Diamond className="h-3.5 w-3.5" />
        )}
        {status === "connecting" ? "Connecting..." :
         status === "signing" ? "Sign in Wallet..." :
         status === "sending" ? "Processing..." :
         status === "done" ? "Minted!" :
         "Mint Certificate"}
      </button>

      {resultTxHash && (
        <div className="mt-2 flex items-center gap-1.5 rounded-md bg-accent-green/10 px-3 py-2 text-xs text-accent-green">
          <Check className="h-3 w-3 shrink-0" />
          <span className="truncate">Tx: {resultTxHash.slice(0, 14)}...</span>
        </div>
      )}

      {errorMsg && (
        <div className="mt-2 flex items-start gap-1.5 rounded-md bg-accent-red/10 px-3 py-2 text-xs text-accent-red">
          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  )
}


