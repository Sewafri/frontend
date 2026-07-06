import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BRAND } from "@/constants/brand";

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md rounded-lg border border-border-subtle bg-surface-card p-8">
      <div className="text-center space-y-1.5">
        <h2 className="font-space-grotesk text-2xl font-bold text-white">
          Create Your Account
        </h2>
        <p className="text-sm text-text-secondary">
          Start learning with {BRAND.name} today
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="cursor-pointer border-border-subtle text-text-secondary transition-colors hover:bg-surface-card-hover hover:text-white"
          >
            <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer border-border-subtle text-text-secondary transition-colors hover:bg-surface-card-hover hover:text-white"
          >
            <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Separator className="flex-1 bg-border-subtle" />
          <span className="text-xs text-text-secondary">OR</span>
          <Separator className="flex-1 bg-border-subtle" />
        </div>

        {/* Registration form */}
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm text-text-secondary">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                className="border-border-subtle bg-transparent text-white placeholder:text-text-tertiary transition-colors focus-visible:border-brand-orange/50 focus-visible:ring-brand-orange/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm text-text-secondary">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="border-border-subtle bg-transparent text-white placeholder:text-text-tertiary transition-colors focus-visible:border-brand-orange/50 focus-visible:ring-brand-orange/20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-text-secondary">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="border-border-subtle bg-transparent text-white placeholder:text-text-tertiary transition-colors focus-visible:border-brand-orange/50 focus-visible:ring-brand-orange/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-text-secondary">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              className="border-border-subtle bg-transparent text-white placeholder:text-text-tertiary transition-colors focus-visible:border-brand-orange/50 focus-visible:ring-brand-orange/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm text-text-secondary">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="border-border-subtle bg-transparent text-white placeholder:text-text-tertiary transition-colors focus-visible:border-brand-orange/50 focus-visible:ring-brand-orange/20"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-brand-orange py-5 text-base font-semibold text-white transition-colors hover:bg-brand-orange/90"
          >
            Create Account
          </Button>
        </form>
      </div>

      <div className="flex items-center justify-center border-t border-border-subtle pt-6">
        <p className="text-sm text-text-secondary">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="cursor-pointer font-medium text-brand-orange transition-colors hover:text-brand-orange/80"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
