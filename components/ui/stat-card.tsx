import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ label, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border-default bg-surface-card p-5 transition-colors hover:bg-surface-sunken">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-text-primary">{value}</p>
          {trend && (
            <p className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              trendUp ? "text-accent-green" : "text-accent-red",
            )}>
              <span className={cn(
                "inline-block h-1.5 w-1.5 rounded-full",
                trendUp ? "bg-accent-green" : "bg-accent-red",
              )} />
              {trend}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-500">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
