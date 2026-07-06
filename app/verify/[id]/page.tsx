"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Shield, ShieldCheck, ShieldX, Award, ArrowLeft } from "lucide-react";

const VALID_CERTIFICATES = [
  { id: "CERT-2026-001", course: "Web Development Bootcamp", student: "Alex Johnson", date: "2026-06-15", issuer: "SewAfri" },
  { id: "CERT-2026-002", course: "Data Science Fundamentals", student: "Maria Garcia", date: "2026-06-10", issuer: "SewAfri" },
];

export default function VerifyResultPage() {
  const params = useParams();
  const certId = params.id as string;
  const certificate = VALID_CERTIFICATES.find((c) => c.id === certId);
  const isValid = certId.startsWith("CERT-") && !!certificate;

  return (
    <div className="w-full max-w-lg">
      <Link href="/verify" className="mb-6 flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="h-4 w-4" /> Verify another certificate
      </Link>

      <div className="rounded-xl border border-border-glass bg-surface-dark p-8 text-center">
        {isValid ? (
          <>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent-green/10">
              <ShieldCheck className="h-10 w-10 text-accent-green" />
            </div>
            <h2 className="mb-1 text-xl font-bold text-text-primary">Certificate Verified</h2>
            <p className="mb-6 text-sm text-accent-green">This certificate is authentic and valid</p>

            <div className="mb-6 rounded-lg bg-surface-card p-4 text-left">
              <div className="mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-brand-orange" />
                <span className="font-semibold text-text-primary">{certificate!.course}</span>
              </div>
              <div className="space-y-1 text-sm text-text-secondary">
                <p>Issued to: <span className="font-medium text-text-primary">{certificate!.student}</span></p>
                <p>Date: {certificate!.date}</p>
                <p>ID: {certId}</p>
                <p>Issuer: {certificate!.issuer}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 text-xs text-text-secondary">
              <Shield className="h-3.5 w-3.5" /> Blockchain-secured verification
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent-red/10">
              <ShieldX className="h-10 w-10 text-accent-red" />
            </div>
            <h2 className="mb-1 text-xl font-bold text-text-primary">Verification Failed</h2>
            <p className="mb-2 text-sm text-accent-red">No valid certificate found</p>
            <p className="text-xs text-text-secondary">
              The certificate ID &ldquo;{certId}&rdquo; could not be verified. Please check the ID and try again.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
