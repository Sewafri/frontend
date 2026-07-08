"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Award, Trophy, Star, Zap, BookOpen } from "lucide-react";
import { BRAND } from "@/constants/brand";
import { getPublicWallet } from "@/lib/data/wallet";

const FALLBACK_ACHIEVEMENTS = [
  { id: "a1", title: "Quick Starter", description: "Completed your first lesson", icon: "Zap", earned: true },
  { id: "a2", title: "Bookworm", description: "Completed 5 courses", icon: "BookOpen", earned: true },
  { id: "a3", title: "Code Master", description: "Scored 100% on a coding quiz", icon: "Award", earned: true },
  { id: "a4", title: "Streak King", description: "7-day learning streak", icon: "Trophy", earned: true },
  { id: "a5", title: "Star Student", description: "4.5+ average rating", icon: "Star", earned: false },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="h-6 w-6 text-brand-500" />,
  BookOpen: <BookOpen className="h-6 w-6 text-brand-500" />,
  Award: <Award className="h-6 w-6 text-brand-500" />,
  Trophy: <Trophy className="h-6 w-6 text-brand-500" />,
  Star: <Star className="h-6 w-6 text-brand-500" />,
};

export default function PublicWalletPage() {
  const params = useParams();
  const publicUrl = params.userId as string;
  const [achievements, setAchievements] = useState(FALLBACK_ACHIEVEMENTS);

  useEffect(() => {
    getPublicWallet(publicUrl)
      .then((data) => {
        if (data.badges && data.badges.length > 0) {
          const mapped = (data.badges as Record<string, unknown>[]).map((b, i) => ({
            id: String(b.id ?? `b${i}`),
            title: String(b.name ?? "Achievement"),
            description: "",
            icon: "Award",
            earned: true,
          }));
          if (mapped.length > 0) setAchievements(mapped);
        }
      })
      .catch(() => {
        // MOCK: keep fallback data
      });
  }, [publicUrl]);

  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <div className="min-h-screen bg-surface-dark">
      <header className="border-b border-border-glass px-6 py-4">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-space-grotesk text-lg font-bold text-text-primary">{BRAND.name}</span>
          <span className="h-2 w-2 rounded-full bg-brand-500" />
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/10">
            <Trophy className="h-10 w-10 text-brand-500" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Achievement Wallet</h1>
          <p className="mt-1 text-text-secondary">Public learner profile</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-1.5">
            <Award className="h-4 w-4 text-brand-500" />
            <span className="text-sm font-medium text-brand-500">{earnedCount} achievements earned</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`rounded-xl border p-5 ${
                a.earned
                  ? "border-border-glass bg-surface-dark"
                  : "border-border-glass bg-surface-dark opacity-50"
              }`}
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10">
                {ICON_MAP[a.icon]}
              </div>
              <h3 className={`text-sm font-semibold ${a.earned ? "text-text-primary" : "text-text-secondary"}`}>
                {a.title}
              </h3>
              <p className="mt-0.5 text-xs text-text-secondary">{a.description}</p>
              {!a.earned && <span className="mt-2 inline-block text-[10px] text-text-secondary">Locked</span>}
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border-glass px-6 py-4 text-center text-xs text-text-secondary">
        Powered by {BRAND.name}
      </footer>
    </div>
  );
}
