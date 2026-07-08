"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Shield, ShieldCheck, ShieldX, Award, ArrowLeft } from "lucide-react";
import { verifyCertificate } from "@/lib/data/verify";
import type { Certificate } from "@/types/db";

export default function VerifyResultPage() {
  const params = useParams();
  const certId = params.id as string;
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    verifyCertificate(certId)
      .then((data) => setCertificate(data.certificate))
      .catch((err) => setError(err.message ?? "Verification failed"))
      .finally(() => setLoading(false));
  }, [certId]);

  const isValid = !!certificate;

  return (
    <div className="w-full max-w-lg">
      <Link href="/verify" className="mb-6 flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="h-4 w-4" /> Verify another certificate
      </Link>

      <div className="rounded-xl border border-border-glass bg-surface-dark p-8 text-center">
        {loading && (
          <p className="text-sm text-text-secondary">Verifying certificate...</p>
        )}

        {error && !loading && (
          <>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent-red/10">
              <ShieldX className="h-10 w-10 text-accent-red" />
            </div>
            <h2 className="mb-1 text-xl font-bold text-text-primary">Verification Failed</h2>
            <p className="mb-2 text-sm text-accent-red">{error}</p>
            <p className="text-xs text-text-secondary">
              The certificate ID &ldquo;{certId}&rdquo; could not be verified.
            </p>
          </>
        )}

        {isValid && !loading && (
          <>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent-green/10">
              <ShieldCheck className="h-10 w-10 text-accent-green" />
            </div>
            <h2 className="mb-1 text-xl font-bold text-text-primary">Certificate Verified</h2>
            <p className="mb-6 text-sm text-accent-green">This certificate is authentic and valid</p>

            <div className="mb-6 rounded-lg bg-surface-card p-4 text-left">
              <div className="mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-accent-500" />
                <span className="font-semibold text-text-primary">{certificate.courseTitle}</span>
              </div>
              <div className="space-y-1 text-sm text-text-secondary">
                <p>Issued to: <span className="font-medium text-text-primary">{certificate.studentName}</span></p>
                <p>Date: {new Date(certificate.issueDate).toLocaleDateString()}</p>
                <p>ID: {certificate.certificateNumber}</p>
                <p>Issuer: {certificate.issuerName}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 text-xs text-text-secondary">
              <Shield className="h-3.5 w-3.5" /> Blockchain-secured verification
            </div>
          </>
        )}
      </div>
    </div>
  );
}
