"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton } from "@/components/forms/google-auth-button";
import { BRAND } from "@/constants/brand";
import { useAuth } from "@/lib/auth/auth-context";
import { ApiError } from "@/lib/api/client";
import { showToast } from "../_components/toast";
import { ConfettiCanvas } from "../_components/confetti-canvas";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login({ email, password });
      setSuccess(true);
      showToast("Signed in successfully!", "success");
      setTimeout(() => {
        if (user.role === "ADMIN") router.push("/admin");
        else if (user.role === "INSTRUCTOR") router.push("/instructor");
        else router.push("/my-learning");
      }, 800);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {success && <ConfettiCanvas />}
      <div className="space-y-6">
        {/* Heading */}
        <div>
          <h2 className="text-xl font-bold text-landing-text">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-landing-text-light">
            Sign in to your {BRAND.name} account
          </p>
        </div>

        {/* Social buttons */}
        <div className="space-y-3">
          <GoogleAuthButton
            text="signin_with"
            onError={setError}
          />
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-landing-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-landing-card px-2 text-landing-text-light">Or continue with</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-landing-text">
              Email
            </Label>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-landing-text-light" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input pl-[38px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-landing-text">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-landing-green transition-colors hover:text-landing-green-dark"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-landing-text-light" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input pl-[38px] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-landing-text-light transition-colors hover:text-landing-text"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading || success}
            className="auth-submit-btn"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
            ) : success ? (
              <span className="flex items-center gap-2">
                <Check size={18} />
                Signed in!
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Switch to sign up */}
        <p className="text-center text-sm text-landing-text-light">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-landing-green transition-colors hover:text-landing-green-dark"
          >
            Create one
          </Link>
        </p>
      </div>
    </>
  );
}
