import GlassCard from "@/components/ui/glass-card";
import ProgressBar from "@/components/ui/progress-bar";
import { StatCard } from "@/components/ui/stat-card";
import { PageHeader } from "@/components/ui/page-header";
import { STUDENT_STATS, CONTINUE_COURSES, UPCOMING_DEADLINES, LEARNING_STREAK } from "@/constants/dashboard";
import { BookOpen, Calendar, Flame, Clock } from "lucide-react";
import Link from "next/link";

const STREAK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const currentStreak = (() => {
  let count = 0;
  for (let i = LEARNING_STREAK.length - 1; i >= 0; i--) {
    if (LEARNING_STREAK[i]) count++;
    else break;
  }
  return count;
})();

const bestStreak = (() => {
  let max = 0, cur = 0;
  for (const active of LEARNING_STREAK) {
    if (active) cur++;
    else { max = Math.max(max, cur); cur = 0; }
  }
  return Math.max(max, cur);
})();

export default function MyLearningPage() {
  return (
    <div className="">
      <PageHeader
        title="My Learning"
        description="Track your progress and continue learning"
      />

      {/* Stat Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STUDENT_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Continue Learning */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-white">Continue Learning</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {CONTINUE_COURSES.map((course) => (
            <Link key={course.id} href={`/my-learning/${course.id}`} className="group block cursor-pointer">
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-orange/10">
                    <BookOpen className="h-6 w-6 text-brand-orange" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white transition-colors group-hover:text-brand-orange">
                      {course.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-text-secondary">{course.category}</p>
                    <ProgressBar value={course.progress} size="sm" className="mt-3" />
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom Row: Deadlines + Streak */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Deadlines */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">Upcoming Deadlines</h2>
          <GlassCard>
            {UPCOMING_DEADLINES.length > 0 ? (
              <div className="space-y-3">
                {UPCOMING_DEADLINES.map((dl) => (
                  <div
                    key={dl.id}
                    className={`flex items-center gap-3 rounded-lg p-3 ${
                      dl.urgent ? "bg-red-500/5" : "bg-surface-card"
                    }`}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      dl.type === "assignment"
                        ? "bg-brand-orange/10"
                        : dl.type === "quiz"
                          ? "bg-blue-500/10"
                          : "bg-purple-500/10"
                    }`}>
                      {dl.type === "quiz" ? (
                        <Calendar className="h-4 w-4 text-blue-400" />
                      ) : dl.type === "project" ? (
                        <Clock className="h-4 w-4 text-purple-400" />
                      ) : (
                        <BookOpen className="h-4 w-4 text-brand-orange" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{dl.title}</span>
                        {dl.urgent && (
                          <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-400">
                            URGENT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary">{dl.course} &mdash; {dl.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-text-secondary">No upcoming deadlines</p>
            )}
          </GlassCard>
        </section>

        {/* Streak */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">Learning Streak</h2>
          <GlassCard>
            <div className="flex flex-col items-center py-4">
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/10">
                <Flame className="h-8 w-8 text-brand-orange" />
              </div>
              <span className="text-3xl font-bold text-white">{currentStreak}</span>
              <span className="text-sm text-text-secondary">day streak</span>
              <div className="mt-4 flex gap-1.5">
                {LEARNING_STREAK.map((active, i) => (
                  <div
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium ${
                      active
                        ? "bg-brand-orange text-white"
                        : "bg-surface-card text-text-secondary"
                    }`}
                  >
                    {STREAK_DAYS[i]}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-text-secondary">
                {bestStreak} day best streak
              </p>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
