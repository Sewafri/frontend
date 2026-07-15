"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Award, Trophy, Loader2 } from "lucide-react";
import { BRAND } from "@/constants/brand";
import { BlockchainBadge } from "@/components/blockchain/blockchain-badge";
import { getPublicWallet } from "@/lib/data/wallet";
import type { WalletDTO } from "@/lib/data/wallet";

export default function PublicWalletPage() {
  const params = useParams();
  const publicUrl = params.userId as string;
  const [wallet, setWallet] = useState<WalletDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublicWallet(publicUrl)
      .then((data) => setWallet(data))
      .catch((err) => setError(err.message ?? "Wallet not found"))
      .finally(() => setLoading(false));
  }, [publicUrl]);

  const certificates = wallet?.certificates ?? [];
  const badges = wallet?.badges ?? [];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-sunken">
        <Loader2 className="h-6 w-6 animate-spin text-text-tertiary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-sunken">
      <header className="border-b border-border-default px-6 py-4">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-space-grotesk text-lg font-bold text-text-primary">{BRAND.name}</span>
          <span className="h-2 w-2 rounded-full bg-accent-500" />
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {error || !wallet ? (
          <div className="text-center py-16">
            <Trophy className="mx-auto mb-4 h-12 w-12 text-text-tertiary" />
            <h1 className="text-xl font-bold text-text-primary">Wallet Not Found</h1>
            <p className="mt-1 text-sm text-text-secondary">{error ?? "This wallet does not exist or is private."}</p>
          </div>
        ) : (
          <>
            <div className="mb-10 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent-500/10">
                <Trophy className="h-10 w-10 text-accent-500" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Achievement Wallet</h1>
              <p className="mt-1 text-text-secondary">Public learner profile</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-500/10 px-4 py-1.5">
                <Award className="h-4 w-4 text-accent-500" />
                <span className="text-sm font-medium text-accent-500">
                  {badges.length} badges{certificates.length > 0 ? `, ${certificates.length} certificates` : ""}
                </span>
              </div>
            </div>

            {certificates.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-4 text-lg font-semibold text-text-primary">Certificates</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {certificates.map((cert) => (
                    <Link
                      key={cert.id}
                      href={`/verify/${cert.certificateNumber}`}
                      className="group block"
                    >
                      <div className="rounded-xl border border-border-default bg-surface-card p-4 transition-all hover:border-accent-500/30">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-semibold text-text-primary group-hover:text-accent-500">
                              {cert.courseTitle}
                            </h3>
                            <p className="mt-0.5 text-xs text-text-tertiary">
                              {cert.issueDate
                                ? new Date(cert.issueDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "—"}
                            </p>
                          </div>
                          <BlockchainBadge
                            record={cert.blockchainRecord ?? null}
                            anchorStatus={cert.blockchainRecord?.anchorStatus ?? null}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <h2 className="mb-4 text-lg font-semibold text-text-primary">Badges</h2>
            {badges.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="rounded-xl border border-border-default bg-surface-card p-5"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10 overflow-hidden">
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
                        <Trophy className="h-6 w-6 text-accent-500" />
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary">{badge.name}</h3>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {badge.skills?.join(", ") || "Achievement badge"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border-default bg-surface-card p-8 text-center">
                <p className="text-sm text-text-secondary">No badges yet</p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-border-default px-6 py-4 text-center text-xs text-text-secondary">
        Powered by {BRAND.name}
      </footer>
    </div>
  );
}
