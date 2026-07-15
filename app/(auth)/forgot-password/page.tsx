"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { requestPasswordReset } from "@/lib/data/auth"
import { ApiError } from "@/lib/api/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10">
            <CheckCircle className="h-6 w-6 text-brand-green" />
          </div>
          <h2 className="mb-2 font-display text-2xl font-bold text-brand-text">Check your email</h2>
          <p className="mb-6 text-sm text-brand-text-mid">
            If an account with that email exists, we&apos;ve sent a password reset link.
          </p>
          <Link href="/sign-in" className="text-sm text-brand-green hover:text-accent-600">
            Back to sign in
          </Link>
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
              <Mail className="h-6 w-6 text-brand-green" />
            </div>
            <h2 className="font-display text-2xl font-bold text-brand-text">Forgot password?</h2>
            <p className="mt-1.5 text-sm text-brand-text-mid">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-brand-text-mid">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-accent-red/10 border border-accent-red/20 px-4 py-2.5">
                <p className="text-sm text-accent-red">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-brand-text-mid">
          <Link href="/sign-in" className="inline-flex items-center gap-1 font-semibold text-brand-green hover:text-accent-600">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
