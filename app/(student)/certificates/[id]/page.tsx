"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Award, Loader2, ShieldX } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import { BlockchainProof } from "@/components/blockchain/blockchain-proof";
import { CertificateMint } from "@/components/certificates/certificate-mint";
import { verifyCertificate } from "@/lib/data/verify";
import { downloadCertificate } from "@/lib/data/wallet";
import type { BlockchainRecord } from "@/types/db";

export default function CertificateDetailPage() {
  const params = useParams();
  const certId = params.id as string;
  const [downloading, setDownloading] = useState(false);
  const [data, setData] = useState<{
    studentName: string;
    courseTitle: string;
    issuerName: string;
    issueDate: string;
    network: string | null;
    txHash: string | null;
    tokenId: string | null;
    anchorStatus: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    verifyCertificate(certId)
      .then((result) => {
        if (result.result === "VALID") {
          setData({
            studentName: result.studentName,
            courseTitle: result.courseTitle,
            issuerName: result.issuerName,
            issueDate: result.issueDate,
            network: result.network,
            txHash: result.txHash,
            tokenId: result.tokenId,
            anchorStatus: result.anchorStatus,
          });
        } else {
          setError(result.result === "REVOKED" ? "This certificate has been revoked" : "Certificate not found");
        }
      })
      .catch((err) => setError(err.message ?? "Failed to load certificate"))
      .finally(() => setLoading(false));
  }, [certId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-text-tertiary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <Link href="/certificates" className="mb-6 flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to certificates
        </Link>
        <GlassCard>
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-red/10">
              <ShieldX className="h-8 w-8 text-accent-red" />
            </div>
            <p className="text-lg font-medium text-text-primary">{error}</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  const blockchainRecord: BlockchainRecord | null =
    data.network && data.txHash
      ? ({
          id: "",
          network: data.network,
          txHash: data.txHash,
          tokenId: data.tokenId,
          contractAddress: "",
          anchorStatus: data.anchorStatus as BlockchainRecord["anchorStatus"],
          anchoredAt: null,
          createdAt: "",
          updatedAt: "",
        } as BlockchainRecord)
      : null;

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/certificates" className="mb-6 flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to certificates
      </Link>

      <GlassCard className="mb-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-500/10">
            <Award className="h-7 w-7 text-accent-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">{data.courseTitle}</h1>
            <p className="text-sm text-text-secondary">Course Completion Certificate</p>
          </div>
        </div>

        <div className="mb-6 space-y-3 rounded-lg bg-surface-card p-4">
          <div className="flex justify-between">
            <span className="text-sm text-text-tertiary">Student</span>
            <span className="text-sm font-medium text-text-primary">{data.studentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-tertiary">Issuer</span>
            <span className="text-sm font-medium text-text-primary">{data.issuerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-tertiary">Issued on</span>
            <span className="text-sm text-text-primary">
              {new Date(data.issueDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-tertiary">Certificate ID</span>
            <span className="font-mono text-sm text-text-primary">{certId}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setDownloading(true); downloadCertificate(certId).finally(() => setDownloading(false)); }}
            disabled={downloading}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-text-on-accent transition-colors hover:bg-accent-600 disabled:opacity-50"
          >
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {downloading ? "Downloading..." : "Download PDF"}
          </button>
        </div>
      </GlassCard>

      <div className="mb-6">
        <CertificateMint
          certificateId={certId}
          alreadyMinted={!!data.tokenId}
          txHash={data.txHash}
          network={data.network}
          onMinted={(hash, net) => {
            setData(prev => prev ? { ...prev, txHash: hash, network: net } : prev)
          }}
        />
      </div>

      {blockchainRecord && (
        <BlockchainProof record={blockchainRecord} />
      )}
    </div>
  );
}
