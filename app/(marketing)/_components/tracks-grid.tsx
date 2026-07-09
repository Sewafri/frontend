import Link from "next/link";
import { ArrowRight, Clock, Users } from "lucide-react";
import { TRACKS } from "@/constants/landing";
import { Globe, Brain, Palette } from "lucide-react";

const TRACK_ICONS: Record<string, typeof Globe> = {
  globe: Globe,
  brain: Brain,
  palette: Palette,
};

export default function TracksGrid() {
  return (
    <section className="py-24">
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/10 bg-accent-50/50 px-3 py-1 text-xs font-medium text-accent-500 mb-3">
          Learning paths
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-text-primary text-balance">
          Learning tracks
        </h2>
        <p className="mt-2 text-base text-text-secondary">
          Follow a path, from zero to job-ready
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {TRACKS.map((track) => {
          const Icon = TRACK_ICONS[track.icon] || Globe;

          return (
            <div
              key={track.id}
              className="group rounded-2xl border border-border-default bg-surface-card p-7 transition-all hover:border-accent-500/30 hover:shadow-sm"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border-default text-text-secondary transition-colors group-hover:border-accent-500/30 group-hover:text-accent-500">
                <Icon size={22} />
              </div>

              <h3 className="text-lg font-bold text-text-primary">
                {track.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {track.description}
              </p>

              <ul className="mt-6 space-y-2">
                {track.courses.map((course) => (
                  <li key={course.id}>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="group/item flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-surface-sunken"
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
          );
        })}
      </div>
    </section>
  );
}
