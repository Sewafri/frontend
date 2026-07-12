"use client";

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND } from "@/constants/brand";
import { useAuth } from "@/lib/auth/auth-context";
import { ApiError } from "@/lib/api/client";
import { useGoogleAuth } from "@/hooks/use-google-auth";

export default function SignUpPage() {
  const router = useRouter();
  const { register, googleLogin } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSuccess = useCallback(async (idToken: string) => {
    setError(null);
    setGoogleLoading(true);
    try {
      const user = await googleLogin({ idToken });
      if (user.role === "ADMIN") router.push("/admin");
      else if (user.role === "INSTRUCTOR") router.push("/instructor");
      else router.push("/my-learning");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Google sign-up failed");
      }
    } finally {
      setGoogleLoading(false);
    }
  }, [googleLogin, router]);

  const handleGoogleError = useCallback((err: Error) => {
    setError(err.message);
  }, []);

  const { isReady: isGoogleReady, renderButton } = useGoogleAuth({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isGoogleReady && googleButtonRef.current) {
      renderButton(googleButtonRef.current);
    }
  }, [isGoogleReady, renderButton]);

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
      if (user.role === "ADMIN") router.push("/admin");
      else if (user.role === "INSTRUCTOR") router.push("/instructor");
      else router.push("/my-learning");
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
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-border-default bg-surface-card p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/10">
            <User size={20} className="text-accent-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Create your account
          </h2>
          <p className="mt-1.5 text-sm text-text-secondary">
            Start learning with {BRAND.name} today
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative h-10 w-full rounded-md overflow-hidden">
              <div 
                ref={googleButtonRef} 
                className={`absolute inset-0 flex items-center justify-center bg-surface-card border border-border-default rounded-md transition-opacity duration-300 ${!isGoogleReady ? 'opacity-50' : 'opacity-100'}`}
              >
                {!isGoogleReady && (
                  <span className="text-xs text-text-tertiary">Loading...</span>
                )}
              </div>
              {googleLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-card/80 backdrop-blur-sm">
                  <svg className="size-4 animate-spin text-text-secondary" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              disabled
              className="text-text-secondary h-10"
            >
              <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-default" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface-card px-2 text-text-tertiary">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-sm text-text-secondary">
                  First Name
                </Label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-sm text-text-secondary">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-text-secondary">
                Email
              </Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-text-secondary">
                Password
              </Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-accent-red/10 border border-accent-red/20 px-4 py-2.5">
                <p className="text-sm text-accent-red">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-500 py-2.5 text-base font-semibold text-white transition-all hover:bg-accent-600 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-accent-500 transition-colors hover:text-accent-600"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
