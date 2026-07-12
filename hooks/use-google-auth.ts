"use client"

import { useEffect, useRef, useState, useCallback } from "react"

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""
const SCRIPT_SRC = "https://accounts.google.com/gsi/client"

interface UseGoogleAuthOptions {
  onSuccess: (idToken: string) => void
  onError?: (error: Error) => void
}

/**
 * Loads the Google Identity Services (GIS) library and provides a
 * `renderButton` function that creates the official Google Sign-In button.
 */
export function useGoogleAuth({ onSuccess, onError }: UseGoogleAuthOptions) {
  const [isReady, setIsReady] = useState(false)
  const initializedRef = useRef(false)
  const callbacksRef = useRef({ onSuccess, onError })

  useEffect(() => {
    callbacksRef.current = { onSuccess, onError }
  }, [onSuccess, onError])

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set — Google sign-in will not work.")
      return
    }

    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      if (typeof window.google !== "undefined" && window.google.accounts) {
        initGsi()
      } else {
        existing.addEventListener("load", initGsi)
      }
      return
    }

    const script = document.createElement("script")
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = initGsi
    script.onerror = () => callbacksRef.current.onError?.(new Error("Failed to load Google Identity Services script"))
    document.head.appendChild(script)

    function initGsi() {
      if (!window.google?.accounts?.id) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: google.accounts.id.CredentialResponse) => {
          if (response.credential) {
            callbacksRef.current.onSuccess(response.credential)
          } else {
            callbacksRef.current.onError?.(new Error("Google sign-in did not return a credential"))
          }
        },
      })
      initializedRef.current = true
      setIsReady(true)
    }
  }, [])

  const renderButton = useCallback((container: HTMLElement) => {
    if (!initializedRef.current || !window.google?.accounts?.id) return
    window.google.accounts.id.renderButton(container, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      logo_alignment: "center",
      width: container.offsetWidth > 0 ? container.offsetWidth : undefined,
    })
  }, [])

  return { isReady, renderButton }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace google.accounts.id {
    interface CredentialResponse {
      credential: string
      select_by?: string
    }

    interface RenderButtonOptions {
      type?: "standard" | "icon"
      theme?: "outline" | "filled_blue" | "filled_black"
      size?: "large" | "medium" | "small"
      text?: "signin_with" | "signup_with" | "continue_with" | "signin"
      shape?: "rectangular" | "pill" | "circle" | "square"
      logo_alignment?: "left" | "center"
      width?: string | number
      locale?: string
    }

    function initialize(config: {
      client_id: string
      callback: (response: CredentialResponse) => void
      auto_select?: boolean
      cancel_on_tap_outside?: boolean
    }): void

    function renderButton(parent: HTMLElement, options: RenderButtonOptions): void
  }

  interface Window {
    google?: {
      accounts: {
        id: typeof google.accounts.id
      }
    }
  }
}
