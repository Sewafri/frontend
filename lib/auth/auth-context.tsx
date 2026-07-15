"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { api, storeTokens, clearTokens, getStoredTokens } from "@/lib/api/client"
import type { User } from "@/types/db"
import type { AuthContextValue, LoginInput, RegisterInput, AuthResponse } from "./types"

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const data = await api<{ user: User }>("/users/me")
      setUser(data.user)
    } catch {
      setUser(null)
      clearTokens()
    }
  }, [])

  useEffect(() => {
    const tokens = getStoredTokens()
    if (tokens.refreshToken) {
      fetchUser().finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [fetchUser])

  const login = useCallback(async (input: LoginInput) => {
    const data = await api<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    })
    storeTokens(data.accessToken, data.refreshToken)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    const data = await api<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    })
    storeTokens(data.accessToken, data.refreshToken)
    setUser(data.user)
    return data.user
  }, [])

  const loginWithGoogle = useCallback(async (
    idToken: string,
    role?: "STUDENT" | "INSTRUCTOR",
  ) => {
    const data = await api<AuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken, role }),
    })
    storeTokens(data.accessToken, data.refreshToken)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    const { refreshToken } = getStoredTokens()
    if (refreshToken) {
      try {
        await api("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        })
      } catch {
        // idempotent — always clear local state
      }
    }
    clearTokens()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
