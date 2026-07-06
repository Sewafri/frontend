import Link from "next/link";
import { TRACKS } from "@/constants/landing";
import { Globe, Brain, Palette, ArrowRight, Clock, Users } from "lucide-react";

const TRACK_ICONS: Record<string, typeof Globe> = {
  globe: Globe,
  brain: Brain,
  palette: Palette,
};

const TRACK_ACCENTS: Record<string, string> = {
  brand: "border-brand-500/30 hover:border-brand-500/60",
  indigo: "border-accent-indigo/30 hover:border-accent-indigo/60",
  purple: "border-accent-purple/30 hover:border-accent-purple/60",
};

const TRACK_BG: Record<string, string> = {
  brand: "from-brand-500/5",
  indigo: "from-accent-indigo/5",
  purple: "from-accent-purple/5",
};

export default function TracksGrid() {
  return (
    <section className="py-20">
      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">
          Learning tracks
        </h2>
        <p className="mt-3 text-base text-text-secondary">
          Follow a structured path from beginner to job-ready
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {TRACKS.map((track) => {
          const Icon = TRACK_ICONS[track.icon] || Globe;
          const accentClass = TRACK_ACCENTS[track.color] || TRACK_ACCENTS.brand;
          const bgClass = TRACK_BG[track.color] || TRACK_BG.brand;

          return (
            <div
              key={track.id}
              className={`group relative overflow-hidden rounded-2xl border bg-surface-card p-7 shadow-sm transition-all duration-200 hover:shadow-lg ${accentClass}`}
            >
              {/* Gradient overlay */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${bgClass} to-transparent`}
              />

              <div className="relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-sunken ring-1 ring-border-default">
                  <Icon size={22} className="text-text-primary" />
                </div>

                <h3 className="text-lg font-bold text-text-primary">
                  {track.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {track.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {track.courses.map((course) => (
                    <li key={course.id}>
                      <Link
                        href={`/courses/${course.slug}`}
                        className="group/item flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-surface-card-hover"
                      >
                        <span className="text-sm font-medium text-text-primary">
                          {course.title}
                        </span>
                        <ArrowRight
                          size={14}
                          className="text-text-tertiary opacity-0 transition-all group-hover/item:opacity-100"
                        />
                      </Link>
                      <div className="flex gap-4 px-3 pb-1">
                        <span className="flex items-center gap-1 text-xs text-text-tertiary">
                          <Clock size={12} />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-text-tertiary">
                          <Users size={12} />
                          {course.studentsCount.toLocaleString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
