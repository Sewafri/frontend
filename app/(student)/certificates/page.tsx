"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { BlockchainBadge } from "@/components/blockchain/blockchain-badge";
import { BlockchainProof } from "@/components/blockchain/blockchain-proof";
import { getMyWallet } from "@/lib/data/wallet";
import { Award, Download, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Certificate } from "@/types/db";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyWallet()
      .then((data) => {
        setCertificates(data.certificates as Certificate[]);
      })
      .catch(() => {
        // silently fall back to empty
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader
          title="My Certificates"
          description="View and download your course completion certificates"
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-text-tertiary" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Certificates"
        description="View and download your course completion certificates"
      />

      {certificates.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Link
              key={cert.id}
              href={`/certificates/${cert.id}`}
              className="group block"
            >
              <GlassCard className="h-full transition-all hover:border-accent-500/30">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-500/10">
                    <Award className="h-7 w-7 text-accent-500" />
                  </div>
                  <BlockchainBadge
                    record={cert.blockchainRecord ?? null}
                    anchorStatus={cert.blockchainRecord?.anchorStatus ?? null}
                  />
                </div>
                <h3 className="mb-1 font-semibold text-text-primary">{cert.courseTitle}</h3>
                <p className="mb-4 text-xs text-text-secondary">
                  {cert.issueDate
                    ? new Date(cert.issueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </p>
                <div className="flex items-center gap-3 border-t border-border-default pt-4">
                  <span className="flex cursor-default items-center gap-1.5 text-xs font-medium text-accent-500">
                    <Download className="h-3.5 w-3.5" /> Download
                  </span>
                  <Link
                    href={`/verify/${cert.certificateNumber}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Verify
                  </Link>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      ) : (
        <GlassCard>
          <div className="flex flex-col items-center justify-center py-16">
            <Award className="mb-3 h-12 w-12 text-text-tertiary" />
            <p className="text-lg font-medium text-text-primary">No certificates yet</p>
            <p className="mt-1 text-sm text-text-secondary">Complete courses to earn certificates</p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
