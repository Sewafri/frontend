"use client";

import { useEffect, useState } from "react";
import { Shield } from "lucide-react";

interface SessionIndicatorProps {
  studentName: string;
  compact?: boolean;
}

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function SessionIndicator({ studentName, compact = false }: SessionIndicatorProps) {
  const [time, setTime] = useState(() => formatTimestamp(new Date()));
  const [startedAt] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatTimestamp(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const elapsed = Math.floor(
    (Date.now() - startedAt.getTime()) / 60000,
  );

  if (compact) {
    return (
      <div className="fixed bottom-3 right-3 z-50 flex items-center gap-1.5 rounded-full border border-border-default bg-surface-card/90 px-3 py-1 shadow-sm backdrop-blur-sm">
        <Shield className="h-3 w-3 text-text-tertiary" />
        <span className="text-[10px] text-text-tertiary">{time}</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-3 left-3 z-50 flex items-center gap-2 rounded-lg border border-border-default bg-surface-card/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
      <Shield className="h-3.5 w-3.5 text-accent-500" />
      <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
        <span className="font-medium text-text-primary">{studentName}</span>
        <span className="text-text-tertiary">·</span>
        <span>
          {elapsed}m {time}
        </span>
      </div>
    </div>
  );
}
