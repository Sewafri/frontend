"use client"

import { useState, useEffect, useCallback } from "react"
import {
  connectWallet,
  getConnectedAddress,
  signMessage,
  isMetaMaskInstalled,
} from "@/lib/web3/provider"

export interface WalletState {
  address: string | null
  isConnecting: boolean
  isInstalled: boolean
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnecting: false,
    isInstalled: false,
  })

  useEffect(() => {
    setState((prev) => ({ ...prev, isInstalled: isMetaMaskInstalled() }))
    getConnectedAddress().then((addr) => {
      if (addr) setState((prev) => ({ ...prev, address: addr }))
    })
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return

    const handleAccountsChanged = (accounts: unknown) => {
      const addr = (accounts as string[])?.[0] ?? null
      setState((prev) => ({ ...prev, address: addr }))
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
    }
  }, [])

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isConnecting: true }))
    try {
      const addr = await connectWallet()
      if (addr) setState((prev) => ({ ...prev, address: addr }))
      return addr
    } finally {
      setState((prev) => ({ ...prev, isConnecting: false }))
    }
  }, [])

  const sign = useCallback(async (message: string): Promise<string | null> => {
    return signMessage(message)
  }, [])

  return { ...state, connect, sign }
}
