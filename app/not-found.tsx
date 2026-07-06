"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-dark p-6">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl border border-border-subtle bg-surface-card p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange/10">
            <span className="text-4xl font-bold text-brand-orange">404</span>
          </div>
          <h1 className="mb-2 text-xl font-semibold text-text-primary">Page Not Found</h1>
          <p className="mb-8 text-sm text-text-secondary">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-brand-orange/90"
            >
              <Home className="h-4 w-4" /> Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border-subtle px-6 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
