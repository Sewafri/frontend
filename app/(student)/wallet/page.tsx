"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { BlockchainBadge } from "@/components/blockchain/blockchain-badge";
import { getMyWallet } from "@/lib/data/wallet";
import type { BadgeDTO } from "@/lib/data/wallet";
import { Trophy, Star, Target, Zap, BookOpen, Code, Palette, Globe, Award } from "lucide-react";
import type { Certificate } from "@/types/db";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof Trophy;
  earned: boolean;
}

const FALLBACK_ACHIEVEMENTS: Achievement[] = [
  { id: "a1", title: "Quick Starter", description: "Completed your first lesson", icon: Zap, earned: true },
  { id: "a2", title: "Bookworm", description: "Completed 5 courses", icon: BookOpen, earned: true },
  { id: "a3", title: "Code Master", description: "Scored 100% on a coding quiz", icon: Code, earned: true },
  { id: "a4", title: "Design Pro", description: "Completed the UI/UX path", icon: Palette, earned: true },
  { id: "a5", title: "Streak King", description: "7-day learning streak", icon: Trophy, earned: true },
  { id: "a6", title: "Globetrotter", description: "Enrolled in courses from 3 categories", icon: Globe, earned: false },
  { id: "a7", title: "Star Student", description: "Achieve a 4.5+ average rating", icon: Star, earned: false },
  { id: "a8", title: "Goal Crusher", description: "Complete 10 course milestones", icon: Target, earned: false },
];

export default function WalletPage() {
  const [achievements, setAchievements] = useState<Achievement[]>(FALLBACK_ACHIEVEMENTS);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyWallet()
      .then((data) => {
        if (data.badges && data.badges.length > 0) {
          const mapped: Achievement[] = (data.badges as BadgeDTO[]).map((b, i) => ({
            id: b.id ?? `b${i}`,
            title: b.name ?? "Achievement",
            description: "",
            icon: Trophy,
            earned: true,
          }));
          if (mapped.length > 0) setAchievements(mapped);
        }
        if (data.certificates && data.certificates.length > 0) {
          setCertificates(data.certificates as Certificate[]);
        }
      })
      .catch(() => {
        // MOCK: wallet endpoint may not have data — keep fallback achievements
      })
      .finally(() => setLoading(false));
  }, []);

  const earned = achievements.filter((a) => a.earned);
  const locked = achievements.filter((a) => !a.earned);

  return (
    <div>
      <PageHeader
        title="Achievement Wallet"
        description="Your earned badges, certificates, and achievements"
      />

      <GlassCard className="mb-8">
        <div className="flex items-center justify-center gap-8 py-6">
          <div className="text-center">
            <span className="text-3xl font-bold text-text-primary">{earned.length}</span>
            <p className="text-xs text-text-tertiary">Badges Earned</p>
          </div>
          <div className="h-12 w-px bg-border-default" />
          <div className="text-center">
            <span className="text-3xl font-bold text-text-primary">{certificates.length}</span>
            <p className="text-xs text-text-tertiary">Certificates</p>
          </div>
          <div className="h-12 w-px bg-border-default" />
          <div className="text-center">
            <span className="text-3xl font-bold text-text-primary">{achievements.length}</span>
            <p className="text-xs text-text-tertiary">Total</p>
          </div>
        </div>
      </GlassCard>

      {certificates.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Earned Certificates</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <Link
                key={cert.id}
                href={`/certificates/${cert.id}`}
                className="group block"
              >
                <GlassCard variant="bordered" className="transition-all hover:border-accent-500/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/10">
                        <Award className="h-5 w-5 text-accent-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-500">
                          {cert.courseTitle}
                        </h3>
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
                    <BlockchainBadge
                      record={cert.blockchainRecord ?? null}
                      anchorStatus={cert.blockchainRecord?.anchorStatus ?? null}
                    />
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold text-text-primary">Earned Badges</h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {earned.map((a) => {
          const Icon = a.icon;
          return (
            <GlassCard key={a.id} variant="bordered">
              <div className="flex flex-col items-center py-4 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10">
                  <Icon className="h-6 w-6 text-accent-500" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">{a.title}</h3>
                <p className="mt-0.5 text-xs text-text-tertiary">{a.description}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <h2 className="mb-4 text-lg font-semibold text-text-primary">Locked</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {locked.map((a) => {
          const Icon = a.icon;
          return (
            <GlassCard key={a.id} className="opacity-60">
              <div className="flex flex-col items-center py-4 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken">
                  <Icon className="h-6 w-6 text-text-tertiary" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">{a.title}</h3>
                <p className="mt-0.5 text-xs text-text-tertiary">{a.description}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
