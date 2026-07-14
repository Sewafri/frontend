"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND } from "@/constants/brand";
import { useAuth } from "@/lib/auth/auth-context";
import { useGoogleSignIn } from "@/lib/auth/use-google-signin";
import { ApiError } from "@/lib/api/client";
import { PasswordStrength } from "../_components/password-strength";
import { showToast } from "../_components/toast";
import { ConfettiCanvas } from "../_components/confetti-canvas";

export default function SignUpPage() {
  const router = useRouter();
  const { register, googleSignIn: authGoogleSignIn } = useAuth();
  const { configured: googleConfigured, signInWithGoogle } = useGoogleSignIn();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleGoogleSignUp() {
    setError(null);
    setGoogleLoading(true);
    try {
      const credential = await signInWithGoogle();
      const user = await authGoogleSignIn(credential);
      setSuccess(true);
      showToast("Account created successfully!", "success");
      setTimeout(() => {
        if (user.role === "ADMIN") router.push("/admin");
        else if (user.role === "INSTRUCTOR") router.push("/instructor");
        else router.push("/my-learning");
      }, 800);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Google sign-in failed");
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        fullName: `${firstName} ${lastName}`.trim(),
        email,
        password,
      });
      setSuccess(true);
      showToast("Account created successfully! 🎉", "success");
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
            Create your account
          </h2>
          <p className="mt-1 text-sm text-landing-text-light">
            Start learning with {BRAND.name} today
          </p>
        </div>

        {/* Social buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleGoogleSignUp}
            disabled={!googleConfigured || googleLoading || success}
            className="auth-social-btn"
          >
            {googleLoading ? (
              <svg className="mr-2 size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              </svg>
            )}
            {googleLoading ? "Signing in..." : "Google"}
          </Button>
          <Button
            variant="outline"
            disabled
            className="auth-social-btn"
          >
            <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </Button>
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
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-sm font-medium text-landing-text">
                First Name
              </Label>
              <div className="relative">
                <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-landing-text-light" />
                <Input
                  id="firstName"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="auth-input pl-[38px]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-sm font-medium text-landing-text">
                Last Name
              </Label>
              <div className="relative">
                <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-landing-text-light" />
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="auth-input pl-[38px]"
                />
              </div>
            </div>
          </div>

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
            <Label htmlFor="password" className="text-sm font-medium text-landing-text">
              Password
            </Label>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-landing-text-light" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
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
            <PasswordStrength password={password} />
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
                Creating account...
              </span>
            ) : success ? (
              <span className="flex items-center gap-2">
                <Check size={18} />
                Created!
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Switch to sign in */}
        <p className="text-center text-sm text-landing-text-light">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-landing-green transition-colors hover:text-landing-green-dark"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
