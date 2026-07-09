"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, QrCode, Shield } from "lucide-react";

export default function VerifyHomePage() {
  const [certId, setCertId] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (certId.trim()) {
      router.push(`/verify/${certId.trim()}`);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/10">
          <Shield className="h-8 w-8 text-accent-500" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Certificate Verification</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Enter a certificate ID or scan a QR code to verify authenticity
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            placeholder="Enter certificate ID (e.g., CERT-2026-001)"
            aria-label="Certificate ID"
            className="w-full cursor-pointer rounded-xl border border-border-default bg-surface-card py-3.5 pl-12 pr-4 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/20"
          />
        </div>
        <button
          type="submit"
          disabled={!certId.trim()}
          className="mt-4 w-full cursor-pointer rounded-xl bg-accent-500 py-3 font-medium text-text-on-accent transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Verify Certificate
        </button>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-default" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface-dark px-2 text-text-secondary">or</span>
        </div>
      </div>

      <div className="rounded-xl border-2 border-dashed border-border-default p-8 text-center transition-colors hover:border-accent-500/50">
        <QrCode className="mx-auto mb-3 h-10 w-10 text-text-secondary" />
        <p className="text-sm font-medium text-text-primary">Scan QR Code</p>
        <p className="mt-1 text-xs text-text-secondary">
          Upload a screenshot of the certificate QR code
        </p>
        <button className="mt-4 cursor-pointer rounded-lg bg-surface-card px-6 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-card-hover">
          Upload Image
        </button>
      </div>
    </div>
  );
}
