"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BlockchainBadge } from "@/components/blockchain/blockchain-badge";
import { getMyWallet, downloadCertificate } from "@/lib/data/wallet";
import { Award, Download, ExternalLink, Loader2 } from "lucide-react";
import Companion from "@/components/companion/companion";
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
        {/* Header skeleton */}
        <div className="mb-7 animate-pulse">
          <div className="h-8 w-52 rounded-lg bg-brand-green-light/60" />
          <div className="mt-2 h-4 w-72 rounded bg-brand-green-light/40" />
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-brand-text-light" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">
          My Certificates
        </h1>
        <p className="mt-1 text-sm text-brand-text-mid">
          View and download your course completion certificates
        </p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group rounded-xl border border-brand-border bg-brand-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <Link href={`/certificates/${cert.id}`}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-green-light">
                    <Award className="h-7 w-7 text-brand-green" />
                  </div>
                </Link>
                <BlockchainBadge
                  record={cert.blockchainRecord ?? null}
                  anchorStatus={cert.blockchainRecord?.anchorStatus ?? null}
                />
              </div>
              <Link href={`/certificates/${cert.id}`}>
                <h3 className="mb-1 text-sm font-semibold text-brand-text transition-colors group-hover:text-brand-green">
                  {cert.courseTitle}
                </h3>
              </Link>
              <p className="mb-4 text-xs text-brand-text-mid">
                {cert.issueDate
                  ? new Date(cert.issueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </p>
              <div className="flex items-center gap-3 border-t border-brand-border pt-4">
                <button
                  onClick={() => handleDownload(cert.id)}
                  disabled={downloading === cert.id}
                  className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-brand-green transition-colors hover:text-brand-green-dark"
                >
                  {downloading === cert.id
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Download className="h-3.5 w-3.5" />
                  }
                  {downloading === cert.id ? "Downloading..." : "Download"}
                </button>
                <Link
                  href={`/verify/${cert.certificateNumber}`}
                  className="flex items-center gap-1.5 text-xs font-medium text-brand-text-mid transition-colors hover:text-brand-text"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Verify
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-brand-border bg-brand-card">
          <div className="flex flex-col items-center py-14">
            <Companion
              message="Complete a course to earn your first certificate."
              variant="happy"
              size="lg"
              bubblePosition="top"
              animate
              className="mb-4"
            />
            <Link
              href="/my-learning"
              className="rounded-lg bg-brand-green px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark"
            >
              Go to My Learning
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
