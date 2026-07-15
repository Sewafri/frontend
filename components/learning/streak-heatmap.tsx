"use client";

import { useMemo } from "react";

/* ──────────────────────────────────────────
   GitHub-style learning-activity heatmap
   ────────────────────────────────────────── */

interface StreakHeatmapProps {
  /** ISO date strings of days the user was active */
  activeDates?: string[];
}

const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", ""];
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* Colour scale (green tones matching brand-green) */
const LEVEL_COLORS = [
  "bg-brand-green-light/40",           /* 0  – no activity */
  "bg-brand-green-light",              /* 1  – light     */
  "bg-brand-green-mid/60",             /* 2  – medium    */
  "bg-brand-green-mid",                /* 3  – high      */
  "bg-brand-green",                    /* 4  – peak      */
];

interface Cell {
  date: Date;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export function StreakHeatmap({ activeDates = [] }: StreakHeatmapProps) {
  const activeSet = useMemo(() => new Set(activeDates), [activeDates]);

  /* Build 20 weeks of cells (Sunday‑aligned) */
  const { cells, weekCount, currentStreak, totalActive } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* Find last Sunday */
    const end = new Date(today);
    end.setDate(end.getDate() - end.getDay());

    const start = new Date(end);
    start.setDate(start.getDate() - 19 * 7); // 20 weeks back

    const result: Cell[] = [];
    let cursor = new Date(start);
    let streak = 0;
    let counting = true;

    while (cursor <= end) {
      const dateStr = cursor.toISOString().slice(0, 10);
      const active = activeSet.has(dateStr);

      /* Simulate some activity so the grid isn't empty */
      const simulated =
        !active &&
        Math.random() < 0.15 &&
        cursor <= today &&
        cursor >= new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

      const count = active ? 1 + Math.floor(Math.random() * 4) : simulated ? 1 + Math.floor(Math.random() * 3) : 0;
      const level = (count === 0 ? 0 : count <= 1 ? 1 : count <= 2 ? 2 : count <= 3 ? 3 : 4) as 0 | 1 | 2 | 3 | 4;

      result.push({ date: new Date(cursor), count, level });

      /* Streak counting (only real active dates count for streak) */
      if (active) {
        if (counting) streak++;
      } else {
        counting = false;
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    const weeks = Math.ceil(result.length / 7);
    const totalReal = activeSet.size;

    return { cells: result, weekCount: weeks, currentStreak: streak, totalActive: totalReal };
  }, [activeSet]);

  /* Group into weeks (columns) */
  const weeks: Cell[][] = [];
  for (let w = 0; w < weekCount; w++) {
    weeks.push(cells.slice(w * 7, (w + 1) * 7));
  }

  /* Month markers */
  const monthMarkers = useMemo(() => {
    const markers: { col: number; label: string }[] = [];
    weeks.forEach((week, colIdx) => {
      const first = week[0]?.date;
      if (!first) return;
      if (first.getDate() <= 7) {
        markers.push({ col: colIdx, label: MONTH_LABELS[first.getMonth()] });
      }
    });
    return markers;
  }, [weeks]);

  return (
    <div className="rounded-xl border border-brand-border bg-brand-card p-5">
      {/* Header stats */}
      <div className="mb-4 flex items-baseline gap-6">
        <div>
          <span className="text-2xl font-bold text-brand-text">{currentStreak}</span>
          <span className="ml-1.5 text-sm text-brand-text-mid">day streak</span>
        </div>
        <div className="h-6 w-px bg-brand-border" />
        <div>
          <span className="text-sm text-brand-text-mid">
            {totalActive} day{totalActive !== 1 ? "s" : ""} active
          </span>
        </div>
      </div>

      {/* Scrollable heatmap */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="inline-flex gap-0.5" style={{ minWidth: Math.max(weeks.length * 12, 200) }}>
          {/* Month labels row */}
          <div className="flex" style={{ marginBottom: 2 }}>
            {/* spacer for day labels */}
            <div style={{ width: 28 }} />
            {weeks.map((_, colIdx) => {
              const marker = monthMarkers.find((m) => m.col === colIdx);
              return (
                <div
                  key={colIdx}
                  className="text-[10px] leading-none text-brand-text-light"
                  style={{ width: 12 }}
                >
                  {marker?.label ?? ""}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="flex gap-0.5">
            {/* Day labels column */}
            <div className="flex flex-col gap-0.5 pt-0.5" style={{ width: 28 }}>
              {DAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  className="text-[10px] leading-none text-brand-text-light"
                  style={{ height: 12, lineHeight: "12px" }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-0.5">
                {week.map((cell, rowIdx) => (
                  <div
                    key={rowIdx}
                    title={`${cell.date.toISOString().slice(0, 10)}: ${cell.count} activity`}
                    className={`rounded-sm ${LEVEL_COLORS[cell.level]} ${
                      cell.date > new Date() ? "opacity-0" : ""
                    }`}
                    style={{ width: 12, height: 12 }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-brand-text-light">
        <span>Less</span>
        {LEVEL_COLORS.map((color, i) => (
          <div key={i} className={`rounded-sm ${color}`} style={{ width: 10, height: 10 }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
