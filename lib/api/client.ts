import { toast } from "sonner"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://backend-gsqo.onrender.com/api/v1"

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

function getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
  if (typeof window === "undefined") return { accessToken: null, refreshToken: null }
  try {
    const raw = localStorage.getItem("auth_tokens")
    if (!raw) return { accessToken: null, refreshToken: null }
    const parsed = JSON.parse(raw)
    return {
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
    }
  } catch {
    return { accessToken: null, refreshToken: null }
  }
}

function storeTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("auth_tokens", JSON.stringify({ accessToken, refreshToken }))
}

function clearTokens() {
  if (typeof window === "undefined") return
  localStorage.removeItem("auth_tokens")
}

export { getStoredTokens, storeTokens, clearTokens }

type RefreshResult = { accessToken: string; refreshToken: string } | null

let refreshPromise: Promise<RefreshResult> | null = null

async function attemptRefresh(): Promise<RefreshResult> {
  const { refreshToken } = getStoredTokens()
  if (!refreshToken) return null

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })

    if (!res.ok) {
      clearTokens()
      return null
    }

    const json = await res.json()
    if (!json.success) {
      clearTokens()
      return null
    }

    const { accessToken: newAccess, refreshToken: newRefresh } = json.data
    storeTokens(newAccess, newRefresh)
    return { accessToken: newAccess, refreshToken: newRefresh }
  } catch {
    clearTokens()
    return null
  }
}

type ApiOptions = RequestInit & { params?: Record<string, string | undefined>; silent?: boolean }

async function handleApiError(res: Response, json: unknown, silent?: boolean) {
  const msg = json && typeof json === "object" && "message" in json
    ? (json as { message: string }).message
    : `Request failed with status ${res.status}`
  const code = json && typeof json === "object" && "code" in json
    ? (json as { code: string }).code
    : "UNKNOWN_ERROR"
  if (!silent) toast.error(msg)
  throw new ApiError(res.status, code, msg)
}

export async function api<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { params, silent, ...fetchOptions } = options

  let url = `${BASE_URL}${path}`
  if (params) {
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) searchParams.set(key, value)
    }
    const qs = searchParams.toString()
    if (qs) url += `?${qs}`
  }

  const headers = new Headers(fetchOptions.headers as Record<string, string> ?? {})

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const { accessToken } = getStoredTokens()
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`)
  }

  let res: Response
  try {
    res = await fetch(url, { ...fetchOptions, headers })
  } catch {
    const msg = "Unable to reach the server. Is the backend running?"
    toast.error(msg)
    throw new ApiError(0, "NETWORK_ERROR", msg)
  }

  if (res.status === 204) {
    return undefined as T
  }

  if (res.status === 401 && !path.includes("/auth/")) {
    const tokens = await (refreshPromise ??= attemptRefresh())
    refreshPromise = null

    if (tokens) {
      headers.set("Authorization", `Bearer ${tokens.accessToken}`)
      try {
        res = await fetch(url, { ...fetchOptions, headers })
      } catch {
        throw new ApiError(0, "NETWORK_ERROR", "Unable to reach the server. Is the backend running?")
      }
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in"
      }
      throw new ApiError(401, "UNAUTHORIZED", "Session expired. Please sign in again.")
    }
  }

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    await handleApiError(res, json, silent)
  }

  if (json && typeof json === "object" && "success" in json) {
    if (json.success === true && "data" in json) {
      return json.data as T
    }
    await handleApiError(res, json, silent)
  }

  return json as T
}

export async function apiMutate<T>(
  path: string,
  options: ApiOptions = {},
  successMessage?: string,
): Promise<T> {
  const result = await api<T>(path, options)
  if (successMessage) toast.success(successMessage)
  return result
}
