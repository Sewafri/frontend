"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"
import { useAuth } from "@/lib/auth/auth-context"
import { ApiError } from "@/lib/api/client"

type GoogleAuthButtonProps = {
  /** Role applied only for first-time Google sign-up. */
  role?: "STUDENT" | "INSTRUCTOR"
  text?: "signin_with" | "signup_with" | "continue_with" | "signin"
  onError?: (message: string) => void
}

function redirectForRole(role: string, router: ReturnType<typeof useRouter>) {
  if (role === "ADMIN") router.push("/admin")
  else if (role === "INSTRUCTOR") router.push("/instructor")
  else router.push("/my-learning")
}

export function GoogleAuthButton({
  role,
  text = "continue_with",
  onError,
}: GoogleAuthButtonProps) {
  const router = useRouter()
  const { loginWithGoogle } = useAuth()
  const [busy, setBusy] = useState(false)

  async function handleSuccess(response: CredentialResponse) {
    if (!response.credential) {
      onError?.("Google sign-in failed. Please try again.")
      return
    }

    setBusy(true)
    try {
      const user = await loginWithGoogle(response.credential, role)
      redirectForRole(user.role, router)
    } catch (err) {
      if (err instanceof ApiError) {
        onError?.(err.message)
      } else {
        onError?.("Google sign-in failed. Please try again.")
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className={`flex w-full justify-center overflow-hidden rounded-lg ${
        busy ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError?.("Google sign-in was cancelled or failed.")}
        theme="outline"
        size="large"
        text={text}
        shape="rectangular"
        width="352"
        logo_alignment="center"
        use_fedcm_for_prompt
      />
    </div>
  )
}
