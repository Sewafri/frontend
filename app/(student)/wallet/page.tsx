"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { BlockchainBadge } from "@/components/blockchain/blockchain-badge";
import {
  getMyWallet, updateWalletVisibility, downloadCertificate,
} from "@/lib/data/wallet";
import type { WalletDTO, BadgeDTO } from "@/lib/data/wallet";
import { Award, Trophy, Globe, Copy, Check, Loader2, Download } from "lucide-react";
import type { Certificate } from "@/types/db";

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const fetchWallet = () => {
    setLoading(true);
    getMyWallet()
      .then((data) => setWallet(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWallet() }, []);

  const handleCopyLink = () => {
    if (!wallet?.publicUrl) return;
    navigator.clipboard.writeText(`${window.location.origin}/wallet/${wallet.publicUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleVisibility = async () => {
    if (!wallet) return;
    setToggling(true);
    try {
      await updateWalletVisibility(!wallet.isPublic);
      setWallet((prev) => prev ? { ...prev, isPublic: !prev.isPublic } : prev);
    } catch {
      // silently fail
    } finally {
      setToggling(false);
    }
  };

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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-text-tertiary" />
      </div>
    );
  }

  const certificates = wallet?.certificates ?? [];
  const badges = wallet?.badges ?? [];

  return (
    <div>
      <PageHeader
        title="My Wallet"
        description="Your certificates, badges, and public profile"
      />

      {/* Stats + Controls */}
      <GlassCard className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="text-3xl font-bold text-text-primary">{badges.length}</span>
              <p className="text-xs text-text-tertiary">Badges</p>
            </div>
            <div className="h-12 w-px bg-border-default" />
            <div className="text-center">
              <span className="text-3xl font-bold text-text-primary">{certificates.length}</span>
              <p className="text-xs text-text-tertiary">Certificates</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {wallet?.publicUrl && (
              <button
                onClick={handleCopyLink}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border-default px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-accent-green" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy Wallet Link"}
              </button>
            )}
            <button
              onClick={handleToggleVisibility}
              disabled={toggling}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                wallet?.isPublic
                  ? "border-accent-green/30 bg-accent-green/5 text-accent-green"
                  : "border-border-default text-text-secondary hover:bg-surface-hover"
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              {wallet?.isPublic ? "Public" : "Private"}
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Certificates */}
      {certificates.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Certificates</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <GlassCard key={cert.id} variant="bordered" className="transition-all hover:border-accent-500/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/10">
                      <Award className="h-5 w-5 text-accent-500" />
                    </div>
                    <div>
                      <Link
                        href={`/certificates/${cert.id}`}
                        className="text-sm font-semibold text-text-primary hover:text-accent-500"
                      >
                        {cert.courseTitle}
                      </Link>
                      <p className="text-xs text-text-tertiary">
                        {cert.issueDate
                          ? new Date(cert.issueDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                            })
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(cert.id)}
                      disabled={downloading === cert.id}
                      className="cursor-pointer rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                      title="Download PDF"
                    >
                      {downloading === cert.id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Download className="h-4 w-4" />
                      }
                    </button>
                    <BlockchainBadge
                      record={cert.blockchainRecord ?? null}
                      anchorStatus={cert.blockchainRecord?.anchorStatus ?? null}
                    />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {badges.length > 0 ? (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Badges</h2>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map((badge) => (
              <GlassCard key={badge.id} variant="bordered">
                <div className="flex flex-col items-center py-4 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10">
                    <Trophy className="h-6 w-6 text-accent-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">{badge.name}</h3>
                  <p className="mt-0.5 text-xs text-text-tertiary">
                    {badge.skills?.join(", ") || "Achievement badge"}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      ) : (
        <GlassCard>
          <div className="flex flex-col items-center py-12">
            <Trophy className="mb-3 h-10 w-10 text-text-tertiary" />
            <p className="text-sm text-text-secondary">No badges or certificates yet</p>
            <p className="mt-1 text-xs text-text-tertiary">Complete courses to earn them</p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
