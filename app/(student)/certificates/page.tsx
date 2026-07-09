"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { BlockchainBadge } from "@/components/blockchain/blockchain-badge";
import { getMyWallet, downloadCertificate } from "@/lib/data/wallet";
import { Award, Download, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Certificate } from "@/types/db";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

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

  const handleDownload = async (certId: string) => {
    setDownloading(certId);
    try {
      await downloadCertificate(certId);
    } catch {
      // silently fail
    } finally {
      setDownloading(null);
    }
  };

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
            <div key={cert.id} className="group block">
              <GlassCard className="h-full transition-all hover:border-accent-500/30">
                <div className="mb-4 flex items-start justify-between">
                  <Link href={`/certificates/${cert.id}`}>
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-500/10">
                      <Award className="h-7 w-7 text-accent-500" />
                    </div>
                  </Link>
                  <BlockchainBadge
                    record={cert.blockchainRecord ?? null}
                    anchorStatus={cert.blockchainRecord?.anchorStatus ?? null}
                  />
                </div>
                <Link href={`/certificates/${cert.id}`}>
                  <h3 className="mb-1 font-semibold text-text-primary hover:text-accent-500">{cert.courseTitle}</h3>
                </Link>
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
                  <button
                    onClick={() => handleDownload(cert.id)}
                    disabled={downloading === cert.id}
                    className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-accent-500 transition-colors hover:text-accent-600"
                  >
                    {downloading === cert.id
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Download className="h-3.5 w-3.5" />
                    }
                    {downloading === cert.id ? "Downloading..." : "Download"}
                  </button>
                  <Link
                    href={`/verify/${cert.certificateNumber}`}
                    className="flex items-center gap-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Verify
                  </Link>
                </div>
              </GlassCard>
            </div>
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
