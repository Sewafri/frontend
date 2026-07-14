"use client"

import { useState, type FormEvent, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Lock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { confirmPasswordReset } from "@/lib/data/auth"
import { ApiError } from "@/lib/api/client"

export default function ResetPasswordPage(props: { searchParams: Promise<{ token?: string }> }) {
  const router = useRouter()
  const searchParams = use(props.searchParams)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const token = searchParams.token

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    if (!token) {
      setError("Missing reset token")
      return
    }

    setLoading(true)
    try {
      await confirmPasswordReset(token, password)
      setDone(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <h2 className="mb-2 font-display text-2xl font-bold text-brand-text">Invalid link</h2>
          <p className="mb-6 text-sm text-brand-text-mid">This reset link is missing or invalid.</p>
          <Link href="/forgot-password" className="text-sm text-brand-green hover:text-accent-600">
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10">
            <CheckCircle className="h-6 w-6 text-brand-green" />
          </div>
          <h2 className="mb-2 font-display text-2xl font-bold text-brand-text">Password reset</h2>
          <p className="mb-6 text-sm text-brand-text-mid">Your password has been reset successfully.</p>
          <Button onClick={() => router.push("/sign-in")}>Sign in</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-brand-border bg-brand-card p-8 shadow-sm">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green-light">
              <Lock className="h-6 w-6 text-brand-green" />
            </div>
            <h2 className="font-display text-2xl font-bold text-brand-text">Set new password</h2>
            <p className="mt-1.5 text-sm text-brand-text-mid">Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-brand-text-mid">New password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm" className="text-sm text-brand-text-mid">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-accent-red/10 border border-accent-red/20 px-4 py-2.5">
                <p className="text-sm text-accent-red">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
