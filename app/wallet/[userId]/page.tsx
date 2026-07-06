import Link from "next/link";
import { Award, Trophy, Star, Zap, BookOpen } from "lucide-react";
import { BRAND } from "@/constants/brand";

const PUBLIC_ACHIEVEMENTS = [
  { id: "a1", title: "Quick Starter", description: "Completed your first lesson", icon: "Zap", earned: true },
  { id: "a2", title: "Bookworm", description: "Completed 5 courses", icon: "BookOpen", earned: true },
  { id: "a3", title: "Code Master", description: "Scored 100% on a coding quiz", icon: "Award", earned: true },
  { id: "a4", title: "Streak King", description: "7-day learning streak", icon: "Trophy", earned: true },
  { id: "a5", title: "Star Student", description: "4.5+ average rating", icon: "Star", earned: false },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="h-6 w-6 text-brand-orange" />,
  BookOpen: <BookOpen className="h-6 w-6 text-brand-orange" />,
  Award: <Award className="h-6 w-6 text-brand-orange" />,
  Trophy: <Trophy className="h-6 w-6 text-brand-orange" />,
  Star: <Star className="h-6 w-6 text-brand-orange" />,
};

export default function PublicWalletPage() {
  const earnedCount = PUBLIC_ACHIEVEMENTS.filter((a) => a.earned).length;

  return (
    <div className="min-h-screen bg-surface-dark">
      <header className="border-b border-border-glass px-6 py-4">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-space-grotesk text-lg font-bold text-white">{BRAND.name}</span>
          <span className="h-2 w-2 rounded-full bg-brand-orange" />
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange/10">
            <Trophy className="h-10 w-10 text-brand-orange" />
          </div>
          <h1 className="text-2xl font-bold text-white">Achievement Wallet</h1>
          <p className="mt-1 text-text-secondary">Public learner profile</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-4 py-1.5">
            <Award className="h-4 w-4 text-brand-orange" />
            <span className="text-sm font-medium text-brand-orange">{earnedCount} achievements earned</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PUBLIC_ACHIEVEMENTS.map((a) => (
            <div
              key={a.id}
              className={`rounded-xl border p-5 ${
                a.earned
                  ? "border-border-glass bg-surface-dark"
                  : "border-border-glass bg-surface-dark opacity-50"
              }`}
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10">
                {ICON_MAP[a.icon]}
              </div>
              <h3 className={`text-sm font-semibold ${a.earned ? "text-white" : "text-text-secondary"}`}>
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
