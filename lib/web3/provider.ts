"use client"

import { BrowserProvider, JsonRpcSigner } from "ethers"

let provider: BrowserProvider | null = null
let signer: JsonRpcSigner | null = null

export async function getProvider(): Promise<BrowserProvider | null> {
  if (typeof window === "undefined") return null
  if (provider) return provider
  if (!window.ethereum) return null
  provider = new BrowserProvider(window.ethereum)
  return provider
}

export async function getSigner(): Promise<JsonRpcSigner | null> {
  if (signer) return signer
  const p = await getProvider()
  if (!p) return null
  signer = await p.getSigner()
  return signer
}

export async function connectWallet(): Promise<string | null> {
  const p = await getProvider()
  if (!p) return null

  signer = null
  const accounts: string[] = await p.send("eth_requestAccounts", [])
  if (!accounts || accounts.length === 0) return null

  const s = await p.getSigner()
  signer = s
  return accounts[0]
}

export async function getConnectedAddress(): Promise<string | null> {
  if (typeof window === "undefined") return null
  if (!window.ethereum) return null
  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    }) as string[]
    return accounts?.[0] ?? null
  } catch {
    return null
  }
}

export async function signMessage(message: string): Promise<string | null> {
  const s = await getSigner()
  if (!s) return null
  try {
    return await s.signMessage(message)
  } catch {
    return null
  }
}

export async function sendTransaction(
  to: string,
  data: string,
  value?: string,
): Promise<string | null> {
  const s = await getSigner()
  if (!s) return null
  try {
    const tx = await s.sendTransaction({ to, data, value: value ?? "0x0" })
    return tx.hash
  } catch {
    return null
  }
}

export async function switchChain(chainIdHex: string): Promise<boolean> {
  if (typeof window === "undefined" || !window.ethereum) return false
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    })
    return true
  } catch {
    return false
  }
}

export function isMetaMaskInstalled(): boolean {
  if (typeof window === "undefined") return false
  return !!window.ethereum?.isMetaMask
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: {
        method: string
        params?: unknown[]
      }) => Promise<unknown>
      on: (event: string, cb: (...args: unknown[]) => void) => void
      removeListener: (event: string, cb: (...args: unknown[]) => void) => void
    }
  }
}
