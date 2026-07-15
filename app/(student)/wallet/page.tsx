"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlockchainBadge } from "@/components/blockchain/blockchain-badge";
import { WalletLinkButton } from "@/components/wallet/wallet-link-button";
import { VaultSection } from "@/components/wallet/vault-section";
import {
  getMyWallet, updateWalletVisibility, downloadCertificate,
} from "@/lib/data/wallet";
import type { WalletDTO, BadgeDTO } from "@/lib/data/wallet";
import { Award, Trophy, Globe, Copy, Check, Loader2, Download, Wallet } from "lucide-react";
import type { Certificate } from "@/types/db";
import { useAuth } from "@/lib/auth/auth-context";

export default function WalletPage() {
  const { user } = useAuth();
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
        <Loader2 className="h-6 w-6 animate-spin text-brand-text-light" />
      </div>
    );
  }

  const certificates = wallet?.certificates ?? [];
  const badges = wallet?.badges ?? [];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">
          My Wallet
        </h1>
        <p className="mt-1 text-sm text-brand-text-mid">
          Your certificates, badges, and public profile
        </p>
      </div>

      {/* Wallet Linking */}
      <div className="mb-6 rounded-xl border border-brand-border bg-brand-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <Wallet className="h-4 w-4 text-brand-green" />
          <span className="text-xs font-semibold text-brand-text">Crypto Wallet</span>
        </div>
        <WalletLinkButton
          linkedAddress={user?.walletAddress ?? null}
          onLinked={() => window.location.reload()}
          onUnlinked={() => window.location.reload()}
        />
      </div>

      {/* Vault / Redemption */}
      <div className="mb-8">
        <VaultSection />
      </div>

      {/* Stats + Controls */}
      <div className="mb-8 rounded-xl border border-brand-border bg-brand-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="text-3xl font-bold text-brand-text">{badges.length}</span>
              <p className="text-xs text-brand-text-light">Badges</p>
            </div>
            <div className="h-12 w-px bg-brand-border" />
            <div className="text-center">
              <span className="text-3xl font-bold text-brand-text">{certificates.length}</span>
              <p className="text-xs text-brand-text-light">Certificates</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {wallet?.publicUrl && (
              <button
                onClick={handleCopyLink}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-brand-border px-3 py-2 text-xs font-medium text-brand-text-mid transition-colors hover:bg-brand-bg"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-brand-green" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy Wallet Link"}
              </button>
            )}
            <button
              onClick={handleToggleVisibility}
              disabled={toggling}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                wallet?.isPublic
                  ? "border-brand-green/30 bg-brand-green-light text-brand-green"
                  : "border-brand-border text-brand-text-mid hover:bg-brand-bg"
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              {wallet?.isPublic ? "Public" : "Private"}
            </button>
          </div>
        </div>
      </div>

      {/* Certificates */}
      {certificates.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-brand-text">Certificates</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <div key={cert.id} className="rounded-xl border border-brand-border bg-brand-card p-4 transition-all duration-200 hover:shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green-light">
                      <Award className="h-5 w-5 text-brand-green" />
                    </div>
                    <div>
                      <Link
                        href={`/certificates/${cert.id}`}
                        className="text-sm font-semibold text-brand-text hover:text-brand-green"
                      >
                        {cert.courseTitle}
                      </Link>
                      <p className="text-xs text-brand-text-light">
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
                      className="cursor-pointer rounded-lg p-1.5 text-brand-text-mid transition-colors hover:bg-brand-bg hover:text-brand-text"
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {badges.length > 0 ? (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-brand-text">Badges</h2>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map((badge) => (
              <div key={badge.id} className="rounded-xl border border-brand-border bg-brand-card p-5 text-center transition-all duration-200 hover:shadow-sm">
                <div className="mb-3 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-amber-light overflow-hidden">
                    {badge.iconUrl ? (
                      <Image
                        src={badge.iconUrl}
                        alt={badge.name}
                        width={40}
                        height={40}
                        className="h-8 w-8 object-contain"
                        unoptimized
                      />
                    ) : (
                      <Trophy className="h-6 w-6 text-brand-amber" />
                    )}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-brand-text">{badge.name}</h3>
                <p className="mt-0.5 text-xs text-brand-text-light">
                  {badge.skills?.join(", ") || "Achievement badge"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-brand-border bg-brand-card">
          <div className="flex flex-col items-center py-12">
            <Trophy className="mb-4 h-12 w-12 text-brand-text-light" />
            <p className="text-sm text-brand-text-mid">No badges or certificates yet</p>
            <p className="mt-1.5 text-xs text-brand-text-light">Complete courses to earn them</p>
          </div>
        </div>
      )}
    </div>
  );
}
